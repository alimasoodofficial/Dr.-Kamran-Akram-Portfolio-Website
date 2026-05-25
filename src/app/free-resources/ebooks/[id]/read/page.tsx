import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { notFound } from "next/navigation";
import FlipbookClient from "./FlipbookClient";
import { Suspense } from "react";

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
  params: Promise<{ id: string }>;
}

async function getEbookData(id: string): Promise<Ebook | null> {
  try {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from("ebooks")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      return null;
    }

    return data;
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
  const { id } = await params;
  const ebook = await getEbookData(id);

  if (!ebook) {
    notFound();
  }

  return (
    <div className="min-h-screen pt-28 pb-16 bg-gradient-to-br from-slate-50 via-emerald-50/10 to-teal-50/20 dark:from-gray-950 dark:via-slate-950 dark:to-black">
      <Suspense fallback={<ReaderSkeleton />}>
        <FlipbookClient ebook={ebook} />
      </Suspense>
    </div>
  );
}
