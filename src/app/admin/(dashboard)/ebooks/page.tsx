import { createSupabaseServerClient } from "@/lib/supabaseServer";
import AdminEbooksClient from "./AdminEbooksClient";
import { Suspense } from "react";

// Enable ISR with revalidation
export const revalidate = 30;

type Ebook = {
  id: string;
  title: string;
  description?: string;
  cover_url?: string;
  file_url?: string;
  downloads?: number;
};

async function getEbooks(): Promise<Ebook[]> {
  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase
    .from("ebooks")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching ebooks:", error);
    return [];
  }

  return data || [];
}

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="h-64 bg-slate-100 animate-pulse rounded-xl" />
      ))}
    </div>
  );
}

export default async function AdminEbooks() {
  const ebooks = await getEbooks();

  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <AdminEbooksClient initialEbooks={ebooks} />
    </Suspense>
  );
}
