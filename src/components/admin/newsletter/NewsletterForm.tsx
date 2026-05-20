"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { saveNewsletter } from "@/app/actions/saveNewsletter";
import { cn } from "@/lib/utils";
import Image from "next/image";
import toast from "react-hot-toast";
import {
    Plus,
    Trash2,
    Save,
    ChevronLeft,
    Layout,
    Image as ImageIcon,
    AlignLeft,
    Sparkles,
    Trash,
    Upload,
    List as ListIcon,
    FileText,
    Youtube,
    MousePointer2,
    Link2,
    Loader2
} from "lucide-react";
import Link from "next/link";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export type SectionType = "paragraph" | "list" | "image" | "embed";

export interface NewsletterSection {
    id: string;
    type: SectionType;
    heading: string;
    description: string;
    imageUrl?: string;
    linkUrl?: string;
    embedCode?: string;
    buttons?: { label: string; url: string }[];
}

export type Newsletter = {
    id: string;
    title: string;
    subtitle?: string;
    hero_image_url?: string;
    content: string;
    status: "draft" | "published";
    updated_at: string;
};

interface Props {
    newsletter?: Newsletter;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function NewsletterForm({ newsletter }: Props) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const heroImageRef = useRef<HTMLInputElement>(null);
    const sectionImageRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

    // Parse initial content if editing
    let initialSections: NewsletterSection[] = [{ id: "1", type: "paragraph", heading: "", description: "" }];
    if (newsletter?.content) {
        try {
            const parsed = JSON.parse(newsletter.content);
            if (Array.isArray(parsed)) initialSections = parsed;
        } catch (e) {
            initialSections = [{ id: "1", type: "paragraph", heading: "", description: newsletter.content }];
        }
    }

    const [formData, setFormData] = useState({
        title: newsletter?.title || "",
        subtitle: newsletter?.subtitle || "",
        hero_image_url: newsletter?.hero_image_url || "",
        status: newsletter?.status || "draft",
    });

    const [sections, setSections] = useState<NewsletterSection[]>(initialSections);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const toastId = toast.loading("Saving newsletter...");

        try {
            const submitData = new FormData();
            if (newsletter?.id) submitData.append("id", newsletter.id);
            submitData.append("title", formData.title);
            submitData.append("subtitle", formData.subtitle);
            submitData.append("hero_image_url", formData.hero_image_url);
            submitData.append("content", JSON.stringify(sections));
            submitData.append("status", formData.status);

            const res = await saveNewsletter(null, submitData);
            
            if (res?.success) {
                toast.success("Newsletter saved successfully!", { id: toastId });
                router.push("/admin/newsletter");
                router.refresh();
            } else {
                toast.error(res?.error || "Failed to save newsletter", { id: toastId });
            }
        } catch (error) {
            toast.error("Failed to save newsletter", { id: toastId });
        } finally {
            setLoading(false);
        }
    };

    const addSection = () => {
        setSections([
            ...sections,
            { id: Date.now().toString(), type: "paragraph", heading: "", description: "" }
        ]);
        toast.success("New section added", { position: "bottom-right" });
    };

    const removeSection = (index: number) => {
        if (sections.length <= 1) return;
        const newSections = [...sections];
        newSections.splice(index, 1);
        setSections(newSections);
    };

    const updateSection = (index: number, field: keyof NewsletterSection, value: any) => {
        const newSections = [...sections];
        newSections[index] = { ...newSections[index], [field]: value };
        setSections(newSections);
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: "hero" | { index: number }) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const toastId = toast.loading("Uploading image...");
        try {
            const formDataUpload = new FormData();
            formDataUpload.append("file", file);
            formDataUpload.append("folder", target === "hero" ? "heroes" : "sections");

            const res = await fetch("/api/admin/newsletter/upload-hero", {
                method: "POST",
                body: formDataUpload,
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Upload failed");
            }

            const { url } = await res.json();

            if (target === "hero") {
                setFormData({ ...formData, hero_image_url: url });
            } else {
                updateSection(target.index, "imageUrl", url);
            }
            toast.success("Image uploaded", { id: toastId });
        } catch (err: any) {
            toast.error(err.message || "Upload failed", { id: toastId });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-5xl mx-auto space-y-12 pb-24 h-full">
            {/* 🛠️ Top Sticky Bar */}
            <div className="sticky top-20 z-30 flex items-center justify-between bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm mb-8">
                <Link 
                    href="/admin/newsletter" 
                    className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white px-4 py-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                    <ChevronLeft className="h-4 w-4" />
                    Exit Editor
                </Link>

                <div className="flex items-center gap-3">
                    <div className="hidden md:flex flex-col items-end mr-4">
                        <span className="text-[10px] font-black uppercase tracking-tighter text-slate-400">Status</span>
                        <span className={cn(
                            "text-xs font-bold flex items-center gap-1",
                            formData.status === "published" ? "text-emerald-500" : "text-amber-500"
                        )}>
                            <span className={cn(
                                "h-1.5 w-1.5 rounded-full animate-pulse",
                                formData.status === "published" ? "bg-emerald-500" : "bg-amber-500"
                            )} />
                            {formData.status === "published" ? "Published" : "Drafting Campaign"}
                        </span>
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-700 text-white px-8 h-11 rounded-full shadow-lg transition-all font-black uppercase tracking-widest text-[10px] flex items-center gap-2 disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        {loading ? "Saving..." : "Save Campaign"}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* 📝 Main Writing Area */}
                <div className="lg:col-span-8 space-y-10 pt-10">
                    <div className="space-y-4">
                        <label className="text-[11px] font-black uppercase tracking-[0.2em] text-emerald-600 flex items-center gap-2">
                            <Sparkles className="h-3 w-3" /> Subject & Preview
                        </label>
                        <textarea
                            placeholder="Enter subject line..."
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                            onKeyDown={e => {
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                }
                            }}
                            onPaste={e => {
                                e.preventDefault();
                                const text = e.clipboardData.getData("text/plain").replace(/[\r\n]+/g, " ");
                                setFormData({ ...formData, title: formData.title + text });
                            }}
                            rows={1}
                            className="w-full bg-transparent border-none text-3xl font-black p-0 focus:outline-none focus:ring-0 placeholder:text-slate-200 dark:placeholder:text-slate-700 dark:text-white resize-none h-16 md:h-20 custom-scrollbar-x"
                            required
                        />
                        <textarea
                            placeholder="Write a brief subtitle or preview text..."
                            value={formData.subtitle}
                            onChange={e => setFormData({ ...formData, subtitle: e.target.value })}
                            className="w-full bg-transparent border-none text-xl text-slate-500 p-0 focus:outline-none focus:ring-0 placeholder:text-slate-200 dark:placeholder:text-slate-700 italic min-h-[60px] resize-none"
                        />
                    </div>

                    <div className="space-y-6 pt-10 border-t border-slate-100 dark:border-slate-800">
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-slate-100 flex items-center gap-2">
                                <AlignLeft className="h-4 w-4 text-emerald-600" />
                                Newsletter narrative
                            </h2>
                            <button
                                type="button"
                                onClick={addSection}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white hover:bg-emerald-700 rounded-full text-[10px] font-black uppercase tracking-widest transition-colors shadow-sm"
                            >
                                <Plus className="h-3.5 w-3.5" /> Add Section
                            </button>
                        </div>

                        <div className="space-y-6">
                            {sections.map((section, index) => (
                                <div key={section.id} className="relative group">
                                    {/* Delete Button */}
                                    <button
                                        type="button"
                                        className="absolute -right-3 -top-3 h-8 w-8 rounded-full shadow-lg bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all flex items-center justify-center z-10 opacity-0 group-hover:opacity-100"
                                        onClick={() => removeSection(index)}
                                    >
                                        <Trash2 className="h-3.5 w-3.5" />
                                    </button>

                                    <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                                        {/* Type Selector */}
                                        <div className="bg-slate-50/50 dark:bg-slate-800/50 p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                            <div className="flex gap-1 p-1 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
                                                {(['paragraph', 'list', 'image', 'embed'] as SectionType[]).map((type) => (
                                                    <button
                                                        key={type}
                                                        type="button"
                                                        onClick={() => updateSection(index, 'type', type)}
                                                        className={cn(
                                                            "flex items-center gap-2 px-4 py-1.5 rounded-md text-[10px] font-black uppercase tracking-tight transition-all",
                                                            section.type === type 
                                                                ? "bg-slate-900 dark:bg-emerald-600 text-white shadow-md" 
                                                                : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800"
                                                        )}
                                                    >
                                                        {type === 'paragraph' && <FileText className="h-3 w-3" />}
                                                        {type === 'list' && <ListIcon className="h-3 w-3" />}
                                                        {type === 'image' && <ImageIcon className="h-3 w-3" />}
                                                        {type === 'embed' && <Youtube className="h-3 w-3" />}
                                                        {type}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="p-8 space-y-6">
                                            <input
                                                placeholder="Section Subheading..."
                                                value={section.heading}
                                                onChange={e => updateSection(index, "heading", e.target.value)}
                                                className="w-full text-2xl font-bold bg-transparent outline-none placeholder:text-slate-200 dark:placeholder:text-slate-800 border-none p-0 dark:text-white"
                                            />

                                            {section.type === 'embed' && (
                                                <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800 shadow-inner">
                                                    <div className="flex items-center gap-3 mb-4">
                                                        <Youtube className="h-5 w-5 text-red-500" />
                                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">YouTube Embed Code</p>
                                                    </div>
                                                    <textarea
                                                        placeholder='<iframe ...'
                                                        value={section.embedCode || ""}
                                                        onChange={e => updateSection(index, "embedCode", e.target.value)}
                                                        className="w-full bg-black/50 border border-slate-800 text-slate-300 font-mono text-xs min-h-[100px] rounded-xl p-4 focus:outline-none focus:border-red-500/50"
                                                    />
                                                </div>
                                            )}

                                            {section.type === 'image' && (
                                                <div className="space-y-4">
                                                    <div className="relative aspect-video rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 border-dashed border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden">
                                                        {section.imageUrl ? (
                                                            <>
                                                                <Image src={section.imageUrl} alt="Section Visual" fill className="object-cover" />
                                                                <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => sectionImageRefs.current[section.id]?.click()}
                                                                        className="bg-white text-slate-900 px-4 py-2 rounded-full text-xs font-bold"
                                                                    >
                                                                        Change Image
                                                                    </button>
                                                                </div>
                                                            </>
                                                        ) : (
                                                            <div className="text-center">
                                                                <ImageIcon className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => sectionImageRefs.current[section.id]?.click()}
                                                                    className="bg-white border border-slate-200 text-slate-600 px-6 py-2 rounded-full text-xs font-bold hover:bg-slate-50 transition-colors"
                                                                >
                                                                    Upload Visual
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <input
                                                        type="file"
                                                        className="hidden"
                                                        ref={el => { sectionImageRefs.current[section.id] = el; }}
                                                        accept="image/*"
                                                        onChange={e => handleFileUpload(e, { index })}
                                                    />
                                                </div>
                                            )}

                                            <div className="space-y-6">
                                                <textarea
                                                    placeholder={section.type === 'list' ? "Add bullet points (one per line)..." : "Share your insights here..."}
                                                    value={section.description}
                                                    onChange={e => updateSection(index, "description", e.target.value)}
                                                    className="w-full border-none bg-slate-50/50 dark:bg-slate-800/50 rounded-2xl p-6 text-slate-600 dark:text-slate-300 leading-relaxed focus:outline-none min-h-[150px] resize-none"
                                                />

                                                {/* Buttons UI */}
                                                <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                                                    <div className="flex items-center justify-between">
                                                        <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                                            <MousePointer2 className="h-3 w-3 text-emerald-600" /> Interactive CTAs
                                                        </label>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                const newButtons = [...(section.buttons || []), { label: "", url: "" }];
                                                                updateSection(index, "buttons", newButtons);
                                                            }}
                                                            className="text-xs bg-emerald-600 font-black uppercase tracking-tighter text-white px-4 py-1 rounded"
                                                        >
                                                            + Add Button
                                                        </button>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        {section.buttons?.map((btn, btnIdx) => (
                                                            <div key={btnIdx} className="p-4 bg-slate-50/50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-3 relative group/btn">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        const newButtons = [...(section.buttons || [])];
                                                                        newButtons.splice(btnIdx, 1);
                                                                        updateSection(index, "buttons", newButtons);
                                                                    }}
                                                                    className="absolute -right-2 -top-2 h-6 w-6 rounded-full bg-red-100 text-red-500 opacity-0 group-hover/btn:opacity-100 transition-all flex items-center justify-center hover:bg-red-500 hover:text-white"
                                                                >
                                                                    <Trash className="h-3 w-3" />
                                                                </button>
                                                                <input
                                                                    placeholder="Label..."
                                                                    value={btn.label}
                                                                    onChange={e => {
                                                                        const newButtons = [...(section.buttons || [])];
                                                                        newButtons[btnIdx].label = e.target.value;
                                                                        updateSection(index, "buttons", newButtons);
                                                                    }}
                                                                    className="w-full h-8 text-xs bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-lg px-3 focus:outline-none"
                                                                />
                                                                <div className="relative">
                                                                    <Link2 className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400" />
                                                                    <input
                                                                        placeholder="URL..."
                                                                        value={btn.url}
                                                                        onChange={e => {
                                                                            const newButtons = [...(section.buttons || [])];
                                                                            newButtons[btnIdx].url = e.target.value;
                                                                            updateSection(index, "buttons", newButtons);
                                                                        }}
                                                                        className="w-full h-8 text-xs bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-lg pl-8 pr-3 focus:outline-none"
                                                                    />
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button
                            type="button"
                            onClick={addSection}
                            className="w-full h-24 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[2.5rem] hover:border-emerald-600 hover:bg-emerald-600/5 transition-all flex flex-col items-center justify-center gap-2 group"
                        >
                            <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors shadow-sm">
                                <Plus className="h-5 w-5" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-emerald-600">Append Narrative Section</span>
                        </button>
                    </div>
                </div>

                {/* ⚙️ Sidebar Configuration */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none sticky top-40 overflow-hidden">
                        <div className="bg-slate-50/50 dark:bg-slate-800/50 p-6 border-b border-slate-100 dark:border-slate-800">
                            <h3 className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2 text-slate-900 dark:text-white">
                                <Layout className="h-4 w-4 text-emerald-600" />
                                Campaign Details
                            </h3>
                        </div>
                        <div className="p-8 space-y-8">
                            <div className="space-y-4">
                                <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Hero Visual</label>
                                <div 
                                    className="relative aspect-video rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 flex items-center justify-center group/hero cursor-pointer"
                                    onClick={() => heroImageRef.current?.click()}
                                >
                                    {formData.hero_image_url ? (
                                        <>
                                            <Image src={formData.hero_image_url} alt="Hero" fill className="object-cover" />
                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/hero:opacity-100 transition-opacity flex items-center justify-center">
                                                <span className="bg-white text-slate-900 px-4 py-2 rounded-full text-xs font-bold shadow-xl">Replace Hero</span>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="text-center text-slate-400">
                                            <Upload className="h-6 w-6 mx-auto mb-2" />
                                            <span className="text-[8px] font-black uppercase tracking-widest">Upload Campaign Hero</span>
                                        </div>
                                    )}
                                </div>
                                <input
                                    type="file"
                                    className="hidden"
                                    ref={heroImageRef}
                                    accept="image/*"
                                    onChange={e => handleFileUpload(e, "hero")}
                                />
                            </div>

                            <div className="space-y-4">
                                <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Campaign Status</label>
                                <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
                                    {(['draft', 'published'] as const).map((s) => (
                                        <button
                                            key={s}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, status: s })}
                                            className={cn(
                                                "py-2 rounded-xl text-[10px] font-black uppercase tracking-tight transition-all",
                                                formData.status === s 
                                                    ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm" 
                                                    : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                                            )}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
                                <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl border border-emerald-100 dark:border-emerald-800/50">
                                    <p className="text-[10px] leading-relaxed text-emerald-800 dark:text-emerald-400 font-medium">
                                        Published newsletters are automatically sent to all active subscribers.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}
