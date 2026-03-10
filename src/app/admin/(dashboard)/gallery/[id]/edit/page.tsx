"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabaseClient } from "@/lib/supabaseClient";
import toast from "react-hot-toast";

export default function EditGalleryItem() {
  const { id } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(true);
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

  useEffect(() => {
    const verifyAdmin = async () => {
      try {
        const { data: sessionData } = await supabaseClient.auth.getSession();
        const token = sessionData.session?.access_token;
        if (!token) throw new Error("No token");

        const validation = await fetch("/api/admin/check", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ accessToken: token }),
        });

        if (!validation.ok) throw new Error("Unauthorized");
      } catch {
        await supabaseClient.auth.signOut();
        router.replace("/admin/login");
        return;
      } finally {
        setChecking(false);
      }
    };

    verifyAdmin();
  }, [router]);

  // Fetch existing data
  useEffect(() => {
    if (checking) return;

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
          // normalize date to YYYY-MM-DD for date input
          date: data.date ? new Date(data.date).toISOString().slice(0, 10) : "",
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
  }, [checking, id, router]);

  // Handle input changes
  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // Save changes
  const handleUpdate = async () => {
    setSaving(true);
    const toastId = toast.loading("Saving changes...");

    try {
      const { data: sessionData } = await supabaseClient.auth.getSession();
      const token = sessionData.session?.access_token;
      if (!token) throw new Error("Unauthorized");

      const updatePayload = {
        ...form,
        date: form.date ? new Date(form.date).toISOString() : undefined,
        tags: form.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      };

      const res = await fetch(`/api/admin/gallery/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatePayload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to update");
      }

      toast.success("Updated successfully!", { id: toastId });
      router.push("/admin/gallery");
    } catch (err: any) {
      toast.error(err.message || "Error updating item", { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  // Delete item
  const handleDelete = async () => {
    const yes = confirm("Are you sure you want to delete this item?");
    if (!yes) return;

    setDeleting(true);
    const toastId = toast.loading("Deleting item...");

    try {
      const { data: sessionData } = await supabaseClient.auth.getSession();
      const token = sessionData.session?.access_token;
      if (!token) throw new Error("Unauthorized");

      const res = await fetch(`/api/admin/gallery/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to delete");
      }

      toast.success("Deleted successfully!", { id: toastId });
      router.push("/admin/gallery");
    } catch (err: any) {
      toast.error(err.message || "Error deleting item", { id: toastId });
    } finally {
      setDeleting(false);
    }
  };

  if (checking || loading) {
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
              type={field === "date" ? "date" : "text"}
              value={value}
              onChange={(e) => handleChange(field, e.target.value)}
              className="w-full p-3 shadow-sm text-black rounded-lg dark:bg-gray-100 dark:border-gray-700"
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
