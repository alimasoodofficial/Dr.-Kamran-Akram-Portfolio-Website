"use client";

import Image from "next/image";
import React, { useMemo, useState, useEffect } from "react";
import GlowingInput from "./GlowingInput";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

type Item = {
  id: number;
  title: string;
  description: string;
  image_url: string;
  date: string;
  location?: string;
  category?: string;
  tags?: string[];
};

export default function GalleryGridClient({ items }: { items: Item[] }) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedItem) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [selectedItem]);

  const categories = useMemo(() => {
    const cats = items
      .map((i) => i.category)
      .filter((c): c is string => typeof c === "string" && c.trim() !== "");
    return ["All", ...new Set(cats)];
  }, [items]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return items.filter((i) => {
      if (activeCategory !== "All" && i.category !== activeCategory)
        return false;
      if (!q) return true;
      return `${i.title} ${i.description} ${i.location} ${i.category}`
        .toLowerCase()
        .includes(q);
    });
  }, [items, query, activeCategory]);

  return (
    <section className="">
      {/* --- Search & Filter Header --- */}
      <div className="max-w-7xl mx-auto mb-8 space-y-6">
        <div className="flex justify-center">
          <GlowingInput
            value={query}
            onChange={(e) => setQuery((e.target as HTMLInputElement).value)}
            placeholder="Search gallery..."
            className="w-full max-w-xl"
          />
        </div>

        <div className="flex gap-2 flex-wrap justify-center">
          {categories.map((c) => (
            <button
              key={String(c ?? "All")}
              onClick={() => setActiveCategory(c ?? "All")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === (c ?? "All")
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/30"
                  : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:shadow-sm"
              }`}
            >
              {String(c ?? "All")}
            </button>
          ))}
        </div>
      </div>

      {/* --- Masonry Grid --- */}
      <div className="max-w-7xl mx-auto">
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6 pb-10">
          {filtered.map((item) => (
            <motion.div
              layoutId={`card-${item.id}`}
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="group relative break-inside-avoid overflow-hidden rounded-2xl bg-gray-200 dark:bg-gray-800 shadow-lg hover:shadow-2xl cursor-pointer"
              whileHover={{ y: -5 }} 
              transition={{ duration: 0.2 }}
            >
              <div className="relative">
                <Image
                  src={item.image_url}
                  alt={item.title}
                  width={0}
                  height={0}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="w-full h-auto"
                />
                
                {/* Hover Overlay */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 flex flex-col justify-end p-6 transition-opacity duration-300"
                >
                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <span className="text-blue-400 text-xs font-bold uppercase tracking-wider mb-1 block">
                      {item.category}
                    </span>
                    <h3 className="text-white font-bold text-xl leading-tight">
                      {item.title}
                    </h3>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* --- Framer Motion Modal --- */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedItem(null)}
              className="absolute inset-0  backdrop-blur-2xl"
            />

            {/* Expanded Card */}
            <motion.div
              layoutId={`card-${selectedItem.id}`}
              // CHANGED: Increased max-width to 7xl or 95vw to allow the 70% image to be large
              className="relative w-full max-w-[95vw] lg:max-w-7xl bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row h-[85vh] md:h-[80vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors backdrop-blur-md"
              >
                <X size={24} />
              </button>

              {/* Image Section */}
              <div className="relative w-full md:w-[70%] h-1/2 md:h-full bg-black flex items-center justify-center">
                <Image
                  src={selectedItem.image_url}
                  alt={selectedItem.title}
                  fill
                  className="object-contain"
                  priority
                />
              </div>

              {/* Content Section - Remains flex-1 (taking the remaining 30%) */}
              <div className="flex-1 w-full md:w-[30%] p-6 md:p-8 flex flex-col overflow-y-auto bg-white dark:bg-gray-900 border-l border-gray-100 dark:border-gray-800 backdrop-blur-2xl">
                <div className="py-10">
                  <div className="flex items-center justify-between mb-2">
                     <span className="text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider">
                      {selectedItem.category}
                    </span>
                    <span className="text-gray-400 text-xs">
                      {new Date(selectedItem.date).toLocaleDateString()}
                    </span>
                  </div>
                 
                  <motion.h2 
                    layoutId={`title-${selectedItem.id}`}
                    className="text-2xl font-bold text-gray-900 dark:text-white mb-4"
                  >
                    {selectedItem.title}
                  </motion.h2>

                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6 text-sm">
                    {selectedItem.description}
                  </p>

                  <div className="mt-auto pt-6 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {selectedItem.tags?.map((tag) => (
                        <span key={tag} className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-full text-xs font-medium">
                          #{tag}
                        </span>
                      ))}
                    </div>
                    {selectedItem.location && (
                      <p className="text-xs text-gray-400 flex items-center gap-1">
                        📍 {selectedItem.location}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}