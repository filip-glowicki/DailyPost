import { createClient } from "./supabase/server";

type ErrorLogParams = {
  error: Error;
  context: string;
  additionalContext?: Record<string, unknown>;
};

/**
 * Logs an error to the database with context and user information
 * @param params Error logging parameters
 */
export async function logError({
  error,
  context,
  additionalContext,
}: ErrorLogParams): Promise<void> {
  try {
    const errorLogClient = await createClient();
    const {
      data: { user },
    } = await errorLogClient.auth.getUser();

    const errorContext = {
      ...additionalContext,
      stack: error.stack,
      timestamp: new Date().toISOString(),
    };

    await errorLogClient
      .from("error_logs")
      .insert({
        error_message: error.message,
        error_context: JSON.stringify({
          context,
          ...errorContext,
        }),
        user_id: user?.id,
      })
      .throwOnError();
  } catch (logError) {
    console.error("Failed to log error:", logError);
  }
}
