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

export async function syncPurchasesForEmail(email: string): Promise<void> {
  if (!email) return;
  const sanitizedEmail = email.trim().toLowerCase();
  const supabase = getSupabaseService();

  try {
    // 1. Fetch transactions for this email of item_type 'ebook'
    const { data: txs, error: txError } = await supabase
      .from("transactions")
      .select("*")
      .eq("item_type", "ebook")
      .ilike("customer_email", sanitizedEmail);

    if (txError || !txs || txs.length === 0) {
      return;
    }

    // 2. Fetch existing purchases for this email
    const { data: existingPurchases, error: pError } = await supabase
      .from("purchases")
      .select("*")
      .ilike("user_email", sanitizedEmail);

    if (pError) {
      console.error("[syncPurchasesForEmail] Error querying purchases:", pError);
      return;
    }

    const existingKeys = new Set(
      (existingPurchases || []).map((p: any) => `${p.ebook_id}:${p.stripe_checkout_id || ""}`)
    );

    // 3. Match transactions and sync
    for (const tx of txs) {
      if (!tx.item_name) continue;

      // Find the corresponding ebook by title (case-insensitive)
      const { data: ebook, error: ebookErr } = await supabase
        .from("ebooks")
        .select("id")
        .ilike("title", tx.item_name)
        .maybeSingle();

      if (ebookErr || !ebook) {
        console.warn(`[syncPurchasesForEmail] Ebook title "${tx.item_name}" not found in database.`);
        continue;
      }

      const key = `${ebook.id}:${tx.stripe_session_id || ""}`;
      if (existingKeys.has(key)) {
        continue; // already synced
      }

      // Check profiles to resolve user_id
      let userId = null;
      try {
        const { data: profile } = await supabase
          .from("profiles")
          .select("id")
          .ilike("email", sanitizedEmail)
          .maybeSingle();
        if (profile) {
          userId = profile.id;
        }
      } catch (err) {
        console.error("[syncPurchasesForEmail] Error resolving user profile:", err);
      }

      // Insert purchase record
      const { error: insertErr } = await supabase
        .from("purchases")
        .insert([{
          user_id: userId,
          user_email: sanitizedEmail,
          ebook_id: ebook.id,
          stripe_checkout_id: tx.stripe_session_id || null,
          created_at: tx.created_at || new Date().toISOString()
        }]);

      if (insertErr) {
        console.error(`[syncPurchasesForEmail] Failed to insert purchase for ${sanitizedEmail}:`, insertErr);
      } else {
        console.log(`[syncPurchasesForEmail] Successfully synced purchase of "${tx.item_name}" for ${sanitizedEmail}`);
        // Add to our existingKeys set to prevent duplicate inserts in the same loop
        existingKeys.add(key);
      }
    }
  } catch (err) {
    console.error("[syncPurchasesForEmail] Unexpected error during sync:", err);
  }
}
