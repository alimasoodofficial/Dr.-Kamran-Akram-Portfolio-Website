"use client";

import React, { useState, useEffect } from "react";
import { getExperience, saveExperience, deleteExperience, ResumeExperience } from "@/app/actions/resume";
import { Briefcase, Plus, Trash2, Edit2, Check, X } from "lucide-react";
import toast from "react-hot-toast";

export default function ResumeExperienceEditor() {
  const [experiences, setExperiences] = useState<ResumeExperience[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<ResumeExperience>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    setLoading(true);
    const data = await getExperience();
    setExperiences(data);
    setLoading(false);
  };

  const handleEdit = (exp: ResumeExperience) => {
    setEditingId(exp.id);
    setEditForm({ ...exp });
  };

  const handleAddNew = () => {
    const newId = `new-${Date.now()}`;
    setEditingId(newId);
    setEditForm({
      id: newId,
      position: "",
      company: "",
      duration: "",
      description: "",
      type: "work",
      is_active: false,
      display_order: experiences.length,
    });
  };

  const handleSave = async () => {
    if (!editForm.position || !editForm.company) {
      toast.error("Position and Company are required");
      return;
    }

    const loadingToast = toast.loading("Saving experience...");
    const res = await saveExperience(editForm as ResumeExperience);
    
    if (res.success) {
      toast.success("Saved successfully!", { id: loadingToast });
      setEditingId(null);
      fetchExperiences();
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
    const res = await deleteExperience(id);
    
    if (res.success) {
      toast.success("Deleted!", { id: loadingToast });
      fetchExperiences();
    } else {
      toast.error(res.error || "Failed to delete", { id: loadingToast });
    }
  };

  if (loading) return <div className="text-center py-4">Loading experience...</div>;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <Briefcase className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Experience</h2>
        </div>
        {!editingId && (
          <button 
            onClick={handleAddNew}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <Plus className="w-4 h-4" /> Add Experience
          </button>
        )}
      </div>

      <div className="space-y-4">
        {experiences.map((exp) => (
          <div key={exp.id} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
            {editingId === exp.id ? (
              <ExperienceForm 
                form={editForm} 
                setForm={setEditForm} 
                onSave={handleSave} 
                onCancel={() => setEditingId(null)} 
              />
            ) : (
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg dark:text-white">{exp.position}</h3>
                  <p className="text-blue-600 dark:text-blue-400 font-medium">{exp.company} • {exp.duration}</p>
                  <div className="text-sm text-slate-600 dark:text-slate-400 mt-2 line-clamp-2" dangerouslySetInnerHTML={{ __html: exp.description }} />
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(exp)} className="p-2 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(exp.id)} className="p-2 text-slate-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            )}
          </div>
        ))}

        {editingId?.startsWith("new-") && (
          <div className="border border-blue-500 rounded-lg p-4 bg-blue-50 dark:bg-blue-900/10">
            <h3 className="font-bold mb-4 dark:text-white">New Experience</h3>
            <ExperienceForm 
              form={editForm} 
              setForm={setEditForm} 
              onSave={handleSave} 
              onCancel={() => setEditingId(null)} 
            />
          </div>
        )}

        {experiences.length === 0 && !editingId && (
           <div className="text-center py-8 text-slate-500 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-dashed border-slate-200 dark:border-slate-700">
              No experience records found. Click 'Add Experience' to start.
           </div>
        )}
      </div>
    </div>
  );
}

function ExperienceForm({ form, setForm, onSave, onCancel }: { form: any, setForm: any, onSave: () => void, onCancel: () => void }) {
  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1 dark:text-slate-300">Position</label>
          <input 
            type="text" 
            className="w-full px-3 py-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700 dark:text-white" 
            value={form.position || ""} 
            onChange={(e) => setForm({...form, position: e.target.value})} 
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 dark:text-slate-300">Company</label>
          <input 
            type="text" 
            className="w-full px-3 py-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700 dark:text-white" 
            value={form.company || ""} 
            onChange={(e) => setForm({...form, company: e.target.value})} 
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1 dark:text-slate-300">Duration (e.g. 2022 - 2023)</label>
        <input 
          type="text" 
          className="w-full px-3 py-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700 dark:text-white" 
          value={form.duration || ""} 
          onChange={(e) => setForm({...form, duration: e.target.value})} 
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1 dark:text-slate-300">Description (HTML allowed)</label>
        <textarea 
          className="w-full px-3 py-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700 dark:text-white font-mono text-sm" 
          rows={5}
          value={form.description || ""} 
          onChange={(e) => setForm({...form, description: e.target.value})} 
        />
      </div>
      <div className="flex items-center gap-2">
        <input 
          type="checkbox" 
          id="is_active" 
          checked={form.is_active || false} 
          onChange={(e) => setForm({...form, is_active: e.target.checked})} 
        />
        <label htmlFor="is_active" className="text-sm font-medium dark:text-slate-300">Is this an active role? (Highlights the duration badge)</label>
      </div>
      
      <div className="flex justify-end gap-3 mt-4">
        <button onClick={onCancel} className="flex items-center gap-2 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition dark:text-white">
          <X className="w-4 h-4" /> Cancel
        </button>
        <button onClick={onSave} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
          <Check className="w-4 h-4" /> Save
        </button>
      </div>
    </div>
  );
}
