import { createSupabaseServerClient } from "@/lib/supabaseServer";
import AdminNewsletterClient from "./AdminNewsletterClient";
import { Suspense } from "react";

// Enable dynamic rendering for admin pages
export const dynamic = "force-dynamic";

type Newsletter = {
  id: string;
  subject: string;
  content?: string;
  status: "draft" | "sent" | "scheduled";
  sent_at?: string;
  recipients_count?: number;
};

async function getNewsletterData() {
  const supabase = createSupabaseServerClient();

  const [campaignsRes, subscribersRes] = await Promise.all([
    supabase
      .from("newsletters")
      .select("*")
      .order("created_at", { ascending: false }),
    supabase
      .from("newsletter_subscribers")
      .select("*", { count: "exact", head: true }),
  ]);

  return {
    campaigns: (campaignsRes.data || []) as Newsletter[],
    subscriberCount: subscribersRes.count || 0,
  };
}

function LoadingSkeleton() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="w-10 h-10 border-4 border-slate-100 border-t-emerald-500 rounded-full animate-spin"></div>
    </div>
  );
}

export default async function AdminNewsletter() {
  const { campaigns, subscriberCount } = await getNewsletterData();

  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <AdminNewsletterClient
        initialNewsletters={campaigns}
        initialSubscriberCount={subscriberCount}
      />
    </Suspense>
  );
}
