"use client";

import Image from "next/image";
import React, { useMemo, useState } from "react";
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
    <section>
      <div className="mb-6">
        <GlowingInput
          value={query}
          onChange={(e) => setQuery((e.target as HTMLInputElement).value)}
          placeholder="Search..."
          className="w-9/12 p-0"
        />
      </div>

      <div className="flex gap-2 flex-wrap mb-6">
        {categories.map((c) => (
          <button
            key={String(c ?? "All")}
            onClick={() => setActiveCategory(c ?? "All")}
            className={`px-3 py-1 rounded-full text-sm transition-colors duration-200 ${
              activeCategory === (c ?? "All")
                ? "bg-blue-600 text-white"
                : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            {String(c ?? "All")}
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filtered.map((card) => (
          <article
            key={card.id}
            className="group bg-white dark:bg-gray-900 rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <div 
              className="relative w-full h-56 cursor-pointer overflow-hidden"
              onClick={() => setSelectedItem(card)}
            >
              <Image
                src={card.image_url}
                alt={card.title}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <span className="bg-black/50 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">View</span>
              </div>
            </div>

            <div className="p-4">
              <div className="text-xs text-gray-500">{card.category}</div>
              <h3 className="font-semibold mt-1 group-hover:text-blue-600 transition-colors">{card.title}</h3>
              <p className="text-sm mt-2 line-clamp-3">{card.description}</p>
              <div className="text-xs text-gray-400 mt-3">
                {new Date(card.date).toLocaleDateString()} • {card.location}
              </div>
              <div className="flex gap-2 flex-wrap mt-3">
                {card.tags?.map((t) => (
                  <span key={t} className="text-xs px-2 py-1 card rounded-full bg-gray-100 dark:bg-gray-800">
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="mt-10 text-center text-gray-500">No results</p>
      )}

      {/* Image Preview Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedItem(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center"
            >
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute -top-12 right-0 p-2 text-white/70 hover:text-white transition-colors"
              >
                <X size={32} />
              </button>
              
              <div className="relative w-full h-[80vh] rounded-lg overflow-hidden shadow-2xl">
                <Image
                  src={selectedItem.image_url}
                  alt={selectedItem.title}
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              
              <div className="mt-4 text-center">
                <h2 className="text-2xl font-bold text-white">{selectedItem.title}</h2>
                {selectedItem.description && (
                  <p className="text-white/80 mt-2 max-w-2xl mx-auto break-words line-clamp-2">
                    {selectedItem.description}
                  </p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
