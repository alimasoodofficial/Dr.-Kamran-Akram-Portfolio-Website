// /app/api/gallery/route.ts
import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function GET() {
  const { data, error } = await supabaseServer
    .from("gallery")
    .select("*")
    .order("date", { ascending: false });

  if (error) return NextResponse.json({ error }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { data, error } = await supabaseServer.from("gallery").insert([body]);
  if (error) return NextResponse.json({ error }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}

// Implement PUT/DELETE similarly using request url or body.id
  