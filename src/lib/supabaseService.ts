// /lib/supabaseService.ts
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let cachedServiceClient: SupabaseClient | null = null;
let warnedAboutServiceKey = false;

function createServiceClient() {
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
  const serviceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_ANON_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      "Missing Supabase credentials for service client. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_ANON_KEY) in your environment."
    );
  }

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY && !warnedAboutServiceKey) {
    console.warn(
      "[supabaseService] SUPABASE_SERVICE_ROLE_KEY not set. Falling back to anon key; admin endpoints will have limited privileges."
    );
    warnedAboutServiceKey = true;
  }

  return createClient(url, serviceKey);
}

export function getSupabaseService(): SupabaseClient {
  if (!cachedServiceClient) {
    cachedServiceClient = createServiceClient();
  }
  return cachedServiceClient;
}
