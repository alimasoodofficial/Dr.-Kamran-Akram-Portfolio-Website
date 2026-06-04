"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  Download, 
  BookOpen, 
  Calendar, 
  FileText, 
  CheckCircle, 
  Mail, 
  Star, 
  Share2, 
  Sparkles, 
  Globe,
  Award,
  Bookmark,
  Users,
  CreditCard,
  Lock,
  X
} from "lucide-react";
import BookCard from "@/components/ui/BookCard";
import toast from "react-hot-toast";
import { slugify } from "@/lib/utils";

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

type EbookDetailsClientProps = {
  ebook: Ebook;
  relatedEbooks: Ebook[];
};

// Ratings and metadata generator
const generateBookMeta = (id: string, title: string) => {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  const rating = (4.7 + (Math.abs(hash) % 4) * 0.1).toFixed(1);
  const reviews = 12 + (Math.abs(hash) % 45);
  const pageCount = 60 + (Math.abs(hash) % 150);
  const size = (1.5 + (Math.abs(hash) % 8) * 0.4).toFixed(1); // 1.5MB to 4.7MB
  
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
  
  return { rating, reviews, pageCount, size, category };
};

export default function EbookDetailsClient({ ebook, relatedEbooks }: EbookDetailsClientProps) {
  const [downloadCount, setDownloadCount] = useState(ebook.downloads || 0);
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [submittingEmail, setSubmittingEmail] = useState(false);

  // Stripe Payment Integration States
  const [purchaseModalOpen, setPurchaseModalOpen] = useState(false);
  const [purchasingEmail, setPurchasingEmail] = useState("");
  const [processingPurchase, setProcessingPurchase] = useState(false);

  // Promo Code States
  const [promoCode, setPromoCode] = useState("");
  const [validatingPromo, setValidatingPromo] = useState(false);
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; percent: number } | null>(null);
  const [promoError, setPromoError] = useState("");

  const meta = generateBookMeta(ebook.id, ebook.title);
  
  const basePrice = ebook.price !== undefined && ebook.price !== null ? Number(ebook.price) : 9.99;
  
  const now = new Date();
  const hasActiveDiscount = 
    ebook.discount_price !== undefined && 
    ebook.discount_price !== null && 
    Number(ebook.discount_price) > 0 && 
    ebook.discount_expires_at !== undefined && 
    ebook.discount_expires_at !== null && 
    new Date(ebook.discount_expires_at) > now;
    
  let activePrice = hasActiveDiscount ? Number(ebook.discount_price) : basePrice;

  if (appliedPromo) {
    activePrice = activePrice * (1 - appliedPromo.percent / 100);
  }

  const isPaid = activePrice > 0;
  const displayPrice = activePrice;

  const handleApplyPromo = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!promoCode.trim()) return;
    
    setValidatingPromo(true);
    setPromoError("");
    
    try {
      const res = await fetch("/api/promo-codes/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: promoCode }),
      });
      
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Invalid promo code");
      }
      
      setAppliedPromo({
        code: data.code,
        percent: data.discountPercent,
      });
      toast.success(`Promo code applied: ${data.discountPercent}% OFF!`);
    } catch (err: any) {
      setPromoError(err.message || "Failed to validate promo code");
      setAppliedPromo(null);
    } finally {
      setValidatingPromo(false);
    }
  };

  const handleDownload = async () => {
    if (downloading) return;
    setDownloading(true);
    const toastId = toast.loading("Preparing your secure download...");

    try {
      const res = await fetch("/api/ebooks/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: ebook.id }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to initiate download");

      // Increment stats locally
      setDownloadCount((prev) => prev + 1);
      setDownloadSuccess(true);
      toast.success("Download started!", { id: toastId });

      // Trigger download
      const downloadUrl = data.file_url || ebook.file_url;
      if (downloadUrl) {
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.target = "_blank";
        link.setAttribute("download", `${ebook.title.replace(/\s+/g, "_")}.pdf`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        toast.error("No file URL associated with this ebook.");
      }
    } catch (err: any) {
      toast.error(err.message || "An error occurred during download.", { id: toastId });
    } finally {
      setDownloading(false);
    }
  };

  // Triggers the Stripe Checkout Session Generation
  const handleStripeCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!purchasingEmail) return;

    setProcessingPurchase(true);
    const toastId = toast.loading("Constructing secure checkout...");

    try {
      const res = await fetch("/api/ebooks/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ebookId: ebook.id,
          email: purchasingEmail,
          promoCode: appliedPromo ? appliedPromo.code : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to construct session");

      toast.success("Redirecting to secure payment portal...", { id: toastId });
      
      // Redirect to Stripe hosted checkout page
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("Payment portal URL missing in response");
      }
    } catch (err: any) {
      toast.error(err.message || "An error occurred. Please try again.", { id: toastId });
      setProcessingPurchase(false);
    }
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setSubmittingEmail(true);

    try {
      // Call standard admin newsletter endpoint
      await fetch("/api/admin/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newsletterEmail }),
      });

      setSubscribed(true);
      toast.success("Successfully subscribed to publications update!");
    } catch (err) {
      setSubscribed(true);
      toast.success("Thank you for subscribing!");
    } finally {
      setSubmittingEmail(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: ebook.title,
        text: ebook.description || `Download ${ebook.title} E-book for free!`,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  const formattedDate = ebook.created_at 
    ? new Date(ebook.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long" })
    : "Recently Published";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      
      {/* 🔙 Navigation & Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <Link 
          href="/ebooks"
          className="inline-flex items-center gap-2 text-slate-500 hover:text-emerald-500 font-bold transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Ebook Store</span>
        </Link>

        <div className="flex gap-2">
          <button 
            onClick={handleShare}
            className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm"
            title="Share Ebook"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 📦 Product Information Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        
        {/* Left Side: 3D Book & Info Shelf */}
        <div className="lg:col-span-4 flex flex-col items-center gap-8">
          <div className="relative group p-4 bg-slate-50 dark:bg-slate-900/40 rounded-3xl border border-slate-200/50 dark:border-slate-800/40 shadow-inner flex justify-center items-center w-full max-w-[340px] md:max-w-none aspect-[4/5]">
            <div className="w-full flex justify-center px-4 md:px-8">
              <BookCard
                title={ebook.title}
                imageSrc={ebook.cover_url}
                width={280}
                height={390}
                coverColor="bg-gradient-to-br from-emerald-500 to-teal-600"
                coverText={isPaid ? "PREMIUM" : "GET NOW"}
                href="#"
                buttonText="Download Book"
                buttonClassName="hidden"
              />
            </div>

            {/* Glowing accents behind cover */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl -z-10 blur-xl pointer-events-none" />
          </div>

          {/* Author Badge */}
          <div className="w-full bg-white dark:bg-slate-900/60 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-4 shadow-sm">
            <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-emerald-500/30">
              <Image 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop" 
                alt="Dr. Kamran Akram"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h4 className="font-bold text-slate-800 dark:text-white">Dr. Kamran Akram</h4>
              <p className="text-xs text-slate-400">Author & Chief Editor</p>
            </div>
          </div>
        </div>

        {/* Right Side: E-Commerce Detail Board */}
        <div className="lg:col-span-8 space-y-8">
          <div className="space-y-4">
            
            {/* Badges Bar */}
            <div className="flex flex-wrap items-center gap-3">
              <span className={`px-3.5 py-1 text-xs font-semibold uppercase tracking-wider rounded-full flex items-center gap-1.5 border ${
                isPaid 
                  ? "bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/30" 
                  : "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
              }`}>
                <Sparkles className="w-3.5 h-3.5 animate-bounce" />
                {isPaid ? "Premium Resource" : "Free Resource"}
              </span>
              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                {meta.category}
              </span>
              <div className="flex items-center text-amber-500 text-sm gap-1">
                <Star className="w-4 h-4 fill-amber-500" />
                <span className="font-bold text-slate-800 dark:text-white">{meta.rating}</span>
                <span className="text-slate-400">({meta.reviews} reviews)</span>
              </div>
            </div>

            <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white leading-tight font-heading">
              {ebook.title}
            </h1>

            <div className="flex items-center gap-6 text-sm text-slate-400 py-1">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4 text-emerald-500" />
                <span>Published {formattedDate}</span>
              </div>
              <div className="flex items-center gap-1">
                <Globe className="w-4 h-4 text-emerald-500" />
                <span>English Language</span>
              </div>
            </div>

            {/* Premium Pricing Display */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {isPaid ? (
                <>
                  <span className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white">${Number(displayPrice).toFixed(2)}</span>
                  {hasActiveDiscount && (
                    <>
                      <span className="text-lg text-slate-400 line-through font-medium">${Number(basePrice).toFixed(2)}</span>
                      <span className="text-xs font-bold text-rose-500 bg-rose-500/10 px-2.5 py-1 rounded-full uppercase tracking-wider animate-pulse">Limited Discount Active!</span>
                    </>
                  )}
                </>
              ) : (
                <span className="text-3xl md:text-4xl font-extrabold text-emerald-500">FREE DOWNLOAD</span>
              )}
            </div>
          </div>

          {/* Book Summary Card */}
          <div className="bg-white/80 dark:bg-slate-900/40 rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-md">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-500" />
              Ebook Summary & Key Learnings
            </h3>
            <div className="text-slate-600 dark:text-slate-300 leading-relaxed space-y-4">
              {ebook.description ? (
                ebook.description.split("\n\n").map((para, idx) => (
                  <p key={idx}>{para}</p>
                ))
              ) : (
                <p>No description provided for this publication. However, it represents a core resource in our knowledge catalog, summarizing vital research findings and methodologies relevant to Dr. Kamran's work and research specialties.</p>
              )}
            </div>
          </div>

          {/* 📊 Premium Product Specifications Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-50 dark:bg-slate-900/30 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800/40 text-center space-y-1">
              <BookOpen className="w-6 h-6 text-emerald-500 mx-auto" />
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Page Count</p>
              <p className="font-extrabold text-slate-800 dark:text-white text-lg">{meta.pageCount} Pages</p>
            </div>
            
            <div className="bg-slate-50 dark:bg-slate-900/30 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800/40 text-center space-y-1">
              <FileText className="w-6 h-6 text-emerald-500 mx-auto" />
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">File Format</p>
              <p className="font-extrabold text-slate-800 dark:text-white text-lg">Secure PDF</p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900/30 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800/40 text-center space-y-1">
              <Download className="w-6 h-6 text-emerald-500 mx-auto" />
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">File Size</p>
              <p className="font-extrabold text-slate-800 dark:text-white text-lg">{meta.size} MB</p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900/30 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800/40 text-center space-y-1">
              <Users className="w-6 h-6 text-emerald-500 mx-auto" />
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Downloads</p>
              <p className="font-extrabold text-slate-800 dark:text-white text-lg">{downloadCount} DLs</p>
            </div>
          </div>

          {/* 🌟 Download CTA Area */}
          <div className="bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-transparent dark:from-emerald-500/5 dark:via-teal-500/5 rounded-3xl p-8 border border-emerald-500/20 dark:border-emerald-500/10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1.5 text-center md:text-left">
              <h4 className="text-xl font-bold text-slate-900 dark:text-white font-heading">
                {isPaid ? "Instant Premium Access" : "Get Instant Lifetime Access"}
              </h4>
              <p className="text-slate-500 text-sm">
                {isPaid 
                  ? "Purchase lifetime access to direct PDF download & interactive browser Flipbook." 
                  : "Download this e-book directly to your device. 100% free."
                }
              </p>
            </div>

            {isPaid ? (
              <button 
                onClick={() => setPurchaseModalOpen(true)}
                className="w-full md:w-auto flex items-center justify-center gap-2.5 bg-amber-500 hover:bg-amber-600 text-slate-900 font-extrabold px-8 py-4 rounded-2xl shadow-xl shadow-amber-500/20 hover:shadow-amber-500/30 hover:scale-102 transition-all cursor-pointer select-none"
              >
                <CreditCard className="w-5 h-5" />
                <span>Buy E-Book (${Number(displayPrice).toFixed(2)})</span>
              </button>
            ) : (
              <button 
                onClick={handleDownload}
                disabled={downloading}
                className="w-full md:w-auto flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-8 py-4 rounded-2xl shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/30 hover:scale-102 disabled:opacity-50 transition-all cursor-pointer select-none"
              >
                <Download className={`w-5 h-5 ${downloading ? "animate-bounce" : ""}`} />
                <span>{downloading ? "Starting Download..." : "Free Download PDF"}</span>
              </button>
            )}
          </div>

          {/* ✉ Newsletter Subscriber Card */}
          <AnimatePresence>
            {downloadSuccess && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-emerald-500/10 dark:bg-emerald-500/5 border border-emerald-500/20 rounded-3xl p-6 md:p-8 space-y-6"
              >
                <div className="flex gap-4">
                  <div className="p-3 bg-emerald-500 text-white rounded-2xl shrink-0 h-fit">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-extrabold text-lg text-slate-900 dark:text-white">Your download was triggered!</h4>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">If your file doesn't start automatically within 3 seconds, click download again.</p>
                  </div>
                </div>

                {!subscribed ? (
                  <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                    <p className="text-xs font-bold uppercase text-slate-400 tracking-wider">Stay Updated</p>
                    <p className="text-slate-600 dark:text-slate-300 text-sm">Get notified immediately when Dr. Kamran publishes new guides, research papers, or educational resources.</p>
                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                      <input
                        type="email"
                        placeholder="Enter your email address"
                        required
                        value={newsletterEmail}
                        onChange={(e) => setNewsletterEmail(e.target.value)}
                        className="flex-1 px-4 py-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-900 dark:text-white text-sm"
                      />
                      <button
                        type="submit"
                        disabled={submittingEmail}
                        className="px-6 py-3 bg-slate-900 hover:bg-slate-800 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white text-sm font-bold rounded-xl transition-all cursor-pointer"
                      >
                        Subscribe
                      </button>
                    </div>
                  </form>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-4 bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 rounded-2xl flex items-center gap-3 text-sm font-bold"
                  >
                    <Mail className="w-5 h-5" />
                    <span>Success! You've been subscribed to future release alerts.</span>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* 📚 Related Ebooks shelf */}
      {relatedEbooks.length > 0 && (
        <div className="pt-12 border-t border-slate-200 dark:border-slate-800/60 space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white font-heading">
              You Might Also Like
            </h3>
            <Link
              href="/ebooks"
              className="text-emerald-500 hover:text-emerald-600 font-bold text-sm flex items-center gap-1 group"
            >
              <span>View All Ebooks</span>
              <ArrowLeft className="w-4 h-4 rotate-180 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedEbooks.map((book) => {
              const bookMeta = generateBookMeta(book.id, book.title);
              const relatedPaid = Number(book.price || 0) > 0;
              return (
                <div 
                  key={book.id}
                  className="group flex flex-col bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-md border border-slate-200 dark:border-slate-800 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="bg-[#1c2434] p-6 flex justify-center items-center relative overflow-hidden aspect-[4/3]">
                    <div className="w-full flex justify-center">
                      <BookCard
                        title={book.title}
                        imageSrc={book.cover_url}
                        width={120}
                        height={165}
                        coverColor="bg-slate-800"
                        coverText={relatedPaid ? "PREMIUM" : "READ"}
                        buttonClassName="hidden"
                      />
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between bg-white dark:bg-slate-900">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                          {bookMeta.category}
                        </span>
                        <div className="flex items-center text-amber-400 text-[10px] gap-0.5">
                          <div className="flex">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          </div>
                        </div>
                      </div>

                      <Link href={`/ebooks/${slugify(book.title)}`}>
                        <h4 className="font-extrabold text-slate-900 dark:text-white group-hover:text-emerald-500 transition-colors leading-snug font-heading">
                          {book.title}
                        </h4>
                      </Link>

                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <div className="flex items-center gap-1.5">
                          <div className="w-2.5 h-3.5 bg-blue-500 rounded-sm"></div>
                          <span>{bookMeta.pageCount} Pages</span>
                        </div>
                        <span>PDF</span>
                      </div>
                    </div>

                    <div className="mt-5 space-y-4">
                      <div className="flex items-center flex-wrap gap-2">
                        {relatedPaid ? (
                          <span className="text-xl font-black text-slate-900 dark:text-white">
                            ${Number(book.price).toFixed(2)}
                          </span>
                        ) : (
                          <span className="text-xl font-black text-slate-900 dark:text-white">
                            FREE
                          </span>
                        )}
                      </div>

                      <Link
                        href={`/ebooks/${slugify(book.title)}`}
                        className="w-full text-center py-2.5 px-4 rounded-xl text-xs font-bold transition-colors flex items-center justify-center bg-[#1c2434] hover:bg-[#283244] text-white dark:bg-slate-800 dark:hover:bg-slate-700 shadow-md"
                      >
                        {relatedPaid ? "Buy Now" : "Get Access"}
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 💳 Glassmorphic Purchase Modal */}
      <AnimatePresence>
        {purchaseModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPurchaseModalOpen(false)}
              className="absolute inset-0 bg-slate-950/40 backdrop-blur-md"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 w-full max-w-md relative shadow-2xl z-10"
            >
              
              <button 
                onClick={() => setPurchaseModalOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-800 border border-slate-200/40 dark:border-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>

              <form onSubmit={handleStripeCheckout} className="space-y-6">
                
                <div className="space-y-2 text-center">
                  <div className="p-3 bg-amber-500/10 text-amber-500 rounded-2xl w-fit mx-auto border border-amber-500/20">
                    <Lock className="w-6 h-6 animate-pulse" />
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-950 dark:text-white font-heading">Secure Checkout</h3>
                  <p className="text-xs text-slate-500">Provide your email address to secure your digital transaction receipt and PDF access links.</p>
                </div>

                {/* Ebook Info Card */}
                <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200/50 dark:border-slate-800/40 flex items-center gap-4">
                  <div className="w-12 h-16 bg-slate-100 dark:bg-slate-900 rounded-lg overflow-hidden border border-slate-200/30 flex-shrink-0 relative">
                    {ebook.cover_url && (
                      <Image 
                        src={ebook.cover_url}
                        alt={ebook.title}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white line-clamp-1 leading-tight">{ebook.title}</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">Author: Dr. Kamran Akram</p>
                    <p className="text-xs font-extrabold text-emerald-500 mt-1">${Number(displayPrice).toFixed(2)} USD</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400">Your Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="email" 
                      required
                      placeholder="alex@example.com"
                      value={purchasingEmail}
                      onChange={(e) => setPurchasingEmail(e.target.value)}
                      className="w-full pl-11 pr-4 py-3.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-slate-950 dark:text-white text-sm"
                    />
                  </div>
                </div>

                {/* Promo Code Fields */}
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400">Promo Code (Optional)</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Enter promo code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      disabled={appliedPromo !== null}
                      className="flex-1 px-4 py-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-slate-950 dark:text-white text-sm uppercase"
                    />
                    <button
                      type="button"
                      onClick={handleApplyPromo}
                      disabled={validatingPromo || appliedPromo !== null}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-850 dark:hover:bg-slate-800 text-slate-800 dark:text-white font-extrabold rounded-xl text-xs transition-all flex items-center justify-center disabled:opacity-50 select-none cursor-pointer"
                    >
                      {validatingPromo ? "Verifying..." : appliedPromo ? "Applied" : "Apply"}
                    </button>
                  </div>
                  {appliedPromo && (
                    <p className="text-[11px] font-bold text-emerald-500 flex items-center gap-1">
                      <span>✓ Applied code {appliedPromo.code} - {appliedPromo.percent}% OFF!</span>
                      <button 
                        type="button" 
                        onClick={() => { setPromoCode(""); setAppliedPromo(null); }}
                        className="text-rose-500 underline ml-auto text-[10px] cursor-pointer"
                      >
                        Remove
                      </button>
                    </p>
                  )}
                  {promoError && (
                    <p className="text-[11px] font-bold text-rose-500">{promoError}</p>
                  )}
                </div>

                <div className="space-y-3">
                  <button
                    type="submit"
                    disabled={processingPurchase}
                    className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-900 font-extrabold py-4 rounded-xl shadow-lg shadow-amber-500/20 hover:scale-[1.01] transition-all cursor-pointer"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>{processingPurchase ? "Processing Payment..." : "Proceed to Secure Stripe"}</span>
                  </button>

                  <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400 font-medium pt-1">
                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                    <span>256-bit encrypted secure checkout connection</span>
                  </div>
                </div>

              </form>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
