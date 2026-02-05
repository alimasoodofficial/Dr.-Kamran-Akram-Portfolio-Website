import { createSupabaseServerClient } from "@/lib/supabaseServer";
import AdminArticlesClient from "./AdminArticlesClient";
import { Suspense } from "react";

// Enable ISR with revalidation
export const revalidate = 30;

type Article = {
  id: string;
  title: string;
  summary?: string;
  image_url?: string;
  category?: string;
  author?: string;
  read_time?: string;
  created_at?: string;
};

async function getArticles(): Promise<Article[]> {
  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching articles:", error);
    return [];
  }

  return data || [];
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-24 bg-slate-100 animate-pulse rounded-xl" />
      ))}
    </div>
  );
}

export default async function AdminArticles() {
  const articles = await getArticles();

  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <AdminArticlesClient initialArticles={articles} />
    </Suspense>
  );
}
