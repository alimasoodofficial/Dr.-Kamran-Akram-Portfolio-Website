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

    const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
    const isPublicAsset = form.get("publicAsset") === "true";
    const prefix = isPdf && !isPublicAsset ? "ebook" : "media";
    
    // Sanitize filename: replace spaces/special chars with hyphens
    const cleanOrigName = file.name
      .replace(/[^a-zA-Z0-9.]/g, "-")
      .replace(/-+/g, "-");
    const fileName = `${prefix}-${Date.now()}-${cleanOrigName}`;

    const bucketName = (isPdf && !isPublicAsset) ? "ebooks-vault" : "website images & videos";
    const contentType = file.type || (isPdf ? "application/pdf" : "application/octet-stream");
    const { data, error } = await supabaseService.storage.from(bucketName).upload(fileName, buffer, {
      cacheControl: "3600",
      upsert: false,
      contentType
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    if (isPdf && !isPublicAsset) {
      // PDF files are private, so we return the storage path inside the ebooks-vault bucket.
      return NextResponse.json({ 
        url: fileName, 
        path: fileName, 
        isPrivate: true 
      });
    } else {
      // Retrieve public URL for other assets (covers, gallery)
      const { data: urlData } = supabaseService.storage.from(bucketName).getPublicUrl(data.path);
      return NextResponse.json({ 
        url: urlData.publicUrl, 
        path: data.path, 
        isPrivate: false 
      });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
