"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { supabaseClient } from "@/lib/supabaseClient";
import GradientText from "@/components/ui/GradientText";
import { ArrowLeft, Save, Upload, X } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditArticle({ params }: PageProps) {
  const { id } = use(params);
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [author, setAuthor] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    checkAuthAndFetch();
  }, [id]);

  const checkAuthAndFetch = async () => {
    try {
      const { data: sessionData } = await supabaseClient.auth.getSession();
      if (!sessionData.session?.access_token) {
        toast.error("Unauthorized");
        router.push("/admin/login");
        return;
      }
      setToken(sessionData.session.access_token);

      const { data, error } = await supabaseClient
        .from("articles")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      if (data) {
        setTitle(data.title);
        setSummary(data.summary || "");
        setContent(data.content || "");
        setCategory(data.category || "");
        setAuthor(data.author || "");
        setImageUrl(data.image_url || "");
        setPreviewUrl(data.image_url || null);
      }
    } catch (error: any) {
      console.error(error);
      toast.error("Failed to load article");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setPreviewUrl(URL.createObjectURL(f));
    }
  };

  const handleUpload = async (): Promise<string | null> => {
    if (!file) return imageUrl;
    if (!token) throw new Error("Unauthorized");

    const fd = new FormData();
    fd.append("file", file);

    const res = await fetch("/api/admin/upload", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: fd,
    });

    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Upload failed");
    return json.url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const toastId = toast.loading("Updating article...");

    try {
      const finalImageUrl = await handleUpload();

      const { error } = await supabaseClient
        .from("articles")
        .update({
          title,
          summary,
          content,
          category,
          author,
          image_url: finalImageUrl,
        })
        .eq("id", id);

      if (error) throw error;

      toast.success("Article updated!", { id: toastId });
      router.push("/admin/articles");
    } catch (err: any) {
      toast.error(err.message || "Error", { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/articles"
          className="p-2 hover:bg-slate-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-slate-500" />
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">
          <GradientText colors={["#EC4899", "#8B5CF6"]}>
            Edit Article
          </GradientText>
        </h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Title
                </label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-pink-500/20"
                  required
                  placeholder="Article Title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Summary
                </label>
                <textarea
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg bg-slate-50 h-24 focus:outline-none focus:ring-2 focus:ring-pink-500/20"
                  placeholder="Brief summary..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Category
                  </label>
                  <input
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-pink-500/20"
                    placeholder="Technology, Life, etc."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Author
                  </label>
                  <input
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-pink-500/20"
                    placeholder="Author Name"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Feature Image
                </label>
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center hover:bg-slate-50 transition-colors relative group">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  {previewUrl ? (
                    <div className="relative">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setFile(null);
                          setPreviewUrl(null);
                          setImageUrl("");
                        }}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-md"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="py-8 text-slate-400">
                      <Upload className="w-10 h-10 mx-auto mb-2" />
                      <p className="text-sm">Click or Drag to upload image</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Content (Markdown/HTML)
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg bg-slate-50 font-mono h-64 focus:outline-none focus:ring-2 focus:ring-pink-500/20"
              placeholder="# Heading..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 flex items-center gap-2 shadow-lg shadow-pink-500/20 transition-all font-medium"
            >
              <Save className="w-4 h-4" />
              {saving ? "Updating..." : "Update Article"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
