// /app/api/admin/upload/route.ts
import { NextResponse } from "next/server";
import { getSupabaseService } from "@/lib/supabaseService";
import { validateAdminRequest } from "@/lib/adminAuth";

export const config = { api: { bodyParser: false } };

// Note: Node's built-in formData reading works in Next.js route handlers.
export async function POST(req: Request) {
  const validation = await validateAdminRequest(req);
  if (!validation.ok) return validation.response;

  try {
    const supabaseService = getSupabaseService();
    const form = await req.formData();
    const file = form.get("file") as unknown as File;
    if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const fileName = `gallery-${Date.now()}-${(file as any).name || "img"}`;

    const { data, error } = await supabaseService.storage.from("gallery-images").upload(fileName, buffer, {
      cacheControl: "3600",
      upsert: false
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    // data.path is the path *inside* the bucket (e.g. "gallery-123.png").
    // Build a public URL that includes the bucket name.
    const bucket = "gallery-images";
    const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucket}/${data.path}`;
    return NextResponse.json({ url: publicUrl });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
