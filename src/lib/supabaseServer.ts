// /lib/supabaseServer.ts
import { createClient } from "@supabase/supabase-js";

export const supabaseServer = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! // prefer service role on server if available
);
