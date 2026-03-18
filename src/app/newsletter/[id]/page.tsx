import { getSupabaseService } from "@/lib/supabaseService";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CalendarDays, ChevronRight, ArrowLeft } from "lucide-react";

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
    <main className="min-h-screen bg-white">
      {/* ── Hero Image ───────────────────────────────────────────────── */}
      {newsletter.hero_image_url && (
        <div className="relative w-full h-[55vh] max-h-[600px] overflow-hidden">
          <Image
            src={newsletter.hero_image_url}
            alt={newsletter.title}
            fill
            priority
            className="object-cover"
          />
          {/* gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-white/60 via-transparent to-transparent" />
        </div>
      )}

      {/* ── Article ─────────────────────────────────────────────────── */}
      <div className="max-w-3xl mx-auto px-5 sm:px-8 py-12 sm:py-16">

        {/* Back link */}
        <Link
          href="/newsletter"
          className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-600 transition-colors mb-10 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          All Newsletters
        </Link>

        {/* Breadcrumb / Meta */}
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-widest mb-5">
          <CalendarDays className="w-3.5 h-3.5" />
          <span>{formattedDate}</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span>Newsletter</span>
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 leading-tight tracking-tight mb-5">
          {newsletter.title}
        </h1>

        {/* Subtitle */}
        {newsletter.subtitle && (
          <p className="text-xl text-slate-500 font-light leading-relaxed mb-8 border-l-4 border-slate-200 pl-4 italic">
            {newsletter.subtitle}
          </p>
        )}

        {/* Divider */}
        <div className="flex items-center gap-4 mb-10">
          <div className="h-px flex-1 bg-slate-100" />
          <span className="text-xs text-slate-300 font-medium uppercase tracking-widest">
            ✦
          </span>
          <div className="h-px flex-1 bg-slate-100" />
        </div>

        {/* Body */}
        <div className="prose prose-slate prose-lg max-w-none text-slate-700 leading-[1.85] whitespace-pre-wrap">
          {newsletter.content}
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-sm text-slate-400">
            Published on{" "}
            <time dateTime={newsletter.updated_at}>{formattedDate}</time>
          </p>
          <Link
            href="/newsletter"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            Browse more newsletters
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </main>
  );
}
