"use server";

import { z } from "zod";
import { createClient } from "@/utils/supabase/server";
import { encodedRedirect } from "@/utils/utils";
import { headers } from "next/headers";

// Validation schema for sign up
const signUpSchema = z.object({
  email: z.string().email("Wprowadź poprawny adres email"),
  password: z
    .string()
    .min(6, "Hasło musi mieć co najmniej 6 znaków")
    .regex(/[A-Z]/, "Hasło musi zawierać co najmniej jedną wielką literę")
    .regex(/[0-9]/, "Hasło musi zawierać co najmniej jedną cyfrę"),
});

export const signUpAction = async (formData: FormData) => {
  const origin = (await headers()).get("origin");

  // Extract form data
  const formValues = {
    email: formData.get("email")?.toString() || "",
    password: formData.get("password")?.toString() || "",
  };

  // Validate data
  const validationResult = signUpSchema.safeParse(formValues);
  if (!validationResult.success) {
    const errorMessage = validationResult.error.errors
      .map((err) => err.message)
      .join(", ");
    return encodedRedirect("error", "/sign-up", errorMessage);
  }

  const validatedData = validationResult.data;
  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email: validatedData.email,
    password: validatedData.password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    return encodedRedirect("error", "/sign-up", error.message);
  }

  return encodedRedirect(
    "success",
    "/sign-up",
    "Dziękujemy za rejestrację! Sprawdź pocztę e-mail, aby uzyskać link weryfikacyjny.",
  );
};
