import { test as teardown } from "@playwright/test";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "../utils/supabase/database.types";

teardown("clean up database", async () => {
  console.log("Cleaning up Supabase database...");

  const testUserId = process.env.E2E_USERNAME_ID;
  const testUserEmail = process.env.E2E_USERNAME;
  const testUserPassword = process.env.E2E_PASSWORD;

  if (!testUserId || !testUserEmail || !testUserPassword) {
    throw new Error("Missing test user environment variables");
  }

  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
    throw new Error("Missing Supabase environment variables");
  }

  try {
    // Create a direct Supabase client
    const supabase = createClient<Database>(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY,
    );

    // Login to the test account
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: testUserEmail,
      password: testUserPassword,
    });

    if (signInError) {
      throw new Error(`Failed to sign in: ${signInError.message}`);
    }

    console.log("Successfully signed in to test account");

    // Delete only posts belonging to the test user
    const { error } = await supabase
      .from("posts")
      .delete()
      .eq("user_id", testUserId);

    console.log("deleted!");

    if (error) {
      console.error("Error cleaning up posts table:", error.message);
      throw error;
    }

    console.log(
      `Successfully cleaned up posts for test user (ID: ${testUserId})`,
    );

    // Sign out after cleanup
    await supabase.auth.signOut();
    console.log("Successfully signed out");
  } catch (error) {
    console.error("Failed to clean up database:", error);
    throw error;
  }
});
