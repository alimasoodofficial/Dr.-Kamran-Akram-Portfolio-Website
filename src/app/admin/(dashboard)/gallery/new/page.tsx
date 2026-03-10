"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseClient } from "@/lib/supabaseClient";
import GradientText from "@/components/ui/GradientText";
import { ArrowLeft, Save, Upload, X } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";

export default function NewGalleryItem() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [tags, setTags] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data } = await supabaseClient.auth.getSession();
    if (!data.session?.access_token) {
        toast.error("Unauthorized");
        router.push("/admin/login");
    } else {
        setToken(data.session.access_token);
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
    if (!file) return null;
    if (!token) throw new Error("Unauthorized");
    
    // We use the existing upload API
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
    if (!title) {
        toast.error("Title is required");
        return;
    }

    setLoading(true);
    const toastId = toast.loading("Saving item...");

    try {
      let image_url = null;
      if (file) {
          image_url = await handleUpload();
      }

      const finalDate = date ? new Date(date).toISOString() : new Date().toISOString();
      const parsedTags = tags.split(",").map((t) => t.trim()).filter(Boolean);

      const body = {
        title,
        description,
        category,
        image_url,
        date: finalDate,
        location,
        tags: parsedTags,
      };

      const res = await fetch("/api/admin/gallery", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("Failed to save to database");
      
      toast.success("Gallery item created!", { id: toastId });
      router.push("/admin/gallery");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Error saving item", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
       <div className="flex items-center gap-4">
           <Link href="/admin/gallery" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
               <ArrowLeft className="w-5 h-5 text-slate-500" />
           </Link>
           <h1 className="text-2xl font-bold text-slate-900">
               <GradientText colors={["#2563EB", "#7C3AED"]}>Add New Gallery Item</GradientText>
           </h1>
       </div>

       <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
           <form onSubmit={handleSubmit} className="p-8 space-y-6">
               <div className="grid md:grid-cols-2 gap-8">
                   <div className="space-y-6">
                       <div>
                           <label className="block text-sm font-medium text-slate-700 mb-2">Title</label>
                           <input
                               value={title}
                               onChange={(e) => setTitle(e.target.value)}
                               className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                               placeholder="e.g. Conference 2024"
                           />
                       </div>
                       
                       <div>
                           <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                           <textarea
                               value={description}
                               onChange={(e) => setDescription(e.target.value)}
                               className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 min-h-[120px]"
                               placeholder="Describe the item..."
                           />
                       </div>

                       <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
                                <input
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                    placeholder="e.g. Event"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Location</label>
                                <input
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                    placeholder="e.g. Dubai"
                                />
                            </div>
                       </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Tags</label>
                            <input
                                value={tags}
                                onChange={(e) => setTags(e.target.value)}
                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                placeholder="comma, separated, tags"
                            />
                        </div>
                   </div>

                   <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Date</label>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Image</label>
                            <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center hover:bg-slate-50 transition-colors relative group">
                                <input 
                                    type="file" 
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                {previewUrl ? (
                                    <div className="relative">
                                        <img src={previewUrl} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
                                        <button 
                                            type="button"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setFile(null);
                                                setPreviewUrl(null);
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

               <div className="pt-6 border-t border-slate-100 flex justify-end gap-3">
                   <Link 
                        href="/admin/gallery"
                        className="px-6 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium transition-colors"
                   >
                       Cancel
                   </Link>
                   <button
                       type="submit"
                       disabled={loading}
                       className="flex items-center gap-2 px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-medium transition-colors disabled:opacity-50 shadow-lg shadow-blue-500/20"
                   >
                       <Save className="w-4 h-4" />
                       {loading ? "Saving..." : "Save Gallery Item"}
                   </button>
               </div>
           </form>
       </div>
    </div>
  );
}
