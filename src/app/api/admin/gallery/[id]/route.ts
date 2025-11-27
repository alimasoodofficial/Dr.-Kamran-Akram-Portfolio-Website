// /app/api/admin/gallery/[id]/route.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { supabaseService } from "@/lib/supabaseService";
import { validateAdminRequest } from "@/lib/adminAuth";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const validation = await validateAdminRequest(req);
  if (!validation.ok) return validation.response;

  try {
    const { id } = params;
    const { data, error } = await supabaseService.from("gallery").select("*").eq("id", id).single();
    if (error) return NextResponse.json({ error: error.message }, { status: 404 });
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const validation = await validateAdminRequest(req);
  if (!validation.ok) return validation.response;

  try {
    const { id } = params;
    const body = await req.json();
    const { data, error } = await supabaseService.from("gallery").update(body).eq("id", id).select().single();
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const validation = await validateAdminRequest(req);
  if (!validation.ok) return validation.response;

  try {
    const { id } = params;
    const { error } = await supabaseService.from("gallery").delete().eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
