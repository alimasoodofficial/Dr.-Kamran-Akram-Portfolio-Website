// /app/gallery/page.tsx  (server component)
import Banner from "@/components/sections/Banner";
import GalleryGridClient from "@/components/ui/GalleryGridClient";
import { supabaseServer } from "@/lib/supabaseServer";

const DEFAULT_IMAGE =
  "https://rqrnzfuvgmnjkjqaahve.supabase.co/storage/v1/object/public/gallery-images/Dr-Kamran-Akram.webp";

export default async function GalleryPage() {
  // server-side fetch
  const { data, error } = await supabaseServer
    .from("gallery")
    .select("id, title, description, image_url, date, location, category, tags")
    .order("date", { ascending: false });

  const items = (data || []).map((row: any) => ({
    ...row,
    image_url:
      row.image_url && row.image_url.trim() ? row.image_url : DEFAULT_IMAGE,
  }));

  return (
    <main >
      <Banner
        title="Gallery"
        description="lorem."
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
