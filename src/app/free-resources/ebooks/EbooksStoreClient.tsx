"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Book, 
  Download, 
  ArrowUpDown, 
  SlidersHorizontal, 
  Star, 
  Sparkles, 
  BookOpen, 
  ArrowRight,
  TrendingUp,
  Tag
} from "lucide-react";
import BookCard from "@/components/ui/BookCard";

type Ebook = {
  id: string;
  title: string;
  description?: string;
  cover_url?: string;
  file_url?: string;
  downloads?: number;
  created_at?: string;
  price?: number;
  discount_price?: number;
  discount_expires_at?: string;
};

type EbooksStoreClientProps = {
  initialEbooks: Ebook[];
};

// Ratings map so we have consistent, beautiful reviews for ecommerce-like feel
const generateBookMeta = (id: string, title: string) => {
  // Use simple hash from ID to get repeatable rating & reviews
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  const rating = (4.7 + (Math.abs(hash) % 4) * 0.1).toFixed(1); // 4.7, 4.8, 4.9, 5.0
  const reviews = 12 + (Math.abs(hash) % 45); // 12 to 56 reviews
  const pageCount = 60 + (Math.abs(hash) % 150); // 60 to 210 pages
  
  // Categorize based on title keywords
  const lowerTitle = title.toLowerCase();
  let category = "Guide";
  if (lowerTitle.includes("micro") || lowerTitle.includes("bio") || lowerTitle.includes("science")) {
    category = "Science";
  } else if (lowerTitle.includes("data") || lowerTitle.includes("ai") || lowerTitle.includes("python") || lowerTitle.includes("code")) {
    category = "Technology";
  } else if (lowerTitle.includes("env") || lowerTitle.includes("eco") || lowerTitle.includes("water") || lowerTitle.includes("green")) {
    category = "Environment";
  } else if (lowerTitle.includes("research") || lowerTitle.includes("acad") || lowerTitle.includes("publish")) {
    category = "Academic";
  }
  
  return { rating, reviews, pageCount, category };
};

export default function EbooksStoreClient({ initialEbooks }: EbooksStoreClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState<"latest" | "downloads" | "rating">("latest");

  // Augment books with static dynamic details for e-commerce store experience
  const augmentedEbooks = useMemo(() => {
    return initialEbooks.map((book) => {
      const meta = generateBookMeta(book.id, book.title);
      return {
        ...book,
        ...meta,
      };
    });
  }, [initialEbooks]);

  // Extract all unique categories
  const categories = useMemo(() => {
    const cats = new Set<string>();
    cats.add("All");
    augmentedEbooks.forEach((book) => {
      if (book.category) cats.add(book.category);
    });
    return Array.from(cats);
  }, [augmentedEbooks]);

  // Featured Ebook - the book with the highest downloads or the latest
  const featuredEbook = useMemo(() => {
    if (augmentedEbooks.length === 0) return null;
    return augmentedEbooks.reduce((prev, current) => 
      ((prev.downloads || 0) > (current.downloads || 0)) ? prev : current
    , augmentedEbooks[0]);
  }, [augmentedEbooks]);

  // Filter and sort ebooks
  const filteredAndSortedEbooks = useMemo(() => {
    let result = augmentedEbooks.filter((book) => {
      const matchesSearch = 
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (book.description && book.description.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = selectedCategory === "All" || book.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });

    // Sorting
    result.sort((a, b) => {
      if (sortBy === "latest") {
        const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return dateB - dateA;
      }
      if (sortBy === "downloads") {
        return (b.downloads || 0) - (a.downloads || 0);
      }
      if (sortBy === "rating") {
        return parseFloat(b.rating) - parseFloat(a.rating);
      }
      return 0;
    });

    return result;
  }, [augmentedEbooks, searchQuery, selectedCategory, sortBy]);

  return (
    <div className="w-full space-y-12">
      {/* 🚀 Feature Spotlight Hero Card (Ecommerce Style) */}
      {featuredEbook && !searchQuery && selectedCategory === "All" && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-transparent dark:from-emerald-500/5 dark:via-teal-500/5 rounded-3xl p-8 md:p-12 border border-emerald-500/20 dark:border-emerald-500/10 overflow-hidden"
        >
          {/* Decorative backdrop light blur */}
          <div className="absolute right-0 top-0 w-80 h-80 bg-emerald-500/20 rounded-full filter blur-3xl -z-10 pointer-events-none" />
          <div className="absolute left-1/3 bottom-0 w-60 h-60 bg-teal-500/20 rounded-full filter blur-3xl -z-10 pointer-events-none" />

          <div className="flex flex-col lg:flex-row items-center gap-10">
            {/* 3D Featured Book Card Column */}
            <div className="shrink-0 flex justify-center w-full lg:w-auto">
              <div className="hover:scale-105 transition-transform duration-500">
                <BookCard
                  title={featuredEbook.title}
                  imageSrc={featuredEbook.cover_url}
                  width={240}
                  height={320}
                  coverColor="bg-gradient-to-br from-emerald-500 to-teal-600"
                  coverText="PREMIUM"
                  href={`/free-resources/ebooks/${featuredEbook.id}`}
                  buttonText="View Book"
                  buttonClassName="btn-gradient text-white font-medium px-6 py-2.5 rounded-xl text-sm"
                />
              </div>
            </div>

            {/* Featured Book Metadata / Information */}
            <div className="flex-1 space-y-6 text-center lg:text-left">
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
                <span className="px-3.5 py-1 text-xs font-semibold uppercase tracking-wider rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                  Premium Spotlight
                </span>
                <span className="px-3 py-1 text-xs font-bold rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5" />
                  ${Number(featuredEbook.price || 0).toFixed(2)} USD
                </span>
                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {featuredEbook.category}
                </span>
                <div className="flex items-center text-amber-500 text-sm gap-1">
                  <Star className="w-4 h-4 fill-amber-500" />
                  <span className="font-bold text-slate-800 dark:text-white">{featuredEbook.rating}</span>
                  <span className="text-slate-400">({featuredEbook.reviews} reviews)</span>
                </div>
              </div>

              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight font-heading">
                {featuredEbook.title}
              </h2>

              <p className="text-slate-600 dark:text-slate-300 text-base md:text-lg leading-relaxed max-w-2xl line-clamp-3">
                {featuredEbook.description || "Unlock critical industry knowledge with this meticulously researched guide. Curated by environmental science experts, this publication is packed with diagrams, technical specs, and practical tools to support your educational and industrial projects."}
              </p>

              <div className="flex flex-wrap justify-center lg:justify-start items-center gap-6 pt-2">
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <Download className="w-5 h-5 text-emerald-500" />
                  <span className="font-bold text-slate-800 dark:text-white">{featuredEbook.downloads || 0}</span>
                  <span>downloads</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <BookOpen className="w-5 h-5 text-emerald-500" />
                  <span className="font-bold text-slate-800 dark:text-white">{featuredEbook.pageCount}</span>
                  <span>pages</span>
                </div>
              </div>

              <div className="flex justify-center lg:justify-start pt-2">
                <Link
                  href={`/free-resources/ebooks/${featuredEbook.id}`}
                  className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-8 py-3.5 rounded-2xl shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/30 hover:scale-102 transition-all group"
                >
                  <span>Explore Ebook & Buy</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* 🛠 Interactive Controls Bar (Filters & Sorting) */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-lg sticky top-24 z-20 flex flex-col md:flex-row gap-6 items-center justify-between">
        
        {/* Search Bar */}
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search our ebook catalog..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 dark:focus:border-emerald-500/50 transition-all placeholder:text-slate-400 text-slate-900 dark:text-white text-sm"
          />
        </div>

        {/* Filters and Sorting */}
        <div className="flex flex-wrap md:flex-nowrap items-center gap-4 w-full md:w-auto justify-end">
          
          {/* Sorting Dropdown */}
          <div className="flex items-center gap-2 w-full sm:w-auto bg-slate-50 dark:bg-slate-950 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
            <ArrowUpDown className="w-4 h-4 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-sm font-semibold text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
            >
              <option value="latest">Latest Releases</option>
              <option value="downloads">Most Popular</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* 🏷 Categories Filter List */}
      <div className="flex flex-wrap items-center gap-2 pb-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border flex items-center gap-2 ${
              selectedCategory === category
                ? "bg-emerald-500 text-white border-emerald-500 shadow-md shadow-emerald-500/25"
                : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50"
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            {category}
          </button>
        ))}
      </div>

      {/* 📦 E-Commerce Product Shelf (Grid Layout) */}
      <div className="relative">
        <AnimatePresence mode="popLayout">
          {filteredAndSortedEbooks.length > 0 ? (
            <motion.div 
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            >
              {filteredAndSortedEbooks.map((book) => {
                const basePrice = book.price !== undefined && book.price !== null ? Number(book.price) : 9.99;
                const now = new Date();
                const hasActiveDiscount = 
                  book.discount_price !== undefined && 
                  book.discount_price !== null && 
                  Number(book.discount_price) > 0 && 
                  book.discount_expires_at !== undefined && 
                  book.discount_expires_at !== null && 
                  new Date(book.discount_expires_at) > now;
                
                const activePrice = hasActiveDiscount ? Number(book.discount_price) : basePrice;
                const isPaid = activePrice > 0;

                return (
                  <motion.div
                    key={book.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className="group flex flex-col bg-white dark:bg-slate-900/60 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-md hover:shadow-2xl transition-all duration-300 hover:border-emerald-500/30"
                  >
                    {/* Book Preview Header & 3D card wrapper */}
                    <div className="bg-slate-50 dark:bg-slate-950/40 p-6 flex justify-center items-center relative overflow-hidden aspect-[4/5] border-b border-slate-100 dark:border-slate-800/40">
                      <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5">
                        <span className="px-2.5 py-1 text-[10px] font-bold tracking-wider rounded-lg bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 uppercase border border-emerald-500/20 w-fit">
                          {book.category}
                        </span>
                        {isPaid ? (
                          <div className="flex flex-col gap-1">
                            <span className="px-2.5 py-1 text-[10px] font-extrabold tracking-wider rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400 uppercase border border-amber-500/25 w-fit">
                              ${Number(activePrice).toFixed(2)}
                            </span>
                            {hasActiveDiscount && (
                              <span className="px-2 py-0.5 text-[8px] font-extrabold tracking-wider rounded bg-rose-500/20 text-rose-600 dark:text-rose-400 line-through uppercase border border-rose-500/25 w-fit">
                                ${Number(basePrice).toFixed(2)}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="px-2.5 py-1 text-[10px] font-extrabold tracking-wider rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 uppercase border border-emerald-500/25 w-fit">
                            FREE
                          </span>
                        )}
                      </div>

                      <div className="absolute top-4 right-4 z-10 bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-lg text-amber-400 font-bold text-xs flex items-center gap-1 border border-white/10">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        {book.rating}
                      </div>

                      {/* Book mockup animation */}
                      <div className="group-hover:scale-105 transition-transform duration-500">
                        <BookCard
                          title={book.title}
                          imageSrc={book.cover_url}
                          width={160}
                          height={220}
                          coverColor="bg-gradient-to-br from-emerald-500 to-teal-600"
                          coverText={isPaid ? "PREMIUM" : "READ NOW"}
                          href={`/free-resources/ebooks/${book.id}`}
                          buttonText="View Info"
                          buttonClassName="hidden"
                        />
                      </div>
                    </div>

                    {/* Product Details Section */}
                    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <Link href={`/free-resources/ebooks/${book.id}`}>
                          <h3 className="font-extrabold text-lg text-slate-800 dark:text-white line-clamp-1 group-hover:text-emerald-500 transition-colors font-heading leading-snug">
                            {book.title}
                          </h3>
                        </Link>
                        <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-2 leading-relaxed">
                          {book.description || "Gain comprehensive insights, step-by-step methodologies, and practical reference guides in this exclusive digital resource."}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
                        <div className="flex items-center gap-1.5">
                          <Download className="w-3.5 h-3.5 text-emerald-500" />
                          <span className="font-semibold text-slate-600 dark:text-slate-300">{book.downloads || 0}</span>
                          <span>DLs</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5 text-emerald-500" />
                          <span className="font-semibold text-slate-600 dark:text-slate-300">{book.pageCount}</span>
                          <span>pages</span>
                        </div>
                      </div>

                      {/* CTA Actions */}
                      <div className="flex gap-2.5 pt-2">
                        <Link
                          href={`/free-resources/ebooks/${book.id}`}
                          className={`flex-1 text-center py-2.5 px-4 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 font-extrabold shadow-sm ${
                            isPaid 
                              ? "bg-amber-500 hover:bg-amber-600 text-slate-900" 
                              : "bg-emerald-500 hover:bg-emerald-600 text-white"
                          }`}
                        >
                          <span>{isPaid ? `Buy Now • $${Number(activePrice).toFixed(2)}` : "Get Free Access"}</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-24 bg-slate-50 dark:bg-slate-900/20 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800"
            >
              <Book className="w-16 h-16 mx-auto mb-4 text-slate-300 dark:text-slate-700 stroke-[1.5]" />
              <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-1">
                No ebooks match your filter
              </h3>
              <p className="text-slate-400 dark:text-slate-600 max-w-sm mx-auto text-sm">
                Try revising your keywords or clearing the category filter.
              </p>
              <button 
                onClick={() => { setSearchQuery(""); setSelectedCategory("All"); }}
                className="mt-6 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-emerald-500/20"
              >
                Reset All Filters
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
