"use client";

import { useEffect, useState } from "react";
import { supabaseClient } from "@/lib/supabaseClient";
import GradientText from "@/components/ui/GradientText";
import { Plus, Edit, Trash2, Search, Send, Users, ExternalLink } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

type Newsletter = {
  id: string;
  subject: string;
  content?: string;
  status: "draft" | "sent" | "scheduled";
  sent_at?: string;
  recipients_count?: number;
};

export default function AdminNewsletter() {
  const [activeTab, setActiveTab] = useState<"campaigns" | "subscribers">("campaigns");
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Dummy subscribers for demo if table missing
  const [subscriberCount, setSubscriberCount] = useState(0);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
        if (activeTab === "campaigns") {
            const { data, error } = await supabaseClient.from("newsletters").select("*").order("created_at", { ascending: false });
            if (error && error.code !== "PGRST116" && error.code !== "42P01") throw error;
            setNewsletters(data || []);
        } else {
            const { count, error } = await supabaseClient.from("newsletter_subscribers").select("*", { count: "exact", head: true });
            if (error && error.code !== "PGRST116" && error.code !== "42P01") throw error;
            setSubscriberCount(count || 0);
        }
    } catch (error) {
        // toast.error("Failed to load data");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            <GradientText colors={["#10B981", "#3B82F6"]}>Newsletter</GradientText>
          </h1>
          <p className="text-slate-500 mt-1">Manage email campaigns and subscribers.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link 
              href="/newsletter"
              target="_blank"
              className="flex items-center gap-2 text-xs md:text-sm bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 px-4 py-2 rounded-lg transition-colors"
          >
              <ExternalLink className="w-5 h-5 text-xs md:text-sm" />
              <span>View Page</span>
          </Link>
          <Link 
              href="/admin/newsletter/new"
              className="flex items-center gap-2 text-xs md:text-sm bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors shadow-lg shadow-emerald-500/20"
          >
              <Plus className="w-5 h-5 text-xs md:text-sm " />
              <span>New Campaign</span>
          </Link>
        </div>
      </div>

      <div className="border-b border-slate-200">
          <nav className="-mb-px flex gap-6">
              <button 
                  onClick={() => setActiveTab("campaigns")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === "campaigns" ? "border-emerald-500 text-emerald-600" : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                  }`}
              >
                  Campaigns
              </button>
              <button 
                  onClick={() => setActiveTab("subscribers")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === "subscribers" ? "border-emerald-500 text-emerald-600" : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                  }`}
              >
                  Subscribers
              </button>
          </nav>
      </div>

      {activeTab === "campaigns" ? (
          <div className="space-y-4">
               {newsletters.length === 0 && !loading && (
                    <div className="text-center py-12 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                        <Send className="w-12 h-12 mb-2 mx-auto opacity-50" />
                        <p>No campaigns found.</p>
                    </div>
               )}
               {/* List of campaigns... */}
          </div>
      ) : (
           <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 text-center">
               <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                   <Users className="w-10 h-10" />
               </div>
               <h2 className="text-4xl font-bold text-slate-800">{subscriberCount}</h2>
               <p className="text-slate-500">Total Subscribers</p>
               
               <div className="mt-8 p-4 bg-slate-50 rounded text-sm text-slate-500">
                   Subscriber list management coming soon.
               </div>
           </div>
      )}
    </div>
  );
}
