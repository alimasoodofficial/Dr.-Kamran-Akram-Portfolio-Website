import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { slugify } from "@/lib/utils";
import FlipbookWrapper from "./FlipbookWrapper";

// Enable revalidation for fresh stats
export const revalidate = 60;

type Ebook = {
  id: string;
  title: string;
  description?: string;
  cover_url?: string;
  file_url?: string;
};

interface PageProps {
  params: Promise<{ title: string }>;
}

async function getEbookData(titleSlug: string): Promise<Ebook | null> {
  try {
    const supabase = createSupabaseServerClient();
    const { data: ebooks, error } = await supabase
      .from("ebooks")
      .select("*");

    if (error || !ebooks) {
      return null;
    }

    const ebook = ebooks.find((b) => slugify(b.title) === titleSlug) || null;
    return ebook;
  } catch (error) {
    console.error("Error loading flipbook reader ebook data:", error);
    return null;
  }
}

function ReaderSkeleton() {
  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-pulse p-4">
      {/* Top Bar Skeleton */}
      <div className="h-16 bg-slate-100 dark:bg-slate-800/50 rounded-2xl" />
      
      {/* Viewport Skeleton */}
      <div className="w-full h-[560px] bg-slate-100 dark:bg-slate-800/30 rounded-3xl" />
      
      {/* Bottom Bar Skeleton */}
      <div className="h-16 bg-slate-100 dark:bg-slate-800/50 rounded-2xl" />
    </div>
  );
}

export default async function EbookReaderPage({ params }: PageProps) {
  const { title } = await params;
  const ebook = await getEbookData(title);

  if (!ebook) {
    notFound();
  }

  return (
    <div className="min-h-screen pt-28 pb-16 bg-transparent">
      <Suspense fallback={<ReaderSkeleton />}>
        <FlipbookWrapper ebook={ebook} />
      </Suspense>
    </div>
  );
}

