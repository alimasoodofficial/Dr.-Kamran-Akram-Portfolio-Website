import { NextResponse } from "next/server";
import { getSupabaseService } from "@/lib/supabaseService";

type AdminValidationResult =
  | { ok: true; userId: string }
  | { ok: false; response: NextResponse };

const unauthorized = NextResponse.json({ error: "Unauthorized" }, { status: 401 });
const forbidden = NextResponse.json({ error: "Forbidden" }, { status: 403 });

export async function validateAdminRequest(
  req: Request
): Promise<AdminValidationResult> {
  const supabaseService = getSupabaseService();
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return { ok: false, response: unauthorized };
  }

  const token = authHeader.replace("Bearer", "").trim();
  if (!token) {
    return { ok: false, response: unauthorized };
  }

  const { data, error } = await supabaseService.auth.getUser(token);
  if (error || !data.user) {
    return { ok: false, response: unauthorized };
  }

  const { data: profile, error: profileErr } = await supabaseService
    .from("profiles")
    .select("is_admin")
    .eq("id", data.user.id)
    .single();

  if (profileErr || !profile?.is_admin) {
    return { ok: false, response: forbidden };
  }

  return { ok: true, userId: data.user.id };
}

