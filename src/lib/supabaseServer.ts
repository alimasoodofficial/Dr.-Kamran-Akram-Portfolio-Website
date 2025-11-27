// /lib/supabaseServer.ts
import { createClient } from "@supabase/supabase-js";

// Create a small helper used by server routes. Use NEXT_PUBLIC_* as a
// fallback so deployments that only set the public env vars (common on
// Vercel when authors forget server-only keys) don't crash the server.
export function createSupabaseServerClient() {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_ANON_KEY");
  }

  return createClient(url, key);
}
