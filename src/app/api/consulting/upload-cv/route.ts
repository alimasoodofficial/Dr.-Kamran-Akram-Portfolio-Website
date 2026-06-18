import { NextResponse } from "next/server";
import { getSupabaseService } from "@/lib/supabaseService";

export async function POST(req: Request) {
  try {
    const supabaseService = getSupabaseService();
    const form = await req.formData();
    const file = form.get("file") as unknown as File;
    
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Enforce PDF only
    const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
    if (!isPdf) {
      return NextResponse.json({ error: "Only PDF files are allowed" }, { status: 400 });
    }

    // Limit file size to 10MB
    const maxBytes = 10 * 1024 * 1024; // 10MB
    if (file.size > maxBytes) {
      return NextResponse.json({ error: "File size exceeds the 10MB limit" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Sanitize filename: replace spaces/special chars with hyphens
    const cleanOrigName = file.name
      .replace(/[^a-zA-Z0-9.]/g, "-")
      .replace(/-+/g, "-");
    
    // Use random UUID for high security and unguessable URLs
    const uniqueId = crypto.randomUUID();
    const fileName = `cvs/${uniqueId}-${cleanOrigName}`;

    const bucketName = "website images & videos";
    const contentType = "application/pdf";

    const { data, error } = await supabaseService.storage
      .from(bucketName)
      .upload(fileName, buffer, {
        cacheControl: "3600",
        upsert: false,
        contentType
      });

    if (error) {
      console.error("Supabase upload error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const { data: urlData } = supabaseService.storage.from(bucketName).getPublicUrl(data.path);

    return NextResponse.json({ 
      url: urlData.publicUrl, 
      path: data.path,
    });
  } catch (err: any) {
    console.error("Unexpected error during CV upload:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
