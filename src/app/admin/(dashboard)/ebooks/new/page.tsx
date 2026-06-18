"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabaseClient } from "@/lib/supabaseClient";
import GradientText from "@/components/ui/GradientText";
import { ArrowLeft, Save, Upload, X, Book, FileText, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";

export default function NewEbook() {
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("Dr. Muhammad Kamran");
    const [description, setDescription] = useState("");
    const [fileUrl, setFileUrl] = useState("");
    const [pageCount, setPageCount] = useState("0");
    const [price, setPrice] = useState("9.99");
    const [discountPrice, setDiscountPrice] = useState("");
    const [discountExpiresAt, setDiscountExpiresAt] = useState("");

    const [isDownloadable, setIsDownloadable] = useState(false);

    // Cover image states
    const [coverFile, setCoverFile] = useState<File | null>(null);
    const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(null);

    // PDF file states
    const [pdfFile, setPdfFile] = useState<File | null>(null);
    const [pdfFileName, setPdfFileName] = useState<string | null>(null);

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

    const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (f) {
            setCoverFile(f);
            setCoverPreviewUrl(URL.createObjectURL(f));
        }
    };

    const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (f) {
            if (f.type !== "application/pdf" && !f.name.toLowerCase().endsWith(".pdf")) {
                toast.error("Please upload a valid PDF document!");
                return;
            }
            setPdfFile(f);
            setPdfFileName(f.name);
            // If title is empty, prefill it with the clean file name
            if (!title) {
                const cleanName = f.name.replace(/\.pdf$/i, "").replace(/[_-]/g, " ");
                setTitle(cleanName);
            }
        }
    };

    const uploadSingleFile = async (targetFile: File): Promise<{ url: string; path?: string; isPrivate?: boolean }> => {
        if (!token) throw new Error("Unauthorized");

        const fd = new FormData();
        fd.append("file", targetFile);

        const res = await fetch("/api/admin/upload", {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: fd,
        });

        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Upload failed");
        return json;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!pdfFile && !fileUrl) {
            toast.error("Please either upload a PDF file or enter a manual PDF/File URL.");
            return;
        }

        setLoading(true);
        const toastId = toast.loading("Adding ebook...");

        try {
            // 1. Upload Cover Image if selected
            let finalCoverUrl = null;
            if (coverFile) {
                const coverRes = await uploadSingleFile(coverFile);
                finalCoverUrl = coverRes.url;
            }

            // 2. Upload PDF File if selected
            let finalFileUrl = fileUrl;
            let finalPdfStoragePath = null;
            if (pdfFile) {
                toast.loading("Uploading PDF book file...", { id: toastId });
                const pdfRes = await uploadSingleFile(pdfFile);
                finalPdfStoragePath = pdfRes.path || null;
                finalFileUrl = ""; // clear public download file url
            }

            // 3. Save to Supabase
            const { error } = await supabaseClient.from("ebooks").insert({
                title,
                author,
                description,
                file_url: finalFileUrl || null,
                pdf_storage_path: finalPdfStoragePath,
                cover_url: finalCoverUrl,
                price: price ? parseFloat(price) : 0, // 0 means Free!
                discount_price: discountPrice ? parseFloat(discountPrice) : null,
                discount_expires_at: discountExpiresAt ? new Date(discountExpiresAt).toISOString() : null,
                is_published: true,
                is_downloadable: isDownloadable,
                page_count: pageCount ? parseInt(pageCount, 10) : 0
            });

            if (error) throw error;

            toast.success("Ebook added successfully!", { id: toastId });
            router.push("/admin/ebooks");
        } catch (err: any) {
            toast.error(err.message || "Error creating ebook", { id: toastId });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/ebooks" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                    <ArrowLeft className="w-5 h-5 text-slate-500" />
                </Link>
                <h1 className="text-2xl font-bold text-slate-900">
                    <GradientText colors={["#F59E0B", "#EF4444"]}>Add New Ebook</GradientText>
                </h1>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-8">

                        {/* Left Form Column */}
                        <div className="space-y-6">

                            {/* 📁 PDF EBOOK UPLOAD ZONE */}
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-slate-700">1. Upload Ebook PDF File</label>
                                <div className="border-2 border-dashed border-blue-200 bg-blue-50/5 hover:bg-blue-50/20 rounded-xl p-6 text-center transition-colors relative group">
                                    <input
                                        type="file"
                                        accept="application/pdf"
                                        onChange={handlePdfChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    />
                                    {pdfFileName ? (
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-full">
                                                <CheckCircle2 className="w-6 h-6 animate-bounce" />
                                            </div>
                                            <p className="text-sm font-bold text-slate-800 line-clamp-1 px-4">{pdfFileName}</p>
                                            <p className="text-xs text-slate-400">PDF successfully selected. Click again to replace.</p>
                                        </div>
                                    ) : (
                                        <div className="py-4 text-slate-400">
                                            <FileText className="w-10 h-10 mx-auto mb-2 text-blue-400 group-hover:scale-110 transition-transform" />
                                            <p className="text-sm font-bold text-slate-700">Drag or Click to upload PDF file</p>
                                            <p className="text-xs text-slate-400 mt-1">Accepts document files up to 50MB</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Or: Manually Paste PDF/File URL</label>
                                <input
                                    value={fileUrl}
                                    onChange={e => setFileUrl(e.target.value)}
                                    disabled={!!pdfFile}
                                    className="w-full px-4 py-2 border rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 disabled:opacity-40"
                                    placeholder={pdfFile ? "PDF Upload selected above" : "https://example.com/book.pdf"}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Title</label>
                                <input value={title} onChange={e => setTitle(e.target.value)} className="w-full px-4 py-2 border rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 font-semibold" required placeholder="Ebook Title" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Author</label>
                                <input value={author} onChange={e => setAuthor(e.target.value)} className="w-full px-4 py-2 border rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 font-semibold" required placeholder="Dr. Muhammad Kamran" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Page Count</label>
                                <input type="number" min="0" value={pageCount} onChange={e => setPageCount(e.target.value)} className="w-full px-4 py-2 border rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 font-semibold" required placeholder="0" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                                <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full px-4 py-2 border rounded-lg bg-slate-50 h-24 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 resize-none" placeholder="Provide a brief technical overview of the e-book..." />
                            </div>
                        </div>

                        {/* Right Form Column */}
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">2. Cover Image</label>
                                <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center hover:bg-slate-50 transition-colors relative group">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleCoverChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    {coverPreviewUrl ? (
                                        <div className="relative">
                                            <img src={coverPreviewUrl} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setCoverFile(null);
                                                    setCoverPreviewUrl(null);
                                                }}
                                                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-md z-20 cursor-pointer"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="py-12 text-slate-400">
                                            <Upload className="w-10 h-10 mx-auto mb-2 text-slate-300 group-hover:scale-110 transition-transform" />
                                            <p className="text-sm font-bold text-slate-500">Upload high-res cover artwork</p>
                                            <p className="text-[10px] text-slate-400 mt-1">Supports PNG, JPG, WEBP</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Price ($ USD)</label>
                                <input type="number" step="0.01" min="0.00" value={price} onChange={e => setPrice(e.target.value)} className="w-full px-4 py-2 border rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 font-bold text-slate-800" required placeholder="9.99" />
                                <p className="text-[11px] text-slate-400 mt-1">Set to 0.00 to offer this e-book for free direct download.</p>
                            </div>

                            <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200/60">
                                <input
                                    type="checkbox"
                                    id="isDownloadable"
                                    checked={isDownloadable}
                                    onChange={e => setIsDownloadable(e.target.checked)}
                                    className="w-4 h-4 text-emerald-500 border-slate-300 rounded focus:ring-emerald-500 cursor-pointer"
                                />
                                <div>
                                    <label htmlFor="isDownloadable" className="text-sm font-semibold text-slate-800 cursor-pointer select-none">Allow Direct Download</label>
                                    <p className="text-[10px] text-slate-400">If checked, customers can download this ebook as a PDF file. If unchecked, they can only read it in the library reader.</p>
                                </div>
                            </div>


                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Discount Price ($ USD) (Optional)</label>
                                <input type="number" step="0.01" min="0.01" value={discountPrice} onChange={e => setDiscountPrice(e.target.value)} className="w-full px-4 py-2 border rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20" placeholder="e.g. 4.99" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Discount Expiry Date & Time</label>
                                <input type="datetime-local" value={discountExpiresAt} onChange={e => setDiscountExpiresAt(e.target.value)} className="w-full px-4 py-2 border rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20" />
                                <p className="text-[11px] text-slate-400 mt-1">Select the exact date and time when this discount should automatically expire.</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                        <button type="submit" disabled={loading} className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all font-extrabold text-xs cursor-pointer">
                            <Save className="w-4 h-4" />
                            {loading ? "Adding eBook..." : "Save Ebook"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
