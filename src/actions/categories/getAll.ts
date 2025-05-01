"use server";

import { createClient } from "@/utils/supabase/server";
import { CategoriesResponseDTO } from "@/types/database-types";
import { logError } from "@/utils/error-logger";
import { ApiResponse, ApiResponseBuilder } from "@/utils/api-response";

/**
 * Server action for retrieving all available categories
 * Returns both user-specific categories and global categories (where user_id is null)
 * @returns ApiResponse with array of categories or error details
 */
export async function getCategories(): Promise<
  ApiResponse<CategoriesResponseDTO>
> {
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

    // Fetch both user-specific categories and global categories
    const { data: categories, error: fetchError } = await supabase
      .from("categories")
      .select("*")
      .or(`user_id.eq.${user.id},user_id.is.null`) // Get categories where user_id matches current user OR is null (global)
      .order("name", { ascending: true }); // Sort categories alphabetically by name

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
