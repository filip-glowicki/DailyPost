"use server";

import { z } from "zod";
import { createClient } from "@/utils/supabase/server";
import { CreateCategoryCommand, CategoryDTO } from "@/types/database-types";
import { logError } from "@/utils/error-logger";
import { ApiResponse, ApiResponseBuilder } from "@/utils/api-response";

// Validation schema for category creation
const createCategorySchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  description: z.string().max(250, "Description cannot exceed 250 characters"),
});

/**
 * Server action for creating a new category
 * @param command Create category command containing name and description
 * @returns ApiResponse with the created category or error details
 */
export async function generateCategory(
  command: CreateCategoryCommand,
): Promise<ApiResponse<CategoryDTO>> {
  try {
    // Validate input data
    const validatedData = createCategorySchema.parse(command);

    // Get authenticated user
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return ApiResponseBuilder.unauthorized();
    }

    // Check if category with the same name already exists for this user
    const { data: existingCategory, error: checkError } = await supabase
      .from("categories")
      .select("id")
      .or(`user_id.eq.${user.id},user_id.is.null`)
      .eq("name", validatedData.name)
      .single();

    if (checkError && checkError.code !== "PGRST116") {
      return ApiResponseBuilder.internalError(checkError.message);
    }

    if (existingCategory) {
      return ApiResponseBuilder.badRequest(
        "A category with this name already exists",
      );
    }

    // Create new category
    const { data: newCategory, error: createError } = await supabase
      .from("categories")
      .insert({
        ...validatedData,
        user_id: user.id, // Associate category with the current user
      })
      .select()
      .single();

    if (createError) {
      return ApiResponseBuilder.internalError(createError.message);
    }

    return ApiResponseBuilder.created(newCategory);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return ApiResponseBuilder.validationError(error.errors);
    }

    if (error instanceof Error) {
      await logError({
        error,
        context: "generateCategory",
        additionalContext: {
          command,
        },
      });

      return ApiResponseBuilder.internalError(error.message);
    }

    return ApiResponseBuilder.internalError();
  }
}
