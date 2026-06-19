import { NextResponse } from "next/server";
import { getSupabaseService } from "@/lib/supabaseService";
import { validateAdminRequest } from "@/lib/adminAuth";
import { revalidatePath } from "next/cache";

export async function GET(request: Request) {
  const validation = await validateAdminRequest(request);
  if (!validation.ok) return validation.response;

  try {
    const supabase = getSupabaseService();
    const { data, error } = await supabase
      .from("hero_settings")
      .select("*")
      .neq("id", "resume_cv");

    if (error) {
      if (error.code === "42P01") {
        return NextResponse.json(
          { error: "Table 'hero_settings' does not exist in the database.", code: "TABLE_NOT_FOUND" },
          { status: 404 }
        );
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data || []);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const validation = await validateAdminRequest(req);
  if (!validation.ok) return validation.response;

  try {
    const body = await req.json();
    const { id, card_type, category, title, image_url, bg_color, button_text, button_link } = body;
    
    if (!id) {
      return NextResponse.json({ error: "Missing card id" }, { status: 400 });
    }

    const supabase = getSupabaseService();

    const payload = {
      id,
      card_type: card_type || "text",
      category: category !== undefined ? category : "",
      title: title !== undefined ? title : "",
      image_url: image_url || null,
      bg_color: bg_color || "bento-card-green",
      button_text: button_text !== undefined ? button_text : "",
      button_link: button_link !== undefined ? button_link : "",
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

    // Revalidate the home page so the new hero settings show up immediately
    revalidatePath("/");

    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
