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
  price?: number;
  discount_price?: number;
  discount_expires_at?: string;
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

  // Unified E-Commerce Admin Cockpit
  const [activeTab, setActiveTab] = useState<"ebooks" | "promos">("ebooks");
  const [promoCodes, setPromoCodes] = useState<any[]>([]);
  const [loadingPromos, setLoadingPromos] = useState(false);
  const [newCode, setNewCode] = useState("");
  const [newPercent, setNewPercent] = useState("");
  const [newExpiresAt, setNewExpiresAt] = useState("");
  const [creatingPromo, setCreatingPromo] = useState(false);

  const fetchPromos = async () => {
    setLoadingPromos(true);
    try {
      const { data, error } = await supabaseClient
        .from("promo_codes")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setPromoCodes(data || []);
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to load promo codes");
    } finally {
      setLoadingPromos(false);
    }
  };

  const handleCreatePromo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode || !newPercent || !newExpiresAt) {
      toast.error("Please fill in all promo code fields");
      return;
    }
    setCreatingPromo(true);
    const toastId = toast.loading("Creating promo code...");
    try {
      const cleanCode = newCode.trim().toUpperCase();
      const percent = parseFloat(newPercent);
      if (isNaN(percent) || percent <= 0 || percent > 100) {
        throw new Error("Discount must be between 1 and 100 percent");
      }

      const { data, error } = await supabaseClient
        .from("promo_codes")
        .insert({
          code: cleanCode,
          discount_percent: percent,
          expires_at: new Date(newExpiresAt).toISOString(),
          is_active: true
        })
        .select()
        .single();

      if (error) throw error;
      
      setPromoCodes((prev) => [data, ...prev]);
      toast.success("Promo code created successfully!", { id: toastId });
      setNewCode("");
      setNewPercent("");
      setNewExpiresAt("");
    } catch (err: any) {
      toast.error(err.message || "Failed to create promo code", { id: toastId });
    } finally {
      setCreatingPromo(false);
    }
  };

  const handleDeletePromo = async (id: string) => {
    if (!confirm("Are you sure you want to delete this promo code?")) return;
    try {
      const { error } = await supabaseClient
        .from("promo_codes")
        .delete()
        .eq("id", id);
      if (error) throw error;
      setPromoCodes((prev) => prev.filter((p) => p.id !== id));
      toast.success("Promo code deleted");
    } catch (err: any) {
      toast.error("Failed to delete promo code");
    }
  };

  const handleTogglePromoActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabaseClient
        .from("promo_codes")
        .update({ is_active: !currentStatus })
        .eq("id", id);
      if (error) throw error;
      setPromoCodes((prev) =>
        prev.map((p) => (p.id === id ? { ...p, is_active: !currentStatus } : p))
      );
      toast.success(`Promo code ${!currentStatus ? "activated" : "deactivated"}`);
    } catch (err: any) {
      toast.error("Failed to update status");
    }
  };

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
            href="/ebooks"
            target="_blank"
            className="flex items-center text-xs md:text-sm gap-2 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 px-4 py-2 rounded-lg transition-colors"
          >
            <ExternalLink className="w-3 h-3 md:w-5 md:h-5" />
            <span>View Page</span>
          </Link>
          <Link
            href="/admin/ebooks/new"
            className="flex items-center text-xs md:text-sm gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg transition-colors shadow-lg shadow-emerald-500/20"
          >
            <Plus className="w-3 h-3 md:w-5 md:h-5" />
            <span>Add Ebook</span>
          </Link>
        </div>
      </div>

      {/* 🎛️ Tab Selector Cockpit */}
      <div className="flex border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab("ebooks")}
          className={`pb-4 px-6 text-sm font-extrabold transition-all border-b-2 flex items-center gap-2 ${
            activeTab === "ebooks"
              ? "border-emerald-500 text-emerald-600 dark:text-emerald-400"
              : "border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          }`}
        >
          <span>📚 All E-Books</span>
        </button>
        <button
          onClick={() => {
            setActiveTab("promos");
            fetchPromos();
          }}
          className={`pb-4 px-6 text-sm font-extrabold transition-all border-b-2 flex items-center gap-2 ${
            activeTab === "promos"
              ? "border-emerald-500 text-emerald-600 dark:text-emerald-400"
              : "border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          }`}
        >
          <span>🎫 Promo Codes</span>
        </button>
      </div>

      {activeTab === "ebooks" ? (
        <div className="space-y-6">
          <div className="flex items-center gap-4 bg-white dark:bg-slate-900/60 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800/60">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search ebooks..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-slate-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <AnimatePresence>
              {filtered.map((ebook) => {
                const basePrice = ebook.price !== undefined && ebook.price !== null ? Number(ebook.price) : 9.99;
                const now = new Date();
                const hasActiveDiscount = 
                  ebook.discount_price !== undefined && 
                  ebook.discount_price !== null && 
                  Number(ebook.discount_price) > 0 && 
                  (!ebook.discount_expires_at || new Date(ebook.discount_expires_at) > now);
                
                const activePrice = hasActiveDiscount ? Number(ebook.discount_price) : basePrice;
                const isPaid = activePrice > 0;

                return (
                  <motion.div
                    key={ebook.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="group relative bg-white dark:bg-slate-900/60 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800/60 overflow-hidden hover:shadow-xl transition-all duration-300"
                  >
                    <div className="aspect-[2/3] bg-slate-100 dark:bg-slate-950/40 relative overflow-hidden">
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
                        className="font-bold text-slate-800 dark:text-slate-100 line-clamp-1 text-sm md:text-base"
                        title={ebook.title}
                      >
                        {ebook.title}
                      </h3>
                      <div className="flex items-center justify-between text-slate-400 text-xs mt-2">
                        <div className="flex items-center gap-1">
                          <Download className="w-3 h-3 text-emerald-500" />
                          <span>{ebook.downloads || 0} downloads</span>
                        </div>
                        <div className="flex flex-col items-end">
                          {isPaid ? (
                            <>
                              <span className="font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded">
                                ${Number(activePrice).toFixed(2)}
                              </span>
                              {hasActiveDiscount && (
                                <span className="text-[10px] text-slate-400 line-through mt-0.5">
                                  ${Number(basePrice).toFixed(2)}
                                </span>
                              )}
                            </>
                          ) : (
                            <span className="font-extrabold text-emerald-600 bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-400 px-1.5 py-0.5 rounded uppercase text-[10px]">
                              FREE
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
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
      ) : (
        <div className="space-y-8">
          {/* 🎟️ Coupon Creator Form */}
          <div className="bg-white dark:bg-slate-900/60 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-md">
            <h2 className="text-lg font-extrabold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
              <span className="p-1.5 bg-emerald-500/10 text-emerald-500 rounded-lg">🎟️</span>
              Create Stripe Promo Code
            </h2>
            <form onSubmit={handleCreatePromo} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
                  Promo Code
                </label>
                <input
                  type="text"
                  placeholder="e.g. SPECIAL50"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-950/40 text-slate-800 dark:text-slate-100 font-mono font-bold uppercase placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
                  Discount Percentage
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  placeholder="e.g. 50"
                  value={newPercent}
                  onChange={(e) => setNewPercent(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-950/40 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
                  Expiration Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={newExpiresAt}
                  onChange={(e) => setNewExpiresAt(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-950/40 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <button
                type="submit"
                disabled={creatingPromo}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-sm py-2 px-4 rounded-lg shadow-md hover:shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-1.5 h-[42px]"
              >
                <Plus className="w-4 h-4" />
                <span>Create Coupon</span>
              </button>
            </form>
          </div>

          {/* 📋 Promo Codes List Table */}
          <div className="bg-white dark:bg-slate-900/60 rounded-2xl border border-slate-200/60 dark:border-slate-800 overflow-hidden shadow-md">
            {loadingPromos ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : promoCodes.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-950/40 border-b border-slate-200 dark:border-slate-800">
                      <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500">Code</th>
                      <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500">Discount</th>
                      <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500">Status</th>
                      <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500">Expires At</th>
                      <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {promoCodes.map((promo) => {
                      const isExpired = new Date(promo.expires_at) < new Date();
                      return (
                        <tr
                          key={promo.id}
                          className="border-b border-slate-100 dark:border-slate-800/40 hover:bg-slate-50/50 dark:hover:bg-slate-900/20 transition-colors"
                        >
                          <td className="p-4">
                            <span className="px-3 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 rounded-md font-mono font-extrabold text-sm">
                              {promo.code}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className="font-extrabold text-slate-800 dark:text-slate-200">
                              {promo.discount_percent}% OFF
                            </span>
                          </td>
                          <td className="p-4">
                            <button
                              onClick={() => handleTogglePromoActive(promo.id, promo.is_active)}
                              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-lg transition-colors border ${
                                isExpired
                                  ? "bg-rose-500/10 text-rose-500 border-rose-500/20"
                                  : promo.is_active
                                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20"
                                  : "bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700 hover:bg-slate-200"
                              }`}
                            >
                              <span className={`w-2 h-2 rounded-full ${
                                isExpired ? "bg-rose-500" : promo.is_active ? "bg-emerald-500" : "bg-slate-400"
                              }`} />
                              <span>{isExpired ? "EXPIRED" : promo.is_active ? "ACTIVE" : "DISABLED"}</span>
                            </button>
                          </td>
                          <td className="p-4 text-xs font-semibold text-slate-500">
                            {new Date(promo.expires_at).toLocaleString()}
                          </td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => handleDeletePromo(promo.id)}
                              className="p-2 bg-rose-500/10 hover:bg-rose-500 text-rose-600 hover:text-white rounded-lg transition-all"
                              title="Delete Promo Code"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-16 text-slate-400">
                🎫
                <p className="text-lg font-medium mt-2">No promo codes active</p>
                <p className="text-sm">Create your first promo code using the cockpit above.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
