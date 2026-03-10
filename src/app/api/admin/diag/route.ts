import { NextResponse } from "next/server";
import { getSupabaseService } from "@/lib/supabaseService";

// Admin diagnostics endpoint (server-only)
// - returns flags showing whether server-side service role key is present
// - if service key exists attempts a safe read of `profiles` to confirm permissions
// This endpoint is intended for debugging and should remain server-only.
export async function GET() {
  try {
    const hasServiceKey = !!process.env.SUPABASE_SERVICE_ROLE_KEY;
    const hasAnonKey = !!(process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    const hasUrl = !!(process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL);

    let canReadProfiles: boolean | null = null;

    if (hasServiceKey) {
      try {
        const supabase = getSupabaseService();
        // Do a tiny, safe check for SELECT permissions on profiles
        const { error } = await supabase.from("profiles").select("id").limit(1);
        canReadProfiles = error ? false : true;
      } catch (err) {
        console.error("[admin/diag] profiles read check failed:", (err as any)?.message ?? err);
        canReadProfiles = false;
      }
    } else {
      canReadProfiles = false;
    }

    return NextResponse.json({ ok: true, hasServiceKey, hasAnonKey, hasUrl, canReadProfiles });
  } catch (err: any) {
    console.error("[admin/diag] unexpected error:", err.message);
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
