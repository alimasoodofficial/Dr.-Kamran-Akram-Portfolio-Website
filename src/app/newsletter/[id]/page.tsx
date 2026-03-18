import { getSupabaseService } from "@/lib/supabaseService";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CalendarDays, ChevronRight, ArrowLeft, Mail } from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
type Newsletter = {
  id: string;
  title: string;
  subtitle?: string;
  hero_image_url?: string;
  content: string;
  status: "draft" | "published";
  updated_at: string;
};

// ---------------------------------------------------------------------------
// Data fetching
// ---------------------------------------------------------------------------
async function getNewsletter(id: string): Promise<Newsletter | null> {
  const supabase = getSupabaseService();

  const { data, error } = await supabase
    .from("newsletters")
    .select("id, title, subtitle, hero_image_url, content, status, updated_at")
    .eq("id", id)
    .eq("status", "published")
    .single();

  if (error || !data) return null;
  return data as Newsletter;
}

// ---------------------------------------------------------------------------
// generateMetadata
// ---------------------------------------------------------------------------
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const newsletter = await getNewsletter(id);

  if (!newsletter) {
    return { title: "Newsletter Not Found" };
  }

  return {
    title: newsletter.title,
    description: newsletter.subtitle ?? `Read the latest newsletter from Dr. Kamran Akram.`,
    openGraph: {
      title: newsletter.title,
      description: newsletter.subtitle ?? "",
      images: newsletter.hero_image_url
        ? [{ url: newsletter.hero_image_url, width: 1200, height: 630 }]
        : [],
      type: "article",
      publishedTime: newsletter.updated_at,
    },
    twitter: {
      card: "summary_large_image",
      title: newsletter.title,
      description: newsletter.subtitle ?? "",
      images: newsletter.hero_image_url ? [newsletter.hero_image_url] : [],
    },
  };
}

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------
export default async function NewsletterDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const newsletter = await getNewsletter(id);

  if (!newsletter) notFound();

  const formattedDate = new Date(newsletter.updated_at).toLocaleDateString(
    "en-AU",
    { day: "numeric", month: "long", year: "numeric" }
  );

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-[#0B1120] pb-24 transition-colors duration-300">
      {/* ── Hero section ───────────────────────────────────────────────── */}
      <div className="relative">
        {newsletter.hero_image_url ? (
          <div className="relative w-full h-[60vh] max-h-[700px] overflow-hidden">
            <Image
              src={newsletter.hero_image_url}
              alt={newsletter.title}
              fill
              priority
              className="object-cover"
              unoptimized
            />
            {/* gradient overlay tailored for light/dark mode */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-50 dark:from-[#0B1120] via-slate-50/50 dark:via-[#0B1120]/60 to-transparent" />
          </div>
        ) : (
          <div className="w-full h-[40vh] max-h-[400px] bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 relative overflow-hidden">
             <div className="absolute inset-0 bg-slate-50 dark:bg-[#0B1120] bg-opacity-40 dark:bg-opacity-80" />
          </div>
        )}
      </div>

      {/* ── Article Container ───────────────────────────────────────── */}
      <div className="relative z-10 max-w-4xl mx-auto px-5 sm:px-8 -mt-32 sm:-mt-48">
        
        {/* Content Card */}
        <div className="bg-white dark:bg-slate-900/90 backdrop-blur-md rounded-[2.5rem] shadow-xl dark:shadow-[0_0_40px_-15px_rgba(0,0,0,0.5)] border border-slate-200/50 dark:border-slate-800 p-8 sm:p-14 lg:p-20">
          
          {/* Back link */}
          <Link
            href="/newsletter"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors mb-12 group uppercase tracking-widest bg-slate-100 dark:bg-slate-800/50 px-4 py-2 rounded-full w-max"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Issues
          </Link>

          {/* Header section (meta + title + subtitle) */}
          <header className="mb-14 sm:mb-20">
            <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-6">
              <div className="flex items-center gap-1.5 bg-blue-50 dark:bg-blue-500/10 px-3 py-1.5 rounded-full">
                <CalendarDays className="w-4 h-4" />
                <span>{formattedDate}</span>
              </div>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <div className="flex items-center gap-1.5 bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 px-3 py-1.5 rounded-full">
                <Mail className="w-4 h-4" />
                <span>Newsletter</span>
              </div>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white leading-[1.15] tracking-tight mb-8">
              {newsletter.title}
            </h1>

            {newsletter.subtitle && (
              <p className="text-xl sm:text-2xl text-slate-500 dark:text-slate-400 font-light leading-relaxed border-l-4 border-blue-500 dark:border-blue-500/50 pl-6 italic">
                {newsletter.subtitle}
              </p>
            )}
          </header>

          {/* Divider */}
          <div className="flex items-center gap-6 mb-16 opacity-50">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-300 dark:via-slate-700 to-transparent" />
            <span className="text-xl text-slate-300 dark:text-slate-600">✦</span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-300 dark:via-slate-700 to-transparent" />
          </div>

          {/* Body content */}
          <div className="prose prose-slate dark:prose-invert prose-lg sm:prose-xl max-w-none text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap selection:bg-blue-200 dark:selection:bg-blue-900/50">
            {newsletter.content}
          </div>

          {/* Footer */}
          <footer className="mt-24 pt-10 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <CalendarDays className="w-4 h-4" />
              Published on <time dateTime={newsletter.updated_at}>{formattedDate}</time>
            </p>
            <Link
              href="/newsletter"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold rounded-xl hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors shadow-lg hover:shadow-xl dark:shadow-none"
            >
              Browse more issues
              <ChevronRight className="w-4 h-4" />
            </Link>
          </footer>
        </div>
      </div>
    </main>
  );
}
