// /app/api/admin/check/route.ts
import { NextResponse } from "next/server";
import { supabaseService } from "@/lib/supabaseService";

export async function POST(req: Request) {
  const { accessToken } = await req.json();
  if (!accessToken) return NextResponse.json({ ok: false }, { status: 401 });

  const { data, error } = await supabaseService.auth.getUser(accessToken);
  if (error || !data.user) return NextResponse.json({ ok: false }, { status: 401 });

  const userId = data.user.id;
  const { data: profile, error: profileErr } = await supabaseService.from("profiles").select("is_admin, email").eq("id", userId).single();
  if (profileErr || !profile || !profile.is_admin) {
    return NextResponse.json({ ok: false }, { status: 403 });
  }

  return NextResponse.json({ ok: true, email: profile.email });
}
