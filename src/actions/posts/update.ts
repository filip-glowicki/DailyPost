"use server";

import { z } from "zod";
import { createClient } from "@/utils/supabase/server";
import { logError } from "@/utils/error-logger";
import { ApiResponse, ApiResponseBuilder } from "@/utils/api-response";
import { PostDTO } from "@/types/database-types";
import { UpdatePostCommand } from "@/types/database-types";

// Validation schema for post updates
const updatePostSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).max(200).optional(),
  prompt: z
    .string()
    .min(1)
    .max(500)
    .transform((str) => str || undefined)
    .optional(),
  size: z
    .string()
    .transform((str) => str || undefined)
    .optional(),
  content: z.string().min(1).max(5000).optional(),
  category_id: z.string().uuid().optional(),
});

/**
 * Server action for updating an existing post
 * @param command Update post command containing id and fields to update
 * @returns ApiResponse with the updated post or error details
 */
export async function updatePost(
  command: UpdatePostCommand,
): Promise<ApiResponse<PostDTO>> {
  try {
    // Validate input data
    const validatedData = updatePostSchema.parse(command);

    // Get authenticated user
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return ApiResponseBuilder.unauthorized();
    }

    // First check if post exists and belongs to the user
    const { data: existingPost, error: fetchError } = await supabase
      .from("posts")
      .select("user_id")
      .eq("id", validatedData.id)
      .single();

    if (fetchError) {
      if (fetchError.code === "PGRST116") {
        return ApiResponseBuilder.notFound("Post not found");
      }
      return ApiResponseBuilder.internalError(fetchError.message);
    }

    if (existingPost.user_id !== user.id) {
      return ApiResponseBuilder.forbidden("You can only update your own posts");
    }

    // Remove id from update data as we don't want to update it
    const { id, ...updateData } = validatedData;

    // Perform update operation
    const { data: updatedPost, error: updateError } = await supabase
      .from("posts")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (updateError) {
      return ApiResponseBuilder.internalError(updateError.message);
    }

    return ApiResponseBuilder.success(updatedPost);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return ApiResponseBuilder.validationError(error.errors);
    }

    if (error instanceof Error) {
      await logError({
        error,
        context: "updatePost",
        additionalContext: {
          command: {
            ...command,
            prompt: command.prompt?.substring(0, 100), // Truncate prompt for logging
            content: command.content?.substring(0, 100), // Truncate content for logging
          },
        },
      });

      return ApiResponseBuilder.internalError(error.message);
    }

    return ApiResponseBuilder.internalError();
  }
}
