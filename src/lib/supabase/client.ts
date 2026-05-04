import { createClient } from '@supabase/supabase-js';

/**
 * Supabase Infrastructure Configuration
 * These environment variables must be defined in your .env.local file.
 */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Critical Safety Check: Ensure infrastructure is reachable
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'CRITICAL ERROR: Missing Supabase Environment Variables. ' +
    'Ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set.'
  );
}

/**
 * Singleton Supabase Client
 * Used for client-side interactions including Auth, Realtime updates 
 * for the Exporter Marketplace, and Database CRUD operations.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);