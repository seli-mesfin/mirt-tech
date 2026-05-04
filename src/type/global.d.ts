import type { SupabaseClient } from "@supabase/supabase-js";

export {};

declare global {
  var __supabase__: SupabaseClient | undefined;
}