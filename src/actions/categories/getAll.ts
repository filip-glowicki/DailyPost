"use server";

import { createClient } from "@/utils/supabase/server";
import { CategoriesResponseDTO } from "@/types/database-types";
import { logError } from "@/utils/error-logger";
import { ApiResponse, ApiResponseBuilder } from "@/utils/api-response";

/**
 * Parameters for the getCategories function
 */
export interface GetCategoriesParams {
  /** If true, only returns categories created by the current user.
   * If false (default), returns both user-specific categories and global categories */
  onlyUserCategories?: boolean;
}

/**
 * Server action for retrieving all available categories
 * @param params Object containing parameters for the categories query
 * @returns ApiResponse with array of categories or error details
 */
export async function getCategories(
  params?: GetCategoriesParams,
): Promise<ApiResponse<CategoriesResponseDTO>> {
  const { onlyUserCategories = false } = params || {};

  try {
    // Get authenticated user
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return ApiResponseBuilder.unauthorized();
    }

    // Initialize query
    let query = supabase.from("categories").select("*");

    // Filter categories based on onlyUserCategories flag
    if (onlyUserCategories) {
      // Only return categories created by the current user
      query = query.eq("user_id", user.id);
    } else {
      // Return both user-specific categories and global categories
      query = query.or(`user_id.eq.${user.id},user_id.is.null`);
    }

    // Execute query and sort by name
    const { data: categories, error: fetchError } = await query.order("name", {
      ascending: true,
    });

    if (fetchError) {
      return ApiResponseBuilder.internalError(fetchError.message);
    }

    const response: CategoriesResponseDTO = {
      data: categories || [],
    };

    return ApiResponseBuilder.success(response);
  } catch (error) {
    if (error instanceof Error) {
      await logError({
        error,
        context: "getCategories",
      });

      return ApiResponseBuilder.internalError(error.message);
    }

    return ApiResponseBuilder.internalError();
  }
}
