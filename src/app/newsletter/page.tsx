import { getSupabaseService } from "@/lib/supabaseService";
import Banner from "@/components/sections/Banner";
import SubscribeForm from "@/components/forms/SubscribeForm";
import Image from "next/image";
import Link from "next/link";
import { CalendarDays, ChevronRight, Mail } from "lucide-react";

export const dynamic = "force-dynamic";

type Newsletter = {
  id: string;
  title: string;
  subtitle?: string;
  hero_image_url?: string;
  updated_at: string;
};

async function getPublishedNewsletters() {
  const supabase = getSupabaseService();
  const { data, error } = await supabase
    .from("newsletters")
    .select("id, title, subtitle, hero_image_url, updated_at")
    .eq("status", "published")
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("Error fetching newsletters:", error.message);
    return [];
  }
  return data as Newsletter[];
}

export default async function NewsletterPage() {
  const newsletters = await getPublishedNewsletters();

  return (
    <div className="min-h-screen pb-24 transition-colors duration-300">
      <Banner
        title="Get ideas delivered straight to your inbox"
        description="Join the growing community of readers. Stay updated with the latest insights, exclusive content, deep-dives, and tech trends from Dr. Muhammad Kamran."
        gradientColors={["#ffffff", "#7ebcf6", "#dcbaff"]}
        showImage={false}
        className="w-auto"
        rightContent={<SubscribeForm />}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-24">

        {/* Newsletter List Section */}
        <section className="space-y-12">
          <div className="flex items-center gap-6">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Latest Issues
            </h2>
            <div className="h-px flex-1 bg-gradient-to-r from-slate-200 dark:from-slate-800 to-transparent" />
          </div>

          {newsletters.length === 0 ? (
            <div className="text-center py-24 bg-white dark:bg-slate-900/20 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700">
              <Mail className="w-12 h-12 md:w-16 md:h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">No issues published yet</h3>
              <p className="text-slate-500 dark:text-slate-500">Check back soon for our first newsletter!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {newsletters.map((nl) => (
                <Link
                  key={nl.id}
                  href={`/newsletter/${nl.id}`}
                  className="group flex flex-col bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200/60 dark:border-slate-800 shadow-sm hover:shadow-xl dark:shadow-none hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                >
                  <div className="relative h-56 w-full overflow-hidden">
                    {nl.hero_image_url ? (
                      <>
                        <Image
                          src={nl.hero_image_url}
                          alt={nl.title}
                          fill
                          className="object-contain group-hover:scale-105 transition-transform duration-700 ease-out"
                          unoptimized
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </>
                    ) : (
                      <div className="w-full h-full bg-slate-100 dark:bg-slate-800/50 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 group-hover:bg-slate-200 dark:group-hover:bg-slate-800 transition-colors">
                        <Mail className="w-8 h-8 opacity-50 mb-2" />
                        <span className="text-xs uppercase tracking-widest font-semibold opacity-50">No Image</span>
                      </div>
                    )}
                  </div>

                  <div className="p-8 flex flex-col flex-1">
                    <div className="flex items-center gap-2 text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-4">
                      <CalendarDays className="w-3.5 h-3.5" />
                      {new Date(nl.updated_at).toLocaleDateString("en-AU", {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </div>

                    <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-3 line-clamp-2 leading-snug">
                      {nl.title}
                    </h3>

                    {nl.subtitle && (
                      <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-3 mb-8 leading-relaxed">
                        {nl.subtitle}
                      </p>
                    )}

                    <div className="mt-auto flex items-center text-sm font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors w-max">
                      Read article
                      <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1.5 transition-transform duration-300" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}