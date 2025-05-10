"use server";

import { z } from "zod";
import { createClient } from "@/utils/supabase/server";
import { encodedRedirect } from "@/utils/utils";
import { redirect } from "next/navigation";

// Validation schema for sign in
const signInSchema = z.object({
  email: z.string().email("Wprowadź poprawny adres email"),
  password: z.string().min(6, "Hasło musi mieć co najmniej 6 znaków"),
});

export const signInAction = async (formData: FormData) => {
  // Extract form data
  const formValues = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  // Validate form data
  const result = signInSchema.safeParse(formValues);
  if (!result.success) {
    const errorMessage = result.error.errors
      .map((err) => err.message)
      .join(", ");
    return encodedRedirect("error", "/sign-in", errorMessage);
  }

  const validatedData = result.data;
  const supabase = await createClient();

  // Attempt sign in
  const { error } = await supabase.auth.signInWithPassword({
    email: validatedData.email,
    password: validatedData.password,
  });

  if (error) {
    console.error("Sign in error:", error);
    return encodedRedirect("error", "/sign-in", error.message);
  }

  return redirect("/post/editor");
};
