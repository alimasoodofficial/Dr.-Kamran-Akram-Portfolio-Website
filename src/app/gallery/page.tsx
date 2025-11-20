export const dynamic = "force-dynamic";

import Banner from "@/components/sections/Banner";
import GalleryGridClient from "@/components/ui/GalleryGridClient";
import { createSupabaseServerClient } from "@/lib/supabaseServer";

const DEFAULT_IMAGE =
  "https://rqrnzfuvgmnjkjqaahve.supabase.co/storage/v1/object/public/gallery-images/Dr-Kamran-Akram.webp";

export default async function GalleryPage() {
  const supabase = createSupabaseServerClient();

  // ✅ Fetch from Supabase
  const { data, error } = await supabase
    .from("gallery")
    .select(
      "id, title, description, image_url, date, location, category, tags"
    )
    .order("date", { ascending: false });

  // ✅ Apply default image if none exists
  const items = (data || []).map((row: any) => ({
    ...row,
    image_url:
      row.image_url && row.image_url.trim() ? row.image_url : DEFAULT_IMAGE,
  }));


  return (
    <main >
      <Banner
        title="Gallery"
        description="We provide amazing services and solutions for your business.."
        showLottie={true}
        lottieSrc="/lotties/business.lottie"
        showBreadcrumb={true}
      />

      <div className="py-20 px-6 max-w-7xl mx-auto">
      <GalleryGridClient items={items} />

      </div>
    </main>
  );
}
