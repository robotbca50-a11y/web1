import { createBrowserClient } from "@supabase/ssr";

let client: ReturnType<typeof createBrowserClient> | null = null;

const FALLBACK_URL = "https://bkygwosqgelmdkyqwbqc.supabase.co";
const FALLBACK_ANON_KEY = "sb_publishable_EqRlIUy1D6DkySuEFIawEw_bPKpnyHU";

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || FALLBACK_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || FALLBACK_ANON_KEY;

  if (!client) {
    client = createBrowserClient(url, key);
  }
  return client;
}

export function isSupabaseConfigured() {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL || FALLBACK_URL) &&
         !!(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || FALLBACK_ANON_KEY);
}
