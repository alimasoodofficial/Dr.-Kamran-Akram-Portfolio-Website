import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabaseServer";

export async function POST(req: Request) {
  try {
    const { code } = await req.json();

    if (!code) {
      return NextResponse.json({ error: "Promo code is required" }, { status: 400 });
    }

    const supabase = createSupabaseServerClient();
    
    // Query active promo code (case insensitive)
    const { data: promo, error } = await supabase
      .from("promo_codes")
      .select("*")
      .ilike("code", code.trim())
      .single();

    if (error || !promo) {
      return NextResponse.json({ error: "Invalid promo code" }, { status: 404 });
    }

    // Verify status
    if (!promo.is_active) {
      return NextResponse.json({ error: "This promo code is no longer active" }, { status: 400 });
    }

    // Verify expiration
    if (promo.expires_at && new Date(promo.expires_at).getTime() < Date.now()) {
      return NextResponse.json({ error: "This promo code has expired" }, { status: 400 });
    }

    return NextResponse.json({
      valid: true,
      code: promo.code.toUpperCase(),
      discountPercent: Number(promo.discount_percent),
    });
  } catch (err: any) {
    console.error("Promo code validation error:", err);
    return NextResponse.json({ error: "Failed to validate promo code" }, { status: 500 });
  }
}
