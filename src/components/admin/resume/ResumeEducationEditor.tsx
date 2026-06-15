"use client";

import React, { useState, useEffect } from "react";
import { getEducation, saveEducation, deleteEducation, ResumeEducation } from "@/app/actions/resume";
import { FileText, Plus, Trash2, Edit2, Check, X, Upload } from "lucide-react";
import toast from "react-hot-toast";
import { supabaseClient } from "@/lib/supabaseClient";

export default function ResumeEducationEditor() {
  const [educations, setEducations] = useState<ResumeEducation[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<ResumeEducation>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEducations();
  }, []);

  const fetchEducations = async () => {
    setLoading(true);
    const data = await getEducation();
    setEducations(data);
    setLoading(false);
  };

  const handleEdit = (edu: ResumeEducation) => {
    setEditingId(edu.id);
    setEditForm({ ...edu });
  };

  const handleAddNew = () => {
    const newId = `new-${Date.now()}`;
    setEditingId(newId);
    setEditForm({
      id: newId,
      degree: "",
      institution: "",
      years: "",
      description: "",
      logo: "/images/logos/uaf.png",
      highlight: false,
      display_order: educations.length,
    });
  };

  const handleSave = async () => {
    if (!editForm.degree || !editForm.institution) {
      toast.error("Degree and Institution are required");
      return;
    }

    const loadingToast = toast.loading("Saving education...");
    const res = await saveEducation(editForm as ResumeEducation);
    
    if (res.success) {
      toast.success("Saved successfully!", { id: loadingToast });
      setEditingId(null);
      fetchEducations();
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
    const res = await deleteEducation(id);
    
    if (res.success) {
      toast.success("Deleted!", { id: loadingToast });
      fetchEducations();
    } else {
      toast.error(res.error || "Failed to delete", { id: loadingToast });
    }
  };

  if (loading) return <div className="text-center py-4">Loading education...</div>;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
            <FileText className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Education</h2>
        </div>
        {!editingId && (
          <button 
            onClick={handleAddNew}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
          >
            <Plus className="w-4 h-4" /> Add Education
          </button>
        )}
      </div>

      <div className="space-y-4">
        {educations.map((edu) => (
          <div key={edu.id} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
            {editingId === edu.id ? (
              <EducationForm 
                form={editForm} 
                setForm={setEditForm} 
                onSave={handleSave} 
                onCancel={() => setEditingId(null)} 
              />
            ) : (
              <div className="flex justify-between items-start">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-lg overflow-hidden flex items-center justify-center p-1 border border-slate-200 dark:border-slate-700 shrink-0">
                     <img src={edu.logo || "/images/logos/uaf.png"} alt="logo" className="max-w-full max-h-full object-contain" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg dark:text-white">{edu.degree}</h3>
                    <p className="text-emerald-600 dark:text-emerald-400 font-medium">{edu.institution} • {edu.years}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">{edu.description}</p>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => handleEdit(edu)} className="p-2 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(edu.id)} className="p-2 text-slate-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            )}
          </div>
        ))}

        {editingId?.startsWith("new-") && (
          <div className="border border-emerald-500 rounded-lg p-4 bg-emerald-50 dark:bg-emerald-900/10">
            <h3 className="font-bold mb-4 dark:text-white">New Education</h3>
            <EducationForm 
              form={editForm} 
              setForm={setEditForm} 
              onSave={handleSave} 
              onCancel={() => setEditingId(null)} 
            />
          </div>
        )}

        {educations.length === 0 && !editingId && (
           <div className="text-center py-8 text-slate-500 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-dashed border-slate-200 dark:border-slate-700">
              No education records found. Click 'Add Education' to start.
           </div>
        )}
      </div>
    </div>
  );
}

function EducationForm({ form, setForm, onSave, onCancel }: { form: any, setForm: any, onSave: () => void, onCancel: () => void }) {
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const { data } = await supabaseClient.auth.getSession();
      if (!data.session?.access_token) throw new Error("Unauthorized");

      const fd = new FormData();
      fd.append("file", file);
      fd.append("publicAsset", "true");

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${data.session.access_token}` },
        body: fd,
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Upload failed");

      setForm({ ...form, logo: json.url });
      toast.success("Logo uploaded successfully");
    } catch (err: any) {
      toast.error(err.message || "File upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1 dark:text-slate-300">Degree</label>
          <input 
            type="text" 
            className="w-full px-3 py-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700 dark:text-white" 
            value={form.degree || ""} 
            onChange={(e) => setForm({...form, degree: e.target.value})} 
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 dark:text-slate-300">Institution</label>
          <input 
            type="text" 
            className="w-full px-3 py-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700 dark:text-white" 
            value={form.institution || ""} 
            onChange={(e) => setForm({...form, institution: e.target.value})} 
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1 dark:text-slate-300">Years (e.g. 2018 - 2023)</label>
          <input 
            type="text" 
            className="w-full px-3 py-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700 dark:text-white" 
            value={form.years || ""} 
            onChange={(e) => setForm({...form, years: e.target.value})} 
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 dark:text-slate-300">Logo Image Path</label>
          <div className="flex gap-2">
            <input 
              type="text" 
              className="flex-1 px-3 py-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700 dark:text-white" 
              value={form.logo || ""} 
              onChange={(e) => setForm({...form, logo: e.target.value})} 
            />
            <label className="flex items-center justify-center px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg cursor-pointer transition-colors shrink-0">
              {uploading ? <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div> : <Upload className="w-4 h-4 text-slate-600 dark:text-slate-400" />}
              <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} disabled={uploading} />
            </label>
          </div>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1 dark:text-slate-300">Description</label>
        <textarea 
          className="w-full px-3 py-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700 dark:text-white" 
          rows={3}
          value={form.description || ""} 
          onChange={(e) => setForm({...form, description: e.target.value})} 
        />
      </div>
      <div className="flex items-center gap-2">
        <input 
          type="checkbox" 
          id="highlight" 
          checked={form.highlight || false} 
          onChange={(e) => setForm({...form, highlight: e.target.checked})} 
        />
        <label htmlFor="highlight" className="text-sm font-medium dark:text-slate-300">Highlight this item (Gold/Emerald card style)</label>
      </div>
      
      <div className="flex justify-end gap-3 mt-4">
        <button onClick={onCancel} className="flex items-center gap-2 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition dark:text-white">
          <X className="w-4 h-4" /> Cancel
        </button>
        <button onClick={onSave} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition">
          <Check className="w-4 h-4" /> Save
        </button>
      </div>
    </div>
  );
}
