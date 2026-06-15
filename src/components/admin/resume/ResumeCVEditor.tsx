"use client";

import React, { useState, useEffect } from "react";
import { saveCVUrl, getCVUrl } from "@/app/actions/resume";
import { Upload } from "lucide-react";
import { supabaseClient } from "@/lib/supabaseClient";

export default function ResumeCVEditor() {
  const [cvUrl, setCvUrl] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    async function loadCVUrl() {
      const url = await getCVUrl();
      if (url) {
        setCvUrl(url);
      }
    }
    loadCVUrl();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setMessage({ text: "", type: "" });
    try {
      const { data } = await supabaseClient.auth.getSession();
      if (!data.session?.access_token) throw new Error("Unauthorized");

      const fd = new FormData();
      fd.append("file", file);
      fd.append("publicAsset", "true"); // Save as public asset so the URL is public

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${data.session.access_token}` },
        body: fd,
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Upload failed");

      setCvUrl(json.url);
      setMessage({ text: "CV uploaded successfully. Remember to save!", type: "success" });
    } catch (err: any) {
      setMessage({ text: err.message || "File upload failed", type: "error" });
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage({ text: "", type: "" });
    try {
      const res = await saveCVUrl(cvUrl);
      if (res.success) {
        setMessage({ text: "CV URL saved successfully!", type: "success" });
      } else {
        setMessage({ text: res.error || "Failed to save CV URL.", type: "error" });
      }
    } catch (err: any) {
      setMessage({ text: err.message, type: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">CV Download Link</h2>
      <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
        Upload a PDF to allow users to download your CV, or leave empty to just use the browser's print functionality.
      </p>

      <div className="space-y-4 max-w-2xl">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            CV File URL
          </label>
          <div className="flex gap-4 items-start">
            <div className="flex-1">
              <input
                type="text"
                value={cvUrl}
                onChange={(e) => setCvUrl(e.target.value)}
                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-900 dark:text-white"
                placeholder="https://..."
              />
            </div>
            <label className="flex items-center justify-center px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer transition-colors shrink-0">
              {uploading ? (
                <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mr-2"></div>
              ) : (
                <Upload className="w-5 h-5 text-slate-600 dark:text-slate-400 mr-2" />
              )}
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Upload PDF</span>
              <input type="file" className="hidden" accept="application/pdf" onChange={handleFileUpload} disabled={uploading} />
            </label>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={handleSave}
            disabled={isSaving || uploading}
            className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-xl transition-colors disabled:opacity-50"
          >
            {isSaving ? "Saving..." : "Save CV URL"}
          </button>
          {message.text && (
            <span className={`text-sm ${message.type === 'success' ? 'text-emerald-500' : 'text-red-500'}`}>
              {message.text}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
