// /app/api/admin/gallery/route.ts
import { NextResponse } from "next/server";
import { getSupabaseService } from "@/lib/supabaseService";
import { validateAdminRequest } from "@/lib/adminAuth";

const DEFAULT_IMAGE =
  "https://rqrnzfuvgmnjkjqaahve.supabase.co/storage/v1/object/public/gallery-images/Dr-Kamran-Akram.webp";

export async function GET(request: Request) {
  const validation = await validateAdminRequest(request);
  if (!validation.ok) return validation.response;

  const { data, error } = await getSupabaseService()
    .from("gallery")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // apply default image if missing so admin UI gets consistent entries
  const items = (data || []).map((row: any) => ({
    ...row,
    image_url: row.image_url && row.image_url.trim() ? row.image_url : DEFAULT_IMAGE,
  }));

  return NextResponse.json(items);
}

export async function POST(req: Request) {
  const validation = await validateAdminRequest(req);
  if (!validation.ok) return validation.response;

  try {
    const body = await req.json(); // expect { title, description, image_url, category, date, location, tags }

    // ensure default image is applied when a user does not upload one
    if (!body.image_url || (typeof body.image_url === "string" && !body.image_url.trim())) {
      body.image_url = DEFAULT_IMAGE;
    }
    const { data, error } = await getSupabaseService()
      .from("gallery")
      .insert([body])
      .select()
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
