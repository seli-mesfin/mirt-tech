/**
 * Global Error Handler for ምርት tech
 * Extracts readable messages from Supabase errors or returns a fallback.
 */
export function getErrorMessage(err: unknown, fallback = "Unable to load data. Please try again.") {
  // Capture standard Error objects or return the custom fallback string
  const message = err instanceof Error ? err.message : fallback;
  
  // Log the raw error to the console for easier debugging in the BDU labs
  console.error("[Supabase] error:", err);
  
  return message;
}

/**
 * Client Validation Guard
 * Ensures the Supabase client is initialized before performing operations.
 */
export function assertSupabaseClient(supabaseClient: unknown) {
  if (!supabaseClient) {
    throw new Error("Supabase client not configured. Check environment variables.");
  }
}