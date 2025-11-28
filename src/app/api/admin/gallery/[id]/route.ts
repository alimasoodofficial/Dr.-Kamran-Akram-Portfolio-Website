// /app/api/admin/gallery/[id]/route.ts
import { NextResponse } from "next/server";
import { getSupabaseService } from "@/lib/supabaseService";
import { validateAdminRequest } from "@/lib/adminAuth";

const DEFAULT_IMAGE =
  "https://rqrnzfuvgmnjkjqaahve.supabase.co/storage/v1/object/public/gallery-images/Dr-Kamran-Akram.webp";

export async function GET(req: Request, context: any) {
  const validation = await validateAdminRequest(req);
  if (!validation.ok) return validation.response;

  try {
    const id = context.params.id;
    const { data, error } = await getSupabaseService()
      .from("gallery")
      .select("*")
      .eq("id", id)
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 404 });

    const item = {
      ...data,
      image_url: data.image_url && data.image_url.trim() ? data.image_url : DEFAULT_IMAGE,
    };

    return NextResponse.json(item);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: Request, context: any) {
  const validation = await validateAdminRequest(req);
  if (!validation.ok) return validation.response;

  try {
    const id = context.params.id;
    const body = await req.json();

    // if an empty value is passed, set default image; if undefined, keep existing
    if (Object.prototype.hasOwnProperty.call(body, "image_url")) {
      if (!body.image_url || (typeof body.image_url === "string" && !body.image_url.trim())) {
        body.image_url = DEFAULT_IMAGE;
      }
    }

    const { data, error } = await getSupabaseService()
      .from("gallery")
      .update(body)
      .eq("id", id)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, context: any) {
  const validation = await validateAdminRequest(req);
  if (!validation.ok) return validation.response;

  try {
    const id = context.params.id;

    const { error } = await getSupabaseService().from("gallery").delete().eq("id", id);

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
