// /app/api/admin/hero/route.ts
import { NextResponse } from "next/server";
import { getSupabaseService } from "@/lib/supabaseService";
import { validateAdminRequest } from "@/lib/adminAuth";

// Default settings for Specialization card
const DEFAULT_SPECIALIZATION = {
  id: "specialization",
  card_type: "image",
  category: "Specialization",
  title: "Building Meaningful Ideas Across Science, Agriculture & Innovation",
  image_url: "https://images.unsplash.com/photo-1710322928695-c7fb49886cb1",
  bg_color: "bento-card-green",
  button_text: "",
  button_link: "",
};

export async function GET(request: Request) {
  const validation = await validateAdminRequest(request);
  if (!validation.ok) return validation.response;

  try {
    const supabase = getSupabaseService();
    const { data, error } = await supabase
      .from("hero_settings")
      .select("*")
      .eq("id", "specialization")
      .maybeSingle();

    if (error) {
      // If table doesn't exist, we return a 404/database error details so the client can show instructions
      if (error.code === "42P01") {
        return NextResponse.json(
          { error: "Table 'hero_settings' does not exist in the database.", code: "TABLE_NOT_FOUND" },
          { status: 404 }
        );
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // If no record found, return default
    if (!data) {
      return NextResponse.json(DEFAULT_SPECIALIZATION);
    }

    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const validation = await validateAdminRequest(req);
  if (!validation.ok) return validation.response;

  try {
    const body = await req.json(); // expect { card_type, category, title, image_url, bg_color, button_text, button_link }
    const supabase = getSupabaseService();

    const payload = {
      id: "specialization",
      card_type: body.card_type || "image",
      category: body.category || "Specialization",
      title: body.title || "",
      image_url: body.image_url || null,
      bg_color: body.bg_color || "bento-card-green",
      button_text: body.button_text || "",
      button_link: body.button_link || "",
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("hero_settings")
      .upsert([payload])
      .select()
      .single();

    if (error) {
      if (error.code === "42P01") {
        return NextResponse.json(
          { error: "Table 'hero_settings' does not exist in the database.", code: "TABLE_NOT_FOUND" },
          { status: 404 }
        );
      }
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
