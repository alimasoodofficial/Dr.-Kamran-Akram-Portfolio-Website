import { createSupabaseServerClient } from "@/lib/supabaseServer";
import AdminGalleryClient from "./AdminGalleryClient";
import { Suspense } from "react";

// Enable ISR with revalidation
export const revalidate = 30;

type Item = {
  id: string;
  title: string;
  description?: string;
  image_url?: string;
  category?: string;
  date?: string;
  location?: string;
  tags?: string[];
};

async function getGalleryItems(): Promise<Item[]> {
  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase
    .from("gallery")
    .select("id, title, description, image_url, date, location, category, tags")
    .order("date", { ascending: false });

  if (error) {
    console.error("Error fetching gallery items:", error);
    return [];
  }

  return data || [];
}

export default async function AdminGallery() {
  const items = await getGalleryItems();

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      }
    >
      <AdminGalleryClient initialItems={items} />
    </Suspense>
  );
}
