"use client";

import Image from "next/image";
import React, { useMemo, useState } from "react";

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

  const categories = useMemo(() => {
    const set = new Set(items.map((i) => i.category).filter(Boolean));
    return ["All", ...Array.from(set)];
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
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search..."
          className="w-full p-3 rounded-xl border"
        />
      </div>

      <div className="flex gap-2 flex-wrap mb-6">
        {categories.map((c) => (
          <button
            key={String(c ?? "All")}
            onClick={() => setActiveCategory(c ?? "All")}
            className={`px-3 py-1 rounded-full text-sm ${
              activeCategory === (c ?? "All")
                ? "bg-blue-600 text-white"
                : "bg-gray-100 dark:bg-gray-800"
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
            className="bg-white dark:bg-gray-900 rounded-lg shadow overflow-hidden"
          >
            <div className="relative w-full h-56">
              <Image
                src={card.image_url}
                alt={card.title}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover"
              />
            </div>

            <div className="p-4">
              <div className="text-xs text-gray-500">{card.category}</div>
              <h3 className="font-semibold mt-1">{card.title}</h3>
              <p className="text-sm mt-2 text-gray-600 line-clamp-3">
                {card.description}
              </p>
              <div className="text-xs text-gray-400 mt-3">
                {new Date(card.date).toLocaleDateString()} • {card.location}
              </div>
              <div className="flex gap-2 flex-wrap mt-3">
                {card.tags?.map((t) => (
                  <span
                    key={t}
                    className="text-xs px-2 py-1 bg-gray-100 rounded-full"
                  >
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
    </section>
  );
}
