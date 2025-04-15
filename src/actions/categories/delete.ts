"use server";

import { z } from "zod";
import { createClient } from "@/utils/supabase/server";
import { DeleteCategoryCommand } from "@/types";
import { logError } from "@/utils/error-logger";
import { ApiResponse, ApiResponseBuilder } from "@/utils/api-response";

// Validation schema for category deletion
const deleteCategorySchema = z.object({
  id: z.string().uuid(),
});

/**
 * Server action for deleting an existing category
 * @param command Delete category command containing the category id
 * @returns ApiResponse with success message or error details
 */
export async function deleteCategory(
  command: DeleteCategoryCommand,
): Promise<ApiResponse<{ message: string }>> {
  try {
    // Validate input data
    const validatedData = deleteCategorySchema.parse(command);

    // Get authenticated user
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return ApiResponseBuilder.unauthorized();
    }

    // First check if category exists and belongs to the user or is a global category
    const { data: existingCategory, error: fetchError } = await supabase
      .from("categories")
      .select("user_id")
      .eq("id", validatedData.id)
      .single();

    if (fetchError) {
      if (fetchError.code === "PGRST116") {
        return ApiResponseBuilder.notFound("Category not found");
      }
      return ApiResponseBuilder.internalError(fetchError.message);
    }

    // Check if the category belongs to the user or is a global category that the user has permission to delete
    if (
      existingCategory.user_id !== null &&
      existingCategory.user_id !== user.id
    ) {
      return ApiResponseBuilder.forbidden(
        "You can only delete your own categories",
      );
    }

    // Check if the category is being used by any posts
    const { count: postsCount, error: countError } = await supabase
      .from("posts")
      .select("*", { count: "exact" })
      .eq("category_id", validatedData.id);

    if (countError) {
      return ApiResponseBuilder.internalError(countError.message);
    }

    if (postsCount && postsCount > 0) {
      return ApiResponseBuilder.badRequest(
        "Cannot delete category that is being used by posts",
      );
    }

    // Perform delete operation
    const { error: deleteError } = await supabase
      .from("categories")
      .delete()
      .eq("id", validatedData.id);

    if (deleteError) {
      return ApiResponseBuilder.internalError(deleteError.message);
    }

    return ApiResponseBuilder.success({
      message: "Category deleted successfully",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return ApiResponseBuilder.validationError(error.errors);
    }

    if (error instanceof Error) {
      await logError({
        error,
        context: "deleteCategory",
        additionalContext: {
          command,
        },
      });

      return ApiResponseBuilder.internalError(error.message);
    }

    return ApiResponseBuilder.internalError();
  }
}
