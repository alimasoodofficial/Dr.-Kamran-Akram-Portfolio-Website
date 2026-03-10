"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseClient } from "@/lib/supabaseClient";
import GradientText from "@/components/ui/GradientText";
import { ArrowLeft, Send } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";

export default function NewCampaign() {
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading("Creating campaign...");

    try {
      const { error } = await supabaseClient.from("newsletters").insert({
          subject,
          content,
          status: "draft"
      });

      if (error) throw error;
      
      toast.success("Campaign created (Draft)!", { id: toastId });
      router.push("/admin/newsletter");
    } catch (err: any) {
      toast.error(err.message || "Error", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
       <div className="flex items-center gap-4">
           <Link href="/admin/newsletter" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
               <ArrowLeft className="w-5 h-5 text-slate-500" />
           </Link>
           <h1 className="text-2xl font-bold text-slate-900">
               <GradientText colors={["#10B981", "#3B82F6"]}>New Campaign</GradientText>
           </h1>
       </div>

       <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-8">
           <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Subject Line</label>
                    <input value={subject} onChange={e => setSubject(e.target.value)} className="w-full px-4 py-2 border rounded-lg bg-slate-50" required placeholder="Newsletter Subject" />
                </div>
                
                <div>
                     <label className="block text-sm font-medium text-slate-700 mb-2">Content</label>
                    <textarea value={content} onChange={e => setContent(e.target.value)} className="w-full px-4 py-2 border rounded-lg bg-slate-50 h-64" placeholder="Email body..." />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <button type="button" className="px-6 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50">
                        Save as Draft
                    </button>
                    <button type="submit" disabled={loading} className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center gap-2">
                        <Send className="w-4 h-4" />
                        Create Campaign
                    </button>
                </div>
           </form>
       </div>
    </div>
  );
}
