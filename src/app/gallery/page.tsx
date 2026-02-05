// Enable ISR with 60 second revalidation for better performance
export const revalidate = 60;

import Banner from "@/components/sections/Banner";
import GalleryGridClient from "@/components/ui/GalleryGridClient";
import GlowingInput from "@/components/ui/GlowingInput";
import HangingGallery from "@/components/ui/HangingGallery";
import { createSupabaseServerClient } from "@/lib/supabaseServer";

const DEFAULT_IMAGE =
  "https://rqrnzfuvgmnjkjqaahve.supabase.co/storage/v1/object/public/gallery-images/Dr-Kamran-Akram.webp";
const myPhotos = [
  { url: "https://picsum.photos/200/300?1", alt: "Trip 1" },
  { url: "https://picsum.photos/200/300?2", alt: "Trip 2" },
  { url: "https://picsum.photos/200/300?3", alt: "Trip 3" },
  { url: "https://picsum.photos/200/300?4", alt: "Trip 4" },
];

export default async function GalleryPage() {
  const supabase = createSupabaseServerClient();

  // ✅ Fetch from Supabase
  const { data, error } = await supabase
    .from("gallery")
    .select("id, title, description, image_url, date, location, category, tags")
    .order("date", { ascending: false });

  // ✅ Apply default image if none exists
  const items = (data || []).map((row: any) => ({
    ...row,
    image_url:
      row.image_url && row.image_url.trim() ? row.image_url : DEFAULT_IMAGE,
  }));

  return (
    <main>
      <Banner
        title="Captured Moments"
        description="A visual diary of my journey. This gallery features the people, places, and perspectives that catch my eye and keep me inspired."
        showLottie={true}
        lottieSrc="/lotties/gallery.lottie"
        showBreadcrumb={true}
        gradientColors={["#e3eeff", "#f3e7e9", "#e3eeff"]}
        animationSpeed={10}
      />
      <section>
        <HangingGallery images={myPhotos} />
      </section>

      <div className=" ">
        <GalleryGridClient items={items} />
      </div>
    </main>
  );
}
