"use server";

import { z } from "zod";
import { createClient } from "@/utils/supabase/server";
import { DeletePostCommand } from "@/types";
import { logError } from "@/utils/error-logger";
import { ApiResponse, ApiResponseBuilder } from "@/utils/api-response";

// Validation schema for post deletion
const deletePostSchema = z.object({
  id: z.string().uuid(),
});

/**
 * Server action for deleting an existing post
 * @param command Delete post command containing the post id
 * @returns ApiResponse with success message or error details
 */
export async function deletePost(
  command: DeletePostCommand,
): Promise<ApiResponse<{ message: string }>> {
  try {
    // Validate input data
    const validatedData = deletePostSchema.parse(command);

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
      return ApiResponseBuilder.forbidden("You can only delete your own posts");
    }

    // Perform delete operation
    const { error: deleteError } = await supabase
      .from("posts")
      .delete()
      .eq("id", validatedData.id);

    if (deleteError) {
      return ApiResponseBuilder.internalError(deleteError.message);
    }

    return ApiResponseBuilder.success({ message: "Post deleted successfully" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return ApiResponseBuilder.validationError(error.errors);
    }

    if (error instanceof Error) {
      await logError({
        error,
        context: "deletePost",
        additionalContext: {
          command,
        },
      });

      return ApiResponseBuilder.internalError(error.message);
    }

    return ApiResponseBuilder.internalError();
  }
}
