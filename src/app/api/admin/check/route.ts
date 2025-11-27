// /app/api/admin/check/route.ts
import { NextResponse } from "next/server";
import { getSupabaseService } from "@/lib/supabaseService";

export async function POST(req: Request) {
  try {
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
