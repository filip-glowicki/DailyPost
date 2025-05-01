"use server";

import { z } from "zod";
import { createClient } from "@/utils/supabase/server";
import { logError } from "@/utils/error-logger";
import { ApiResponse, ApiResponseBuilder } from "@/utils/api-response";
import { PaginatedPostsDTO } from "@/types/database-types";
import { GetPostsQuery } from "@/types/database-types";

// Validation schema for query parameters
const getPostsQuerySchema = z.object({
  page: z.coerce.number().positive().optional().default(1),
  limit: z.coerce.number().positive().max(100).optional().default(10),
  category_id: z.string().uuid().optional(),
  search: z.string().min(1).max(200).optional(),
  sortBy: z
    .enum(["created_at", "title", "updated_at"])
    .optional()
    .default("created_at"),
  order: z.enum(["asc", "desc"]).optional().default("desc"),
});

/**
 * Server action for retrieving paginated posts with filtering and sorting
 * @param query Query parameters for filtering, sorting and pagination
 * @returns ApiResponse with paginated posts or error details
 */
export async function getPosts(
  query: GetPostsQuery = {},
): Promise<ApiResponse<PaginatedPostsDTO>> {
  try {
    // Validate query parameters
    const validatedQuery = getPostsQuerySchema.parse(query);

    // Get authenticated user
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return ApiResponseBuilder.unauthorized();
    }

    // Calculate offset for pagination
    const offset = (validatedQuery.page - 1) * validatedQuery.limit;

    // Initialize base query
    let postsQuery = supabase.from("posts").select("*", { count: "exact" });

    // Apply filters if provided
    if (validatedQuery.category_id) {
      postsQuery = postsQuery.eq("category_id", validatedQuery.category_id);
    }

    if (validatedQuery.search) {
      postsQuery = postsQuery.or(
        `title.ilike.%${validatedQuery.search}%,content.ilike.%${validatedQuery.search}%`,
      );
    }

    // Apply sorting
    postsQuery = postsQuery.order(validatedQuery.sortBy, {
      ascending: validatedQuery.order === "asc",
    });

    // Apply pagination
    postsQuery = postsQuery.range(offset, offset + validatedQuery.limit - 1);

    // Execute query
    const { data: posts, error: dbError, count } = await postsQuery;

    if (dbError) {
      return ApiResponseBuilder.internalError(dbError.message);
    }

    const response: PaginatedPostsDTO = {
      data: posts || [],
      pagination: {
        page: validatedQuery.page,
        limit: validatedQuery.limit,
        total: count || 0,
      },
    };

    return ApiResponseBuilder.success(response);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return ApiResponseBuilder.validationError(error.errors);
    }

    if (error instanceof Error) {
      await logError({
        error,
        context: "getPosts",
        additionalContext: { query },
      });

      return ApiResponseBuilder.internalError(error.message);
    }

    return ApiResponseBuilder.internalError();
  }
}
