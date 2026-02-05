"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseClient } from "@/lib/supabaseClient";
import GradientText from "@/components/ui/GradientText";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Image as ImageIcon,
  ExternalLink,
} from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

type Item = {
  id: string;
  title: string;
  description?: string;
  image_url?: string;
  category?: string;
  date?: string;
  location?: string;
  tags?: string[];
};

type AdminGalleryClientProps = {
  initialItems: Item[];
};

export default function AdminGalleryClient({
  initialItems,
}: AdminGalleryClientProps) {
  const [items, setItems] = useState<Item[]>(initialItems);
  const [search, setSearch] = useState("");
  const router = useRouter();

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    try {
      const { data: sessionData } = await supabaseClient.auth.getSession();
      const token = sessionData.session?.access_token;

      const res = await fetch(`/api/admin/gallery/${id}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!res.ok) throw new Error("Failed to delete");

      setItems((prev) => prev.filter((item) => item.id !== id));
      toast.success("Item deleted successfully");
      router.refresh(); // Refresh server data
    } catch (error) {
      toast.error("Failed to delete item");
    }
  };

  const filteredItems = items.filter(
    (item) =>
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.category?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            <GradientText colors={["#2563EB", "#7C3AED"]}>Gallery</GradientText>
          </h1>
          <p className="text-slate-500 mt-1">
            Manage your portfolio images and projects.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/gallery"
            target="_blank"
            className="flex items-center text-xs md:text-sm gap-2 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 px-4 py-2 rounded-lg transition-colors"
          >
            <ExternalLink className="w-3 h-3 md:w-5 md:h-5" />
            <span>View Page</span>
          </Link>
          <Link
            href="/admin/gallery/new"
            className="flex items-center text-xs md:text-sm gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors shadow-lg shadow-blue-500/20"
          >
            <Plus className="w-3 h-3 md:w-5 md:h-5" />
            <span>Add New Item</span>
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search gallery..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredItems.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="group bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              <div className="relative h-48 bg-slate-100 overflow-hidden">
                {item.image_url ? (
                  <Image
                    src={item.image_url}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    placeholder="blur"
                    blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-slate-400">
                    <ImageIcon className="w-12 h-12" />
                  </div>
                )}
                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Link
                    href={`/admin/gallery/${item.id}/edit`}
                    className="p-2 bg-white/90 text-blue-600 rounded-lg hover:bg-white backdrop-blur-sm shadow-sm"
                  >
                    <Edit className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 bg-white/90 text-red-500 rounded-lg hover:bg-white backdrop-blur-sm shadow-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                {item.category && (
                  <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/50 backdrop-blur-md rounded text-xs text-white">
                    {item.category}
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg !text-slate-800 mb-1 truncate">
                  {item.title}
                </h3>
                <p className="text-slate-500 text-sm line-clamp-2 min-h-[40px]">
                  {item.description || "No description"}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {item.tags?.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredItems.length === 0 && (
          <div className="col-span-full text-center py-20 text-slate-400">
            <div className="mb-4 flex justify-center">
              <Filter className="w-12 h-12 opacity-50" />
            </div>
            <p className="text-lg font-medium">No items found</p>
            <p className="text-sm">
              Try adjusting your search terms or add a new item.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
