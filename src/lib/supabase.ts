import { createClient, SupabaseClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured = Boolean(url && key);

/**
 * If env vars are set, the real client is used.
 * Otherwise we export `null` and the app falls back to a localStorage store
 * so you can develop offline. Plug the keys in .env when ready.
 */
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url as string, key as string, {
      auth: { persistSession: false },
    })
  : null;