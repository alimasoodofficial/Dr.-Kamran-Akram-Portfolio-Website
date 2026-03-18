import { getSupabaseService } from "@/lib/supabaseService";
import Banner from "@/components/sections/Banner";
import SubscribeForm from "@/components/forms/SubscribeForm";
import Image from "next/image";
import Link from "next/link";
import { CalendarDays, ChevronRight } from "lucide-react";

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
    <div className="min-h-screen pb-20 bg-slate-50/50">
      <Banner
        title="Newsletter"
        description="Stay updated with the latest insights and tech trends from Dr. Kamran Akram."
        gradientColors={["white", "#7ebcf6ff"]}
        showImage={false}
        className="w-auto h-[300px]"
      />

      <div className="max-w-6xl mx-auto px-4 mt-12 space-y-20">
        {/* Subscription Section */}
        <section className="flex flex-col items-center">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Subscribe Today</h2>
            <p className="text-slate-500">Join over 1,000+ readers and get insights delivered to your inbox.</p>
          </div>
          <SubscribeForm />
        </section>

        {/* Newsletter List Section */}
        <section className="space-y-12">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-slate-900">Latest Issues</h2>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          {newsletters.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
               <p className="text-slate-400">No issues published yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {newsletters.map((nl) => (
                <Link 
                  key={nl.id} 
                  href={`/newsletter/${nl.id}`}
                  className="group flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  <div className="relative h-48 w-full overflow-hidden">
                    {nl.hero_image_url ? (
                      <Image 
                        src={nl.hero_image_url} 
                        alt={nl.title} 
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300">
                        No Image
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
                      <CalendarDays className="w-3.5 h-3.5" />
                      {new Date(nl.updated_at).toLocaleDateString("en-AU", { 
                        day: 'numeric', 
                        month: 'short', 
                        year: 'numeric' 
                      })}
                    </div>
                    
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-2 line-clamp-2">
                      {nl.title}
                    </h3>
                    
                    {nl.subtitle && (
                      <p className="text-slate-500 text-sm line-clamp-3 mb-6">
                        {nl.subtitle}
                      </p>
                    )}
                    
                    <div className="mt-auto flex items-center text-sm font-bold text-blue-600">
                      Read more
                      <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
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