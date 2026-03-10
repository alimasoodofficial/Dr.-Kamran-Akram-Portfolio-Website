"use client";

import { useState } from "react";
import { supabaseClient } from "@/lib/supabaseClient";
import GradientText from "@/components/ui/GradientText";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Book,
  Download,
  ExternalLink,
} from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";

type Ebook = {
  id: string;
  title: string;
  description?: string;
  cover_url?: string;
  file_url?: string;
  downloads?: number;
};

type AdminEbooksClientProps = {
  initialEbooks: Ebook[];
};

export default function AdminEbooksClient({
  initialEbooks,
}: AdminEbooksClientProps) {
  const [ebooks, setEbooks] = useState<Ebook[]>(initialEbooks);
  const [search, setSearch] = useState("");
  const router = useRouter();

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this ebook?")) return;
    try {
      const { error } = await supabaseClient
        .from("ebooks")
        .delete()
        .eq("id", id);
      if (error) throw error;
      setEbooks((prev) => prev.filter((e) => e.id !== id));
      toast.success("Ebook deleted");
      router.refresh();
    } catch (error) {
      toast.error("Failed to delete ebook");
    }
  };

  const filtered = ebooks.filter((e) =>
    e.title.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            <GradientText colors={["#F59E0B", "#EF4444"]}>Ebooks</GradientText>
          </h1>
          <p className="text-slate-500 mt-1">
            Manage digital downloads and resources.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/free-resources/ebooks"
            target="_blank"
            className="flex items-center text-xs md:text-sm gap-2 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 px-4 py-2 rounded-lg transition-colors"
          >
            <ExternalLink className="w-3 h-3 md:w-5 md:h-5" />
            <span>View Page</span>
          </Link>
          <Link
            href="/admin/ebooks/new"
            className="flex items-center text-xs md:text-sm gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors shadow-lg shadow-orange-500/20"
          >
            <Plus className="w-3 h-3 md:w-5 md:h-5" />
            <span>Add Ebook</span>
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search ebooks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all placeholder:text-slate-400"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <AnimatePresence>
          {filtered.map((ebook) => (
            <motion.div
              key={ebook.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="group relative bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              <div className="aspect-[2/3] bg-slate-100 relative overflow-hidden">
                {ebook.cover_url ? (
                  <Image
                    src={ebook.cover_url}
                    alt={ebook.title}
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    className="object-cover transition-transform group-hover:scale-105"
                    placeholder="blur"
                    blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-slate-300">
                    <Book className="w-12 h-12 mb-2" />
                    <span className="text-xs">No Cover</span>
                  </div>
                )}

                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3">
                  <Link
                    href={`/admin/ebooks/${ebook.id}/edit`}
                    className="px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-full text-sm font-medium transition-colors"
                  >
                    Edit Details
                  </Link>
                  <button
                    onClick={() => handleDelete(ebook.id)}
                    className="px-4 py-2 bg-red-500/80 hover:bg-red-500 text-white rounded-full text-sm font-medium transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <div className="p-4">
                <h3
                  className="font-bold text-slate-800 line-clamp-1"
                  title={ebook.title}
                >
                  {ebook.title}
                </h3>
                <div className="flex items-center gap-1 text-slate-400 text-xs mt-2">
                  <Download className="w-3 h-3" />
                  <span>{ebook.downloads || 0} downloads</span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filtered.length === 0 && (
          <div className="col-span-full text-center py-20 text-slate-400">
            <Book className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">No ebooks found</p>
            <p className="text-sm">
              Try adjusting your search or add a new ebook.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
