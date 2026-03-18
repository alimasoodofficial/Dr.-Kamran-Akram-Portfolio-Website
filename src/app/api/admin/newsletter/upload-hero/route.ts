import { NextRequest, NextResponse } from "next/server";
import { uploadHeroImage } from "@/lib/newsletterStorage";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const url = await uploadHeroImage(file);
    return NextResponse.json({ url });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Upload error";
    console.error("[upload-hero]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
