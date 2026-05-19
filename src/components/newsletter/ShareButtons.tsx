"use client";

import { Link2, Twitter, Linkedin } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

interface Props {
    title: string;
}

export default function ShareButtons({ title }: Props) {
    const copyToClipboard = () => {
        navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard!");
    };

    const shareUrl = typeof window !== "undefined" ? window.location.href : "";

    return (
        <div className="flex items-center gap-4">
            <button 
                className="p-3 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-400 hover:bg-emerald-500 hover:text-white transition-all shadow-sm"
                title="Copy Link"
                onClick={copyToClipboard}
            >
                <Link2 className="w-4 h-4" />
            </button>
            <Link 
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                className="p-3 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-400 hover:bg-[#1DA1F2] hover:text-white transition-all shadow-sm"
            >
                <Twitter className="w-4 h-4" />
            </Link>
            <Link 
                href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(title)}`}
                target="_blank"
                className="p-3 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-400 hover:bg-[#0A66C2] hover:text-white transition-all shadow-sm"
            >
                <Linkedin className="w-4 h-4" />
            </Link>
        </div>
    );
}
