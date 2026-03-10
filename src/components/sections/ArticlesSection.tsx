"use client";

import React, { useState, useEffect } from "react";
import SketchbookCard from "@/components/ui/SketchbookCard";
import { supabaseClient } from "@/lib/supabaseClient";

const ArticlesSection: React.FC = () => {
  const [activeBookId, setActiveBookId] = useState<string | number | null>(
    null,
  );
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

  // 1. Close book on Scroll
  useEffect(() => {
    const handleScroll = () => {
      if (activeBookId !== null) {
        setActiveBookId(null);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeBookId]);

  // 2. Close book on Click Outside
  useEffect(() => {
    const handleClickOutside = () => {
      setActiveBookId(null);
    };
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  const handleBookToggle = (id: string | number) => {
    setActiveBookId((prev) => (prev === id ? null : id));
  };

  const handleRead = (title: string) => {
    console.log(`Reading: ${title}`);
  };

  if (loading) {
    return (
      <div className="py-20 flex justify-center items-center">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <section>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-y-20 gap-x-20 justify-items-center items-center md:w-11/12 lg:w-9/12 mx-auto py-16 px-2">
        {articles.map((article) => (
          <SketchbookCard
            key={article.id}
            id={article.id}
            isOpen={activeBookId === article.id}
            onToggle={handleBookToggle}
            onRead={() => handleRead(article.title)}
            title={article.title}
            category={article.category}
            summary={article.summary}
            imageUrl={article.image_url}
            author={article.author}
            issueNumber={article.issue_number || "1"}
          />
        ))}
        {articles.length === 0 && (
          <div className="col-span-full py-20 text-center text-slate-500 w-full">
            No articles published yet.
          </div>
        )}
      </div>
    </section>
  );
};

export default ArticlesSection;
