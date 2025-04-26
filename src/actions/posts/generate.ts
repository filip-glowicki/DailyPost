"use server";

import { z } from "zod";
import { createClient } from "@/utils/supabase/server";
import { OpenRouterService } from "@/lib/ai";
import { logError } from "@/utils/error-logger";
import { ApiResponse, ApiResponseBuilder } from "@/utils/api-response";
import { CreatePostCommand } from "@/types/database-types";

// Base schema for all posts
const basePostSchema = z.object({
  title: z.string().min(1).max(200),
  category_id: z.string().uuid(),
});

// Schema for AI-generated posts
const aiPostSchema = basePostSchema.extend({
  mode: z.literal("auto"),
  prompt: z.string().min(1).max(500),
  size: z.string(),
});

// Schema for manual posts
const manualPostSchema = basePostSchema.extend({
  mode: z.literal("manual"),
  content: z.string().min(1).max(5000),
});

// Combined schema that validates either AI or manual posts
const createPostSchema = z.discriminatedUnion("mode", [
  aiPostSchema,
  manualPostSchema,
]);

/**
 * Server action for generating and creating a new post
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

    let postContent: string;
    let prompt = "";
    let size = "medium"; // Default size for manual posts

    // If it's a manual post
    if (validatedData.mode === "manual") {
      postContent = validatedData.content;
    } else {
      // It's an AI-generated post
      // Fetch category details for AI context
      const { data: category, error: categoryError } = await supabase
        .from("categories")
        .select("name, description")
        .eq("id", validatedData.category_id)
        .single();

      if (categoryError) {
        return ApiResponseBuilder.internalError(
          "Failed to fetch category details",
        );
      }

      prompt = validatedData.prompt;
      size = validatedData.size;

      const service = new OpenRouterService();
      const response = await service.sendRequest(prompt, size, {
        category: {
          name: category.name,
          description: category.description,
        },
      });

      postContent = response.text;
    }

    // Save post to database with required fields
    const { data: post, error: dbError } = await supabase
      .from("posts")
      .insert({
        title: validatedData.title,
        category_id: validatedData.category_id,
        content: postContent,
        prompt,
        size,
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
            prompt:
              typeof input === "object" && "prompt" in input
                ? String(input.prompt).substring(0, 100)
                : undefined,
            content:
              typeof input === "object" && "content" in input
                ? String(input.content).substring(0, 100)
                : undefined,
          },
        },
      });

      return ApiResponseBuilder.internalError(error.message);
    }

    return ApiResponseBuilder.internalError();
  }
}
