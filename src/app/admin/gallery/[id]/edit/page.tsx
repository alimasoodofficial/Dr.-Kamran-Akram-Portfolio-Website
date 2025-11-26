"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabaseClient } from "@/lib/supabaseClient";

export default function EditGalleryItem() {
  const { id } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    date: "",
    location: "",
    image_url: "",
    tags: "",
  });

  // Fetch existing data
  useEffect(() => {
    const fetchItem = async () => {
      try {
        const { data, error } = await supabaseClient
          .from("gallery")
          .select("*")
          .eq("id", id)
          .single();
        if (error) {
          throw error;
        }

        setForm({
          title: data.title || "",
          description: data.description || "",
          category: data.category || "",
          date: data.date || "",
          location: data.location || "",
          image_url: data.image_url || "",
          tags: data.tags
            ? Array.isArray(data.tags)
              ? data.tags.join(", ")
              : data.tags
            : "",
        });

        setLoading(false);
      } catch (err: any) {
        console.error(err);
        alert(err.message || "Failed to load item.");
        router.push("/admin/gallery");
      }
    };

    fetchItem();
  }, [id, router]);

  // Handle input changes
  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // Save changes
  const handleUpdate = async () => {
    setSaving(true);

    try {
      const updatePayload = {
        ...form,
        tags: form.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      };

      const { error } = await supabaseClient
        .from("gallery")
        .update(updatePayload)
        .eq("id", id);

      if (error) {
        throw error;
      }

      alert("Updated successfully!");
      router.push("/admin/gallery");
    } catch (err: any) {
      alert(err.message || "Error updating item");
    } finally {
      setSaving(false);
    }
  };

  // Delete item
  const handleDelete = async () => {
    const yes = confirm("Are you sure you want to delete this item?");
    if (!yes) return;

    setDeleting(true);

    try {
      const { error } = await supabaseClient
        .from("gallery")
        .delete()
        .eq("id", id);
      if (error) {
        throw error;
      }

      alert("Deleted successfully!");
      router.push("/admin/gallery");
    } catch (err: any) {
      alert(err.message || "Error deleting item");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return <p className="p-10 text-center">Loading...</p>;
  }

  return (
    <main className="p-10 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Edit Gallery Item</h1>

      <div className="space-y-5">
        {Object.entries(form).map(([field, value]) => (
          <div key={field}>
            <label className="block mb-1 capitalize text-sm font-medium">
              {field.replace("_", " ")}
            </label>

            <input
              type="text"
              value={value}
              onChange={(e) => handleChange(field, e.target.value)}
              className="w-full p-3 border rounded-lg dark:bg-gray-900 dark:border-gray-700"
            />
          </div>
        ))}

        <div className="flex gap-3 mt-6">
          <button
            onClick={handleUpdate}
            disabled={saving}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>

          <button
            onClick={handleDelete}
            disabled={deleting}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </main>
  );
}


