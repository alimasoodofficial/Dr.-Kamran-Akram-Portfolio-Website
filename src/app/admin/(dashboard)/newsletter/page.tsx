import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { getSupabaseService } from "@/lib/supabaseService";
import AdminNewsletterClient from "./AdminNewsletterClient";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

type Newsletter = {
  id: string;
  title: string;
  subtitle?: string;
  status: "draft" | "published";
  updated_at: string;
};

export type Subscriber = {
  id: string;
  email: string;
  full_name: string | null;
  created_at: string;
};

async function getNewsletterData() {
  // Use service client for subscribers (bypasses RLS for admin reads)
  const serviceClient = getSupabaseService();
  const anonClient = createSupabaseServerClient();

  const [campaignsRes, subscribersRes] = await Promise.all([
    serviceClient
      .from("newsletters")
      .select("*")
      .order("created_at", { ascending: false }),
    serviceClient
      .from("subscribers")
      .select("id, email, full_name, created_at")
      .order("created_at", { ascending: false }),
  ]);

  return {
    campaigns: (campaignsRes.data ?? []) as Newsletter[],
    subscribers: (subscribersRes.data ?? []) as Subscriber[],
  };
}

function LoadingSkeleton() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="w-10 h-10 border-4 border-slate-100 border-t-emerald-500 rounded-full animate-spin" />
    </div>
  );
}

export default async function AdminNewsletter() {
  const { campaigns, subscribers } = await getNewsletterData();

  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <AdminNewsletterClient
        initialNewsletters={campaigns}
        initialSubscribers={subscribers}
      />
    </Suspense>
  );
}
