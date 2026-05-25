import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabaseServer";

export async function POST(req: Request) {
  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "Missing ebook ID" }, { status: 400 });
    }

    const supabase = createSupabaseServerClient();

    // Fetch current downloads
    const { data: ebook, error: fetchError } = await supabase
      .from("ebooks")
      .select("downloads, file_url")
      .eq("id", id)
      .single();

    if (fetchError || !ebook) {
      return NextResponse.json({ error: "Ebook not found" }, { status: 404 });
    }

    const newDownloads = (ebook.downloads || 0) + 1;

    const { error: updateError } = await supabase
      .from("ebooks")
      .update({ downloads: newDownloads })
      .eq("id", id);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, file_url: ebook.file_url });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
