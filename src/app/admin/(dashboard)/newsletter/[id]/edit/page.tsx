"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { supabaseClient } from "@/lib/supabaseClient";
import NewsletterForm from "@/components/admin/newsletter/NewsletterForm";

export default function NewsletterEditPage() {
  const router = useRouter();
  const params = useParams();
  const [newsletter, setNewsletter] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadNewsletter() {
      if (!params.id) return;
      const { data, error } = await supabaseClient
        .from("newsletters")
        .select("*")
        .eq("id", params.id)
        .single();

      if (error) {
        toast.error("Failed to load newsletter");
        router.push("/admin/newsletter");
        return;
      }

      setNewsletter(data);
      setLoading(false);
    }
    loadNewsletter();
  }, [params.id, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-emerald-600" />
      </div>
    );
  }

  return <NewsletterForm newsletter={newsletter} />;
}
