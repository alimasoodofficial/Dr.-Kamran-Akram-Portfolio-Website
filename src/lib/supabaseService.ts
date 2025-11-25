// /lib/supabaseService.ts
import { createClient } from "@supabase/supabase-js";

const url =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
let serviceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_ANON_KEY;

if (!url || !serviceKey) {
  throw new Error("Missing Supabase credentials for service client");
}

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.warn(
    "[supabaseService] SUPABASE_SERVICE_ROLE_KEY not set. Falling back to anon key; admin endpoints will have limited privileges."
  );
}

export const supabaseService = createClient(url, serviceKey);
