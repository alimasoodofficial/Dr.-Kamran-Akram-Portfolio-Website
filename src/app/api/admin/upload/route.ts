// /app/api/admin/upload/route.ts
import { NextResponse } from "next/server";
import { getSupabaseService } from "@/lib/supabaseService";
import { validateAdminRequest } from "@/lib/adminAuth";


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

    const bucketName = "website images & videos";
    const { data, error } = await supabaseService.storage.from(bucketName).upload(fileName, buffer, {
      cacheControl: "3600",
      upsert: false
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    // Retrieve public URL using Supabase Storage API to handle special characters & spaces correctly
    const { data: urlData } = supabaseService.storage.from(bucketName).getPublicUrl(data.path);
    
    return NextResponse.json({ url: urlData.publicUrl });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
