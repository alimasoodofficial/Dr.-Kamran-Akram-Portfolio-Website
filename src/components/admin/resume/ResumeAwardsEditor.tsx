"use client";

import React, { useState, useEffect } from "react";
import { getAwards, saveAwards, deleteAwards, ResumeAwards } from "@/app/actions/resume";
import { Award, Plus, Trash2, Edit2, Check, X, Upload } from "lucide-react";
import toast from "react-hot-toast";
import { supabaseClient } from "@/lib/supabaseClient";

export default function ResumeAwardsEditor() {
  const [awards, setAwards] = useState<ResumeAwards[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<ResumeAwards>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAwards();
  }, []);

  const fetchAwards = async () => {
    setLoading(true);
    const data = await getAwards();
    setAwards(data);
    setLoading(false);
  };

  const handleEdit = (award: ResumeAwards) => {
    setEditingId(award.id);
    setEditForm({ ...award });
  };

  const handleAddNew = () => {
    const newId = `new-${Date.now()}`;
    setEditingId(newId);
    setEditForm({
      id: newId,
      title: "",
      description: "",
      image: "/images/logos/uaf.png",
      link: "#",
      display_order: awards.length,
    });
  };

  const handleSave = async () => {
    if (!editForm.title) {
      toast.error("Title is required");
      return;
    }

    const loadingToast = toast.loading("Saving award...");
    const res = await saveAwards(editForm as ResumeAwards);
    
    if (res.success) {
      toast.success("Saved successfully!", { id: loadingToast });
      setEditingId(null);
      fetchAwards();
    } else {
      toast.error(res.error || "Failed to save", { id: loadingToast });
    }
  };

  const handleDelete = async (id: string) => {
    if (id.startsWith("new-")) {
      setEditingId(null);
      return;
    }

    if (!confirm("Are you sure you want to delete this?")) return;

    const loadingToast = toast.loading("Deleting...");
    const res = await deleteAwards(id);
    
    if (res.success) {
      toast.success("Deleted!", { id: loadingToast });
      fetchAwards();
    } else {
      toast.error(res.error || "Failed to delete", { id: loadingToast });
    }
  };

  if (loading) return <div className="text-center py-4">Loading awards...</div>;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
            <Award className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Awards & Certifications</h2>
        </div>
        {!editingId && (
          <button 
            onClick={handleAddNew}
            className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition"
          >
            <Plus className="w-4 h-4" /> Add Award
          </button>
        )}
      </div>

      <div className="space-y-4">
        {awards.map((award) => (
          <div key={award.id} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
            {editingId === award.id ? (
              <AwardForm 
                form={editForm} 
                setForm={setEditForm} 
                onSave={handleSave} 
                onCancel={() => setEditingId(null)} 
              />
            ) : (
              <div className="flex justify-between items-start">
                <div className="flex gap-4">
                  <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden flex items-center justify-center p-2 border border-slate-200 dark:border-slate-700 shrink-0">
                     <img src={award.image || "/images/logos/uaf.png"} alt="logo" className="max-w-full max-h-full object-contain" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg dark:text-white">{award.title}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 line-clamp-2" dangerouslySetInnerHTML={{ __html: award.description || '' }} />
                    {award.link && award.link !== "#" && (
                        <a href={award.link} target="_blank" rel="noopener noreferrer" className="text-xs text-amber-600 mt-1 inline-block">Link attached</a>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => handleEdit(award)} className="p-2 text-slate-400 hover:text-amber-600 dark:hover:text-amber-400"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(award.id)} className="p-2 text-slate-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            )}
          </div>
        ))}

        {editingId?.startsWith("new-") && (
          <div className="border border-amber-500 rounded-lg p-4 bg-amber-50 dark:bg-amber-900/10">
            <h3 className="font-bold mb-4 dark:text-white">New Award</h3>
            <AwardForm 
              form={editForm} 
              setForm={setEditForm} 
              onSave={handleSave} 
              onCancel={() => setEditingId(null)} 
            />
          </div>
        )}

        {awards.length === 0 && !editingId && (
           <div className="text-center py-8 text-slate-500 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-dashed border-slate-200 dark:border-slate-700">
              No awards records found. Click 'Add Award' to start.
           </div>
        )}
      </div>
    </div>
  );
}

function AwardForm({ form, setForm, onSave, onCancel }: { form: any, setForm: any, onSave: () => void, onCancel: () => void }) {
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'link') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === 'image') setUploadingImage(true);
    else setUploadingPdf(true);

    try {
      const { data } = await supabaseClient.auth.getSession();
      if (!data.session?.access_token) throw new Error("Unauthorized");

      const fd = new FormData();
      fd.append("file", file);
      fd.append("publicAsset", "true"); // Upload PDFs to public media bucket

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${data.session.access_token}` },
        body: fd,
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Upload failed");

      setForm({ ...form, [type]: json.url });
      toast.success("File uploaded successfully");
    } catch (err: any) {
      toast.error(err.message || "File upload failed");
    } finally {
      if (type === 'image') setUploadingImage(false);
      else setUploadingPdf(false);
    }
  };

  return (
    <div className="grid gap-4">
      <div>
        <label className="block text-sm font-medium mb-1 dark:text-slate-300">Title</label>
        <input 
          type="text" 
          className="w-full px-3 py-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700 dark:text-white" 
          value={form.title || ""} 
          onChange={(e) => setForm({...form, title: e.target.value})} 
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1 dark:text-slate-300">Image Path</label>
          <div className="flex gap-2">
            <input 
              type="text" 
              className="flex-1 px-3 py-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700 dark:text-white" 
              value={form.image || ""} 
              onChange={(e) => setForm({...form, image: e.target.value})} 
            />
            <label className="flex items-center justify-center px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg cursor-pointer transition-colors shrink-0">
              {uploadingImage ? <div className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div> : <Upload className="w-4 h-4 text-slate-600 dark:text-slate-400" />}
              <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'image')} disabled={uploadingImage} />
            </label>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 dark:text-slate-300">Certificate Link (PDF/URL)</label>
          <div className="flex gap-2">
            <input 
              type="text" 
              className="flex-1 px-3 py-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700 dark:text-white" 
              value={form.link || ""} 
              onChange={(e) => setForm({...form, link: e.target.value})} 
            />
            <label className="flex items-center justify-center px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg cursor-pointer transition-colors shrink-0">
              {uploadingPdf ? <div className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div> : <Upload className="w-4 h-4 text-slate-600 dark:text-slate-400" />}
              <input type="file" className="hidden" accept="application/pdf,image/*" onChange={(e) => handleFileUpload(e, 'link')} disabled={uploadingPdf} />
            </label>
          </div>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1 dark:text-slate-300">Description (HTML allowed)</label>
        <textarea 
          className="w-full px-3 py-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700 dark:text-white font-mono text-sm" 
          rows={4}
          value={form.description || ""} 
          onChange={(e) => setForm({...form, description: e.target.value})} 
        />
      </div>
      
      <div className="flex justify-end gap-3 mt-4">
        <button onClick={onCancel} className="flex items-center gap-2 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition dark:text-white">
          <X className="w-4 h-4" /> Cancel
        </button>
        <button onClick={onSave} className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition">
          <Check className="w-4 h-4" /> Save
        </button>
      </div>
    </div>
  );
}
