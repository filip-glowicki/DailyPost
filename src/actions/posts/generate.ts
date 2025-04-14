"use server";

import { z } from "zod";
import { createClient } from "@/utils/supabase/server";
import { CreatePostCommand } from "@/types";
import { generateContent } from "@/lib/ai";
import { logError } from "@/utils/error-logger";
import { ApiResponse, ApiResponseBuilder } from "@/utils/api-response";

// Validation schema for post creation
const createPostSchema = z.object({
  title: z.string().min(1).max(200),
  prompt: z.string().min(1).max(500),
  size: z.string(),
  category_id: z.string().uuid(),
});

/**
 * Server action for generating and creating a new post using AI
 * @param input Post creation parameters
 * @returns ApiResponse with the created post or error details
 */
export async function generatePost(
  input: CreatePostCommand,
): Promise<ApiResponse> {
  try {
    // Validate input data
    const validatedData = createPostSchema.parse(input);

    // Get authenticated user
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return ApiResponseBuilder.unauthorized();
    }

    // Generate content using AI
    const content = await generateContent(
      validatedData.prompt,
      validatedData.size,
    );

    // Save post to database
    const { data: post, error: dbError } = await supabase
      .from("posts")
      .insert({
        ...validatedData,
        content,
        user_id: user.id,
      })
      .select()
      .single();

    if (dbError) {
      return ApiResponseBuilder.internalError(dbError.message);
    }

    return ApiResponseBuilder.created(post);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return ApiResponseBuilder.validationError(error.errors);
    }

    if (error instanceof Error) {
      await logError({
        error,
        context: "generatePost",
        additionalContext: {
          input: {
            ...input,
            prompt: input.prompt.substring(0, 100), // Truncate prompt for logging
          },
        },
      });

      return ApiResponseBuilder.internalError(error.message);
    }

    return ApiResponseBuilder.internalError();
  }
}
