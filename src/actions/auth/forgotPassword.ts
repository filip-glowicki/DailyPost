"use server";

import { z } from "zod";
import { createClient } from "@/utils/supabase/server";
import { encodedRedirect } from "@/utils/utils";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

// Validation schema for forgot password
const forgotPasswordSchema = z.object({
  email: z.string().email("Wprowadź poprawny adres email"),
  callbackUrl: z.string().optional(),
});

export const forgotPasswordAction = async (formData: FormData) => {
  // Extract form data
  const formValues = {
    email: formData.get("email")?.toString() || "",
    callbackUrl: formData.get("callbackUrl")?.toString(),
  };

  // Validate data - catch any validation errors
  const validationResult = forgotPasswordSchema.safeParse(formValues);
  if (!validationResult.success) {
    const errorMessage = validationResult.error.errors
      .map((err) => err.message)
      .join(", ");
    return encodedRedirect("error", "/forgot-password", errorMessage);
  }

  const validatedData = validationResult.data;
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  const { error } = await supabase.auth.resetPasswordForEmail(
    validatedData.email,
    {
      redirectTo: `${origin}/auth/callback?redirect_to=/reset-password`,
    },
  );

  if (error) {
    return encodedRedirect(
      "error",
      "/forgot-password",
      "Nie udało się zresetować hasła",
    );
  }

  if (validatedData.callbackUrl) {
    return redirect(validatedData.callbackUrl);
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "Sprawdź swoją pocztę e-mail, aby uzyskać link do zresetowania hasła.",
  );
};
