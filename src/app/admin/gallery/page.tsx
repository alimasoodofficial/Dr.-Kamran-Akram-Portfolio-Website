"use client";
import { useEffect, useState } from "react";
import { supabaseClient } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

type Item = {
  id: string;
  title: string;
  description?: string;
  image_url?: string;
  category?: string;
  date?: string;
  location?: string;
  tags?: string[];
};

export default function AdminGallery() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAndLoad = async () => {
      setLoading(true);
      try {
        const { data: sessionData } = await supabaseClient.auth.getSession();
        const token = sessionData.session?.access_token;
        if (!token) {
          setLoading(false);
          router.replace("/admin/login");
          return;
        }

        const validation = await fetch("/api/admin/check", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ accessToken: token }),
        });

        if (!validation.ok) {
          // read server message where possible to help debugging (e.g. RLS or missing service key)
          try {
            const body = await validation.json();
            console.error(
              "admin/check failed:",
              body?.error || validation.status
            );
            alert(body?.error || "Not authorized as admin");
          } catch (e) {
            console.error("admin/check failed with status", validation.status);
            alert("Not authorized as admin");
          }
          await supabaseClient.auth.signOut();
          setLoading(false);
          router.replace("/admin/login");
          return;
        }

        setToken(token);

        const list = await fetch("/api/admin/gallery", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!list.ok) {
          throw new Error("Failed to load gallery items");
        }
        const json = await list.json();
        setItems(json || []);
      } catch (err: any) {
        console.error("Error loading gallery:", err);
        alert(err.message || "Error loading gallery items");
      } finally {
        setLoading(false);
      }
    };

    checkAndLoad();
  }, [router]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this item?")) return;
    if (!token) {
      router.replace("/admin/login");
      return;
    }
    try {
      const res = await fetch(`/api/admin/gallery/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to delete item");
      }
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch (err: any) {
      alert(err.message || "Error deleting item");
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Gallery Admin</h1>
        <div className="flex gap-2">
          <button
            onClick={() => router.push("/admin/gallery/new")}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Create
          </button>
          <button
            onClick={() => {
              supabaseClient.auth.signOut();
              router.push("/admin/login");
            }}
            className="px-3 py-2 border rounded"
          >
            Sign out
          </button>
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid  md:grid-cols-3 gap-6">
          {items.map((it) => (
            <div
              key={it.id}
              className="card p-4 rounded shadow"
            >
              {it.image_url ? (
                <img
                  src={it.image_url}
                  alt={it.title}
                  className="w-full h-40 object-cover rounded mb-3"
                />
              ) : (
                <div className="h-40 bg-gray-100 rounded mb-3" />
              )}
              <h3 className="font-semibold">{it.title}</h3>
              <p className="text-sm text-gray-500">{it.category}</p>
              <div className="text-xs text-gray-400 mt-2">
                {it.date ? new Date(it.date).toLocaleDateString() : ""}
                {it.location ? ` • ${it.location}` : ""}
              </div>
              <div className="flex gap-2 flex-wrap mt-2">
                {it.tags?.map((t) => (
                  <span
                    key={t}
                    className="text-xs card px-2 py-1 bg-gray-100 rounded-full"
                  >
                    #{t}
                  </span>
                ))}
              </div>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => router.push(`/admin/gallery/${it.id}/edit`)}
                  className="px-3 py-1 border rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(it.id)}
                  className="px-3 py-1 bg-red-600 text-white rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
