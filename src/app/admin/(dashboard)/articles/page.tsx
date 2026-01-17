"use client";

import { useEffect, useState } from "react";
import { supabaseClient } from "@/lib/supabaseClient";
import GradientText from "@/components/ui/GradientText";
import { Plus, Edit, Trash2, Search, FileText, ExternalLink } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

type Article = {
  id: string;
  title: string;
  summary?: string;
  image_url?: string;
  category?: string;
  author?: string;
  read_time?: string;
  created_at?: string;
};

export default function AdminArticles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      // Assuming 'articles' table exists. 
      // If table doesn't exist, this will return error, and we handle gracefully.
      const { data, error } = await supabaseClient
        .from("articles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setArticles(data || []);
    } catch (error: any) {
      console.error(error);
      // Don't show error toast on initial load if it's just missing table in dev
      if (error.code !== "PGRST116" && error.code !== "42P01") { 
          toast.error("Failed to load articles");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this article?")) return;
    try {
        const { error } = await supabaseClient.from("articles").delete().eq("id", id);
        if (error) throw error;
        setArticles(prev => prev.filter(a => a.id !== id));
        toast.success("Article deleted");
    } catch (error) {
        toast.error("Failed to delete article");
    }
  };

  const filtered = articles.filter(a => 
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.category?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            <GradientText colors={["#EC4899", "#8B5CF6"]}>Articles</GradientText>
          </h1>
          <p className="text-slate-500 mt-1">Manage articles and publications.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link 
              href="/free-resources/articles"
              target="_blank"
              className="flex items-center gap-2 text-xs md:text-sm bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 px-4 py-2 rounded-lg transition-colors"
          >
              <ExternalLink className="w-3 h-3 md:w-5 md:h-5" />
              <span>View Page</span>
          </Link>
          <Link 
              href="/admin/articles/new"
              className="flex items-center gap-2 text-xs md:text-sm bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg transition-colors shadow-lg shadow-pink-500/20"
          >
              <Plus className="w-3 h-3 md:w-5 md:h-5" />
              <span>Write Article</span>
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
                type="text" 
                placeholder="Search articles..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all placeholder:text-slate-400"
            />
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
            {[1, 2, 3].map(i => (
                <div key={i} className="h-24 bg-slate-100 animate-pulse rounded-xl" />
            ))}
        </div>
      ) : (
        <div className="space-y-4">
            <AnimatePresence>
                {filtered.map((article) => (
                    <motion.div 
                        key={article.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="flex flex-col md:flex-row gap-6 bg-white p-4 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
                    >
                        <div className="w-full md:w-48 h-32 flex-shrink-0 bg-slate-100 rounded-lg overflow-hidden">
                            {article.image_url ? (
                                <img src={article.image_url} alt={article.title} className="w-full h-full object-cover" />
                            ) : (
                                <div className="flex items-center justify-center h-full text-slate-300">
                                    <FileText className="w-10 h-10" />
                                </div>
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                                <div>
                                    <span className="inline-block px-2 py-1 bg-pink-50 text-pink-600 text-xs font-medium rounded-full mb-2">
                                        {article.category || "Uncategorized"}
                                    </span>
                                    <h3 className="text-xl font-bold text-slate-800 line-clamp-1">{article.title}</h3>
                                </div>
                                <div className="flex gap-2">
                                     <Link
                                        href={`/admin/articles/${article.id}/edit`} 
                                        className="p-2 bg-slate-50 text-slate-600 rounded-lg hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(article.id)}
                                        className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-white hover:shadow-sm border border-transparent hover:border-red-100"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            <p className="text-slate-500 mt-2 line-clamp-2 text-sm">
                                {article.summary || "No summary available."}
                            </p>
                            <div className="flex items-center gap-4 mt-4 text-xs text-slate-400">
                                <span>{article.author || "Unknown Author"}</span>
                                <span>•</span>
                                <span>{article.read_time || "5 min read"}</span>
                                <span>•</span>
                                <span>{new Date(article.created_at || Date.now()).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
            {filtered.length === 0 && (
                 <div className="text-center py-12 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    <p>No articles found. Create one to get started.</p>
                </div>
            )}
        </div>
      )}
    </div>
  );
}
