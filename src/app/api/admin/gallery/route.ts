// /app/api/admin/gallery/route.ts
import { NextResponse } from "next/server";
import { supabaseService } from "@/lib/supabaseService";

export async function GET() {
  const { data, error } = await supabaseService
    .from("gallery")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  try {
    const body = await req.json(); // expect { title, description, image_url, category, date, location, tags }
    const { data, error } = await supabaseService.from("gallery").insert([body]).select().single();
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
