"use client";

import React, { useState, useEffect } from 'react';
import Banner from "@/components/sections/Banner";
import ArticleBook from "@/components/ui/ArticleBook";
// import BookCard from "@/components/ui/BookCard"; // Unused in your snippet, kept if needed
// import Image from "next/image"; // Unused in your snippet, kept if needed

export default function Articles() {
  // --- STATE MANAGEMENT ---
  const [activeBookId, setActiveBookId] = useState<number | null>(null);

  // 1. Close book on Scroll
  useEffect(() => {
    const handleScroll = () => {
      if (activeBookId !== null) {
        setActiveBookId(null);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeBookId]);

  // 2. Close book on Click Outside (Background)
  useEffect(() => {
    const handleClickOutside = () => {
      setActiveBookId(null);
    };
    // The book component uses e.stopPropagation(), so this only triggers on background clicks
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  // Toggle Logic
  const handleBookToggle = (id: string | number) => {
    const numId = typeof id === 'string' ? parseInt(id, 10) : id;
    setActiveBookId((prev) => (prev === numId ? null : numId));
  };

  // Navigation Logic (Placeholder)
  const handleRead = (title: string) => {
    console.log(`Navigating to: ${title}`);
    // router.push('/article/slug') etc.
  };

  const articles = [
    {
      title: "The Future of React",
      category: "Engineering",
      summary:
        "Server Components have fundamentally changed how we architect web applications. In this deep dive, we explore the mental model shift required to master modern React patterns.",
      imageUrl:
        "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=1000&auto=format&fit=crop",
      author: "Dan Abramov",
      issue: "42",
    },
    {
      title: "Design Systems 101",
      category: "UX/UI",
      summary:
        "Atomic design is dead. Long live composite component patterns. Learn how to build scalable design systems that your developers will actually love using.",
      imageUrl:
        "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=1000&auto=format&fit=crop",
      author: "Sarah Drasner",
      issue: "12",
      readTime: "8 min",
    },
    {
      title: "AI in Production",
      category: "Machine Learning",
      summary:
        "Deploying LLMs is easy. Keeping them cost-effective and strictly typed is hard. Here is our battle-tested architecture for enterprise AI integration.",
      imageUrl:
        "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1000&auto=format&fit=crop",
      author: "Andrej K.",
      issue: "99",
    },
    {
      title: "The Future of React",
      category: "Engineering",
      summary:
        "Server Components have fundamentally changed how we architect web applications. In this deep dive, we explore the mental model shift required to master modern React patterns.",
      imageUrl:
        "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=1000&auto=format&fit=crop",
      author: "Dan Abramov",
      issue: "42",
    },
    {
      title: "Design Systems 101",
      category: "UX/UI",
      summary:
        "Atomic design is dead. Long live composite component patterns. Learn how to build scalable design systems that your developers will actually love using.",
      imageUrl:
        "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=1000&auto=format&fit=crop",
      author: "Sarah Drasner",
      issue: "12",
      readTime: "8 min",
    },
    {
      title: "AI in Production",
      category: "Machine Learning",
      summary:
        "Deploying LLMs is easy. Keeping them cost-effective and strictly typed is hard. Here is our battle-tested architecture for enterprise AI integration.",
      imageUrl:
        "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1000&auto=format&fit=crop",
      author: "Andrej K.",
      issue: "99",
    },
  ];

  return (
    <section>
      <Banner
        title="Read/Download My Research Articles"
        showLottie={true}
        lottieSrc="/lotties/articles.lottie"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-20 gap-x-40 justify-items-center md:justify-items-start items-center md:w-9/12 mx-auto md:ps-20 py-16">
        {articles.map((article, index) => (
          <ArticleBook
            key={index}
            // --- NEW PROPS FOR MOBILE INTERACTION ---
            id={index} 
            isOpen={activeBookId === index}
            onToggle={handleBookToggle}
            onRead={() => handleRead(article.title)}
            // ----------------------------------------
            title={article.title}
            category={article.category}
            summary={article.summary}
            imageUrl={article.imageUrl}
            author={article.author}
            issueNumber={article.issue}
            readTime={article.readTime}
          />
        ))}
      </div>
    </section>
  );
}