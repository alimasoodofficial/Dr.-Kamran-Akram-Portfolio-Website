import { getSupabaseService } from "@/lib/supabaseService";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { 
    CalendarDays, 
    ChevronRight, 
    ArrowLeft, 
    Mail, 
    ExternalLink, 
    Share2, 
    Twitter, 
    Linkedin, 
    Link2, 
    Clock,
    User
} from "lucide-react";
import ShareButtons from "@/components/newsletter/ShareButtons";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
type SectionType = "paragraph" | "list" | "image" | "embed";

interface NewsletterSection {
    id: string;
    type: SectionType;
    heading: string;
    description: string;
    imageUrl?: string;
    linkUrl?: string;
    embedCode?: string;
    buttons?: { label: string; url: string }[];
}

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
    title: `${newsletter.title} | Newsletter`,
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
  };
}

// ---------------------------------------------------------------------------
// Component: Section Renderer
// ---------------------------------------------------------------------------
function SectionRenderer({ section }: { section: NewsletterSection }) {
    return (
        <div className="space-y-6 mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {section.heading && (
                <h2 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                    {section.heading}
                </h2>
            )}

            {section.type === "paragraph" && (
                <div className="prose-sm md:prose-lg prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-wrap font-medium">
                    {section.description}
                </div>
            )}

            {section.type === "list" && (
                <ul className="space-y-4">
                    {section.description.split('\n').filter(line => line.trim()).map((item, i) => (
                        <li key={i} className="flex items-start gap-4 text-lg text-slate-600 dark:text-slate-400 font-medium">
                            <span className="mt-2.5 h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                            <span>{item}</span>
                        </li>
                    ))}
                </ul>
            )}

            {section.type === "image" && section.imageUrl && (
                <div className="space-y-4">
                    <div className="rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slate-200 dark:shadow-none border border-slate-100 dark:border-slate-800 bg-white dark:bg-[#040d0a]">
                        <Image
                            src={section.imageUrl}
                            alt={section.heading || "Newsletter Image"}
                            width={1200}
                            height={675}
                            sizes="(max-width: 768px) 100vw, 896px"
                            className="w-full h-auto block "
                            quality={95}
                        />
                    </div>
                    {section.description && (
                        <p className="text-sm text-slate-500 dark:text-slate-500 italic text-center font-medium">
                            {section.description}
                        </p>
                    )}
                </div>
            )}

            {section.type === "embed" && section.embedCode && (
                <div className="flex justify-center w-full">
                    <div 
                        className="w-fit max-w-full rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-100 dark:border-slate-800 [&_iframe]:max-w-full [&_iframe]:aspect-video [&_iframe]:h-auto"
                        dangerouslySetInnerHTML={{ __html: section.embedCode }} 
                    />
                </div>
            )}

            {section.buttons && section.buttons.length > 0 && (
                <div className="flex flex-wrap gap-4 pt-4">
                    {section.buttons.map((btn, i) => (
                        <Link
                            key={i}
                            href={btn.url}
                            target="_blank"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 dark:bg-emerald-600 text-white font-black uppercase tracking-widest text-xs rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-slate-200 dark:shadow-emerald-900/20"
                        >
                            {btn.label}
                            <ExternalLink className="w-4 h-4" />
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
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
    "en-US",
    { day: "numeric", month: "long", year: "numeric" }
  );

  // Handle structured vs legacy content
  let sections: NewsletterSection[] = [];
  try {
    const parsed = JSON.parse(newsletter.content);
    sections = Array.isArray(parsed) ? parsed : [{ id: "1", type: "paragraph", heading: "", description: newsletter.content }];
  } catch (e) {
    sections = [{ id: "1", type: "paragraph", heading: "", description: newsletter.content }];
  }

  // Calculate a mock read time based on length
  const wordCount = sections.reduce((acc, s) => acc + (s.description?.split(/\s+/).length || 0), 0);
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#010403] pb-32 font-sans">
      <div className="max-w-4xl mx-auto px-6 pt-12 space-y-8">
        
        {/* Back link above the article */}
        <div className="flex items-center justify-between">
          <Link href="/newsletter" className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-emerald-500 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Newsletter
          </Link>
        </div>

        {/* ── Centered Hero Image ───────────────────────────────────────── */}
        {newsletter.hero_image_url && (
          <div className="relative w-full h-[250px] md:h-[400px]  mx-auto ">
            <Image
              src={newsletter.hero_image_url}
              alt={newsletter.title}
              fill
              priority
              className="object-contain "
              quality={95}
            />
          </div>
        )}

        {/* ── Heading and Content Card (beneath the image) ───────────────── */}
        <div className="bg-white dark:bg-[#040d0a] rounded-[2.5rem] p-4 md:p-16 lg:p-20 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] border border-slate-200/60 dark:border-[#0d2a22] space-y-12">
          
          {/* Top Metadata */}
          <div className="flex flex-wrap items-center gap-6">
            <span className="inline-flex items-center px-4 py-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] rounded-full border border-emerald-500/20">
              Newsletter
            </span>
            <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
              <Clock className="w-3.5 h-3.5" />
              {readTime} min read
            </div>
          </div>

          {/* Title Section */}
          <div className="space-y-6">
            <h1 className="text-2xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white leading-[1.15] tracking-tighter">
              {newsletter.title}
            </h1>
            
            {newsletter.subtitle && (
                <p className="text-base md:text-xl text-slate-500 dark:text-slate-400 font-medium leading-relaxed border-l-4 border-emerald-500 pl-6">
                    {newsletter.subtitle}
                </p>
            )}
          </div>

          {/* Sections */}
          <div className="space-y-4">
              {sections.map(section => (
                  <SectionRenderer key={section.id} section={section} />
              ))}
          </div>

          {/* Article Footer with Share & Meta */}
          <div className="mt-20 pt-10 border-t border-slate-100 dark:border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-10">
                <div className="space-y-1">
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block">Published</span>
                    <div className="flex items-center gap-2 text-slate-900 dark:text-white text-sm font-black">
                        <CalendarDays className="w-4 h-4 text-emerald-500" />
                        {formattedDate}
                    </div>
                </div>
                <div className="space-y-1">
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block">Author</span>
                    <div className="flex items-center gap-2 text-slate-900 dark:text-white text-sm font-black">
                        <User className="w-4 h-4 text-emerald-500" />
                        Dr. Muhammad Kamran
                    </div>
                </div>
            </div>

            {/* Share Options */}
            <ShareButtons title={newsletter.title} />
          </div>

          {/* Premium Subscription CTA */}
          <div className="mt-24">
              <div className="relative overflow-hidden bg-slate-900 dark:bg-emerald-950/15 border border-slate-800 dark:border-emerald-900/20 rounded-[2.5rem] p-8 md:p-12 text-center space-y-6">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[100px] -translate-y-1/2 translate-x-1/2" />
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 blur-[100px] translate-y-1/2 -translate-x-1/2" />
                  
                  <div className="relative z-10 space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-white/60 text-[10px] font-black uppercase tracking-[0.3em]">
                        <Mail className="w-4 h-4 text-emerald-400" />
                        Join the Inner Circle
                    </div>
                    <h3 className="text-2xl md:text-4xl font-black text-white! leading-tight">Stay ahead of the curve</h3>
                    <p className="text-slate-400 max-w-xl mx-auto text-base">
                        Get these exclusive insights delivered directly to your inbox every week. Join over 5,000+ industry leaders.
                    </p>
                    <div className="pt-4">
                        <Link
                            href="/newsletter"
                            className="inline-flex items-center gap-3 px-8 py-4 bg-emerald-500 text-white font-black uppercase tracking-widest text-xs rounded-full hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-500/25"
                        >
                            Subscribe Now
                            <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>
                  </div>
              </div>

              <div className="mt-16 flex flex-col md:flex-row items-center justify-between px-4 gap-2">
                  <Link href="/newsletter" className="flex items-center gap-2 bg-emerald-400 px-4 rounded-2xl py-2 text-xs font-black uppercase tracking-widest text-slate-50  transition-colors">
                      <ArrowLeft className="w-4 h-4" />
                      Back
                  </Link>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                      © {new Date().getFullYear()} Dr. Kamran Akram
                  </p>
              </div>
          </div>
      </div>
    </div>
    </div>
  );
}
