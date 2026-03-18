import { getSupabaseService } from "@/lib/supabaseService";

const BUCKET = "newsletter-images";

/**
 * Uploads a hero image to the Supabase Storage bucket `newsletter-images`
 * and returns the public URL.
 *
 * @param file      The File/Blob to upload.
 * @param folder    Optional sub-folder inside the bucket (e.g. a newsletter ID).
 * @returns         The permanent public URL of the uploaded image.
 */
export async function uploadHeroImage(
  file: File,
  folder = "heroes"
): Promise<string> {
  const supabase = getSupabaseService();

  // Build a unique, sanitised filename
  const ext = file.name.split(".").pop() ?? "jpg";
  const safeName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const path = `${folder}/${safeName}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { upsert: false, contentType: file.type });

  if (error) throw new Error(`Hero image upload failed: ${error.message}`);

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
