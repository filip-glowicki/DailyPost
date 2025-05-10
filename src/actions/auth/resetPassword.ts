"use server";

import { z } from "zod";
import { createClient } from "@/utils/supabase/server";
import { encodedRedirect } from "@/utils/utils";

// Validation schema for password reset
const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(6, "Hasło musi mieć co najmniej 6 znaków")
      .regex(/[A-Z]/, "Hasło musi zawierać co najmniej jedną wielką literę")
      .regex(/[0-9]/, "Hasło musi zawierać co najmniej jedną cyfrę"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Hasła nie pasują do siebie",
    path: ["confirmPassword"],
  });

export const resetPasswordAction = async (formData: FormData) => {
  const formValues = {
    password: formData.get("password") as string,
    confirmPassword: formData.get("confirmPassword") as string,
  };

  // Validate data - catch any validation errors
  const validationResult = resetPasswordSchema.safeParse(formValues);
  if (!validationResult.success) {
    const errorMessage = validationResult.error.errors
      .map((err) => err.message)
      .join(", ");
    return encodedRedirect("error", "/reset-password", errorMessage);
  }

  const validatedData = validationResult.data;
  const supabase = await createClient();

  const { error } = await supabase.auth.updateUser({
    password: validatedData.password,
  });

  if (error) {
    console.error("Error updating password:", error);
    return encodedRedirect("error", "/reset-password", error?.toString());
  }

  return encodedRedirect("success", "/reset-password", "Hasło zaktualizowane");
};
