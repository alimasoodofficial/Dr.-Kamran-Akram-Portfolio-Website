"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseClient } from "@/lib/supabaseClient";

export default function NewGalleryItem() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const verifyAdmin = async () => {
      try {
        const { data: sessionData } = await supabaseClient.auth.getSession();
        const sessionToken = sessionData.session?.access_token;
        if (!sessionToken) throw new Error("No token");

        const validation = await fetch("/api/admin/check", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ accessToken: sessionToken }),
        });

        if (!validation.ok) {
          throw new Error("Unauthorized");
        }

        setToken(sessionToken);
      } catch {
        await supabaseClient.auth.signOut();
        router.replace("/admin/login");
      } finally {
        setChecking(false);
      }
    };

    verifyAdmin();
  }, [router]);

  const handleUpload = async (): Promise<string | null> => {
    if (!file) return null;
    if (!token) throw new Error("Unauthorized");
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
    setLoading(true);
    try {
      const image_url = await handleUpload();
      const body = { title, description, category, image_url };
      if (!token) throw new Error("Unauthorized");
      const res = await fetch("/api/admin/gallery", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Create failed");
      router.push("/admin/gallery");
    } catch (err: any) {
      alert(err.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return <div className="p-8 text-center">Checking access...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h2 className="text-xl font-bold mb-4">Create Gallery Item</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="w-full p-3 border rounded"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          className="w-full p-3 border rounded"
        />
        <input
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Category"
          className="w-full p-3 border rounded"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
        <div className="flex gap-2">
          <button
            disabled={loading}
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            {loading ? "Saving..." : "Save"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

