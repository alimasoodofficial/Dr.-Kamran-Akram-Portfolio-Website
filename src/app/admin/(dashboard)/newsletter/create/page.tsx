"use client";

import { useActionState, useRef, useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import { ArrowLeft, ImagePlus, Eye, Loader2, Save, FileText } from "lucide-react";
import { saveNewsletter } from "@/app/actions/saveNewsletter";
import GradientText from "@/components/ui/GradientText";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function formatDate(iso?: string) {
  return new Date(iso ?? Date.now()).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// ---------------------------------------------------------------------------
// Submit button
// ---------------------------------------------------------------------------
function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium transition-colors shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
      {pending ? "Saving…" : label}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function NewsletterCreatePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [, startTransition] = useTransition();

  // Form fields (controlled for live preview)
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [heroUrl, setHeroUrl] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<"draft" | "published">("draft");

  const [state, formAction] = useActionState(saveNewsletter, null);

  // Redirect after successful save
  if (state?.success && state.id) {
    startTransition(() => router.push("/admin/newsletter"));
  }

  // Show toast on error
  if (state?.error) toast.error(state.error);

  // ---------------------------------------------------------------------------
  // Hero image upload (client → API route → Supabase Storage)
  // ---------------------------------------------------------------------------
  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Client-side preview while uploading
    const localUrl = URL.createObjectURL(file);
    setHeroUrl(localUrl);
    setUploading(true);

    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/newsletter/upload-hero", {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      
      setHeroUrl(data.url);
      toast.success("Hero image uploaded");
    } catch (err: any) {
      toast.error(err.message || "Image upload failed");
      setHeroUrl("");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/newsletter"
          className="p-2 hover:bg-slate-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-slate-500" />
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">
          <GradientText colors={["#10B981", "#3B82F6"]}>
            New Newsletter
          </GradientText>
        </h1>
      </div>

      {/* Two-column layout ------------------------------------------------- */}
      <form action={formAction}>
        {/* Hidden fields for controlled values */}
        <input type="hidden" name="title" value={title} />
        <input type="hidden" name="subtitle" value={subtitle} />
        <input type="hidden" name="hero_image_url" value={heroUrl} />
        <input type="hidden" name="content" value={content} />
        <input type="hidden" name="status" value={status} />

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
          {/* ── LEFT: Inputs ──────────────────────────────────────────── */}
          <div className="space-y-5 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <FileText className="w-3.5 h-3.5" /> Content
            </p>

            {/* Title */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700">
                Title <span className="text-red-400">*</span>
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. AI in Healthcare 2027"
                required
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-500 focus:bg-white focus:ring-2 focus:ring-emerald-400 focus:outline-none transition"
              />
            </div>

            {/* Subtitle */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700">
                Subtitle
              </label>
              <input
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="A short description shown under the title"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-500 focus:bg-white focus:ring-2 focus:ring-emerald-400 focus:outline-none transition"
              />
            </div>

            {/* Hero Image */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700">
                Hero Image
              </label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="relative flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 hover:bg-slate-100 cursor-pointer transition overflow-hidden"
              >
                {heroUrl ? (
                  <Image
                    src={heroUrl}
                    alt="Hero preview"
                    fill
                    className="object-cover rounded-xl"
                    unoptimized
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-slate-400">
                    {uploading ? (
                      <Loader2 className="w-8 h-8 animate-spin" />
                    ) : (
                      <>
                        <ImagePlus className="w-8 h-8" />
                        <span className="text-xs">Click to upload</span>
                      </>
                    )}
                  </div>
                )}
                {uploading && (
                  <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                    <Loader2 className="w-6 h-6 animate-spin text-gray-600" />
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
              {heroUrl && !heroUrl.startsWith("blob:") && (
                <p className="text-xs text-slate-400 truncate">{heroUrl}</p>
              )}
            </div>

            {/* Content */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700">
                Content <span className="text-red-400">*</span>
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={12}
                placeholder="Write your newsletter content here…"
                required
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-500 focus:bg-white focus:ring-2 focus:ring-emerald-400 focus:outline-none transition resize-none leading-relaxed"
              />
            </div>

            {/* Status + actions */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <div className="flex items-center gap-3">
                <label className="text-sm font-medium text-slate-600">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) =>
                    setStatus(e.target.value as "draft" | "published")
                  }
                  className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 bg-slate-50 text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
              <SubmitButton label="Save Newsletter" />
            </div>
          </div>

          {/* ── RIGHT: Live Preview ───────────────────────────────────── */}
          <div className="sticky top-6 space-y-4">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Eye className="w-3.5 h-3.5" /> Live Preview
            </p>

            <article className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              {/* Hero */}
              {heroUrl && !heroUrl.startsWith("blob:") ? (
                <div className="relative w-full h-52">
                  <Image
                    src={heroUrl}
                    alt="Hero"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              ) : heroUrl ? (
                <div className="w-full h-52 bg-slate-100 animate-pulse" />
              ) : (
                <div className="w-full h-52 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-300">
                  <ImagePlus className="w-10 h-10" />
                </div>
              )}

              <div className="p-6 space-y-4">
                {/* Breadcrumb */}
                <p className="text-xs text-slate-400 font-medium uppercase tracking-widest">
                  Newsletter · {formatDate()}
                </p>

                {/* Title */}
                <h1 className="text-2xl font-bold text-slate-900 leading-tight">
                  {title || (
                    <span className="text-slate-300">Your title appears here</span>
                  )}
                </h1>

                {/* Subtitle */}
                {subtitle && (
                  <p className="text-slate-500 text-sm leading-relaxed">
                    {subtitle}
                  </p>
                )}

                {/* Divider */}
                <hr className="border-slate-100" />

                {/* Content */}
                <div className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">
                  {content || (
                    <span className="text-slate-300">
                      Your content will appear here…
                    </span>
                  )}
                </div>

                {/* Status badge */}
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                    status === "published"
                      ? "bg-emerald-100 text-gray-700"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {status === "published" ? "● Published" : "● Draft"}
                </span>
              </div>
            </article>
          </div>
        </div>
      </form>
    </div>
  );
}
