import Banner from "@/components/sections/Banner";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import EbooksStoreClient from "./EbooksStoreClient";
import { Suspense } from "react";
import { Book } from "lucide-react";

// Enable ISR with revalidation
export const revalidate = 30;

type Ebook = {
  id: string;
  title: string;
  description?: string;
  cover_url?: string;
  file_url?: string;
  downloads?: number;
  created_at?: string;
};

async function getPublishedEbooks(): Promise<Ebook[]> {
  try {
    const supabase = createSupabaseServerClient();

    // Fetch published ebooks (if the field exists, else all ebooks)
    const { data, error } = await supabase
      .from("ebooks")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching ebooks:", error);
      return [];
    }

    // Support is_published column if defined, else just return data
    return data || [];
  } catch (error) {
    console.error("Failed to query ebooks:", error);
    return [];
  }
}

function StoreSkeleton() {
  return (
    <div className="space-y-12 animate-pulse">
      {/* Spotlight Spotlight Card Skeleton */}
      <div className="h-80 bg-slate-100 dark:bg-slate-800/50 rounded-3xl" />
      
      {/* Controls Bar Skeleton */}
      <div className="h-20 bg-slate-100 dark:bg-slate-800/50 rounded-2xl" />
      
      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex flex-col bg-slate-100 dark:bg-slate-800/30 rounded-3xl overflow-hidden border border-transparent aspect-[3/4]" />
        ))}
      </div>
    </div>
  );
}

export default async function EbooksPage() {
  const ebooks = await getPublishedEbooks();

  return (
    <div className="min-h-screen pb-24 bg-transparent">
      {/* Main Banner */}
      <Banner
        title="Knowledge Center & E-Books"
        description="Expand your horizons with our comprehensive collection of academic, scientific, and technical publications. Fully interactive e-books and industry guides designed to help you master complex topics."
        imageSrc="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1374&auto=format&fit=crop"
        imageAlt="E-Books Banner illustration"
        showImage={true}
        showBreadcrumb={true}
        className="rounded-3xl shadow-2xl border-4 border-white/20 dark:border-white/5 object-cover h-64 md:h-80 w-full"
      />

      {/* Main E-commerce Shelf */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <Suspense fallback={<StoreSkeleton />}>
          <EbooksStoreClient initialEbooks={ebooks} />
        </Suspense>
      </main>
    </div>
  );
}