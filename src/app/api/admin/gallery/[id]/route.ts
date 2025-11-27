// /app/api/admin/gallery/[id]/route.ts
import { NextResponse } from "next/server";
import { getSupabaseService } from "@/lib/supabaseService";
import { validateAdminRequest } from "@/lib/adminAuth";

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

    return NextResponse.json(data);
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
