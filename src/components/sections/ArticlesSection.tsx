"use client";

import React, { useState, useEffect } from "react";
import ResearchArticleCard from "@/components/ui/ResearchArticleCard";
import { supabaseClient } from "@/lib/supabaseClient";

const ArticlesSection: React.FC = () => {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchArticles() {
      try {
        const { data, error } = await supabaseClient
          .from("articles")
          .select("*")
          .eq("is_published", true)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setArticles(data || []);
      } catch (error) {
        console.error("Error fetching articles:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchArticles();
  }, []);

  if (loading) {
    return (
      <div className="py-20 flex justify-center items-center">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <section className="py-16 px-4">
      <div className="flex flex-col gap-8 max-w-5xl mx-auto font-sans">
        {articles.map((article) => (
          <ResearchArticleCard
            key={article.id}
            id={article.id}
            title={article.title}
            category={article.category}
            summary={article.summary}
            author={article.author}
            published_date={article.published_date}
            button_link={article.button_link}
            journal_name={article.journal_name}
            book_title={article.book_title}
            tags={article.tags}
            image_url={article.image_url}
          />
        ))}
        {articles.length === 0 && (
          <div className="text-center py-20 text-slate-500 dark:text-zinc-500 w-full bg-slate-50 dark:bg-zinc-900/10 rounded-2xl border border-dashed border-slate-200 dark:border-zinc-800">
            No articles published yet.
          </div>
        )}
      </div>
    </section>
  );
};

export default ArticlesSection;
