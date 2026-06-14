import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { notFound } from "next/navigation";
import EbookDetailsClient from "./EbookDetailsClient";
import { Suspense } from "react";
import { slugify } from "@/lib/utils";

// Enable revalidation for fresh download stats
export const revalidate = 30;

type Ebook = {
  id: string;
  title: string;
  description?: string;
  cover_url?: string;
  file_url?: string;
  downloads?: number;
  created_at?: string;
  price?: number;
  discount_price?: number;
  discount_expires_at?: string;
  is_downloadable?: boolean;
};

interface PageProps {
  params: Promise<{ title: string }>;
}

async function getEbookData(titleSlug: string): Promise<{ ebook: Ebook | null; related: Ebook[] }> {
  try {
    const supabase = createSupabaseServerClient();

    // Fetch all ebooks to match by slugified title
    const { data: ebooks, error } = await supabase
      .from("ebooks")
      .select("*");

    if (error || !ebooks) {
      return { ebook: null, related: [] };
    }

    // Find the ebook matching the title slug
    const ebook = ebooks.find((b) => slugify(b.title) === titleSlug) || null;

    if (!ebook) {
      return { ebook: null, related: [] };
    }

    // Fetch up to 4 other ebooks for the related products section
    const { data: relatedData } = await supabase
      .from("ebooks")
      .select("*")
      .neq("id", ebook.id)
      .limit(4);

    return {
      ebook,
      related: relatedData || []
    };
  } catch (error) {
    console.error("Error loading ebook detail data:", error);
    return { ebook: null, related: [] };
  }
}

function DetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16 animate-pulse">
      <div className="h-6 w-32 bg-slate-100 dark:bg-slate-800/50 rounded-lg" />
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Cover Skeleton */}
        <div className="lg:col-span-4 flex flex-col items-center gap-8">
          <div className="w-full max-w-[300px] aspect-[4/5] bg-slate-100 dark:bg-slate-800/30 rounded-3xl" />
          <div className="w-full h-24 bg-slate-100 dark:bg-slate-800/30 rounded-2xl" />
        </div>

        {/* Content Skeleton */}
        <div className="lg:col-span-8 space-y-8">
          <div className="space-y-4">
            <div className="h-4 w-40 bg-slate-100 dark:bg-slate-800/30 rounded-full" />
            <div className="h-12 w-3/4 bg-slate-100 dark:bg-slate-800/30 rounded-xl" />
            <div className="h-6 w-1/2 bg-slate-100 dark:bg-slate-800/30 rounded-lg" />
          </div>
          
          <div className="h-48 bg-slate-100 dark:bg-slate-800/30 rounded-3xl" />
          <div className="grid grid-cols-4 gap-4 h-24" />
          <div className="h-32 bg-slate-100 dark:bg-slate-800/30 rounded-3xl" />
        </div>
      </div>
    </div>
  );
}

export default async function EbookDetailPage({ params }: PageProps) {
  const { title } = await params;
  const { ebook, related } = await getEbookData(title);

  if (!ebook) {
    notFound();
  }

  return (
    <div className="min-h-screen pt-28 pb-20 bg-transparent">
      <Suspense fallback={<DetailSkeleton />}>
        <EbookDetailsClient ebook={ebook} relatedEbooks={related} />
      </Suspense>
    </div>
  );
}
