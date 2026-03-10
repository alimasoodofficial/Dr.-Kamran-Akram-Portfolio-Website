// /app/api/admin/check/route.ts
import { NextResponse } from "next/server";
import { getSupabaseService } from "@/lib/supabaseService";

export async function POST(req: Request) {
  try {
    // Ensure we have the service role key available in the deployment.
    // If absent we'll see RLS / permission problems when reading profiles.
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error("[admin/check] SUPABASE_SERVICE_ROLE_KEY not set in environment. Admin checks require server-side service key.");
      // Return 500: tell the deployer to configure the server-side key.
      return NextResponse.json({ ok: false, error: "Server missing SUPABASE_SERVICE_ROLE_KEY" }, { status: 500 });
    }

    const supabaseService = getSupabaseService();
    const { accessToken } = await req.json();
    if (!accessToken) return NextResponse.json({ ok: false }, { status: 401 });

    const { data, error } = await supabaseService.auth.getUser(accessToken);
    if (error || !data.user) {
      console.error("[admin/check] Auth error:", error?.message);
      return NextResponse.json({ ok: false }, { status: 401 });
    }

    const userId = data.user.id;
    const { data: profile, error: profileErr } = await supabaseService.from("profiles").select("is_admin, email").eq("id", userId).single();
    
    if (profileErr) {
      console.error("[admin/check] Profiles query error:", profileErr.message, "Code:", profileErr.code);
      // RLS may prevent reading profile; return 403 instead of 500
      return NextResponse.json({ ok: false }, { status: 403 });
    }
    
    if (!profile || !profile.is_admin) {
      console.warn("[admin/check] User not admin or profile not found", { userId, profileExists: !!profile, isAdmin: profile?.is_admin });
      return NextResponse.json({ ok: false }, { status: 403 });
    }

    return NextResponse.json({ ok: true, email: profile.email });
  } catch (err: any) {
    console.error("[admin/check] Unexpected error:", err.message);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
