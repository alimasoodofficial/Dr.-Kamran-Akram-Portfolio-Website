"use client";
import { useState } from "react";
import { supabaseClient } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });
    if (error) return setErr(error.message);

    const token = data.session?.access_token;
    if (!token) return setErr("No session token");

    // server verify admin role to keep anon key privileges minimal
    const res = await fetch("/api/admin/check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accessToken: token }),
    });

    if (!res.ok) {
      setErr("Not authorized as admin");
      await supabaseClient.auth.signOut();
      return;
    }

    router.push("/admin/gallery");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white dark:bg-gray-900 p-8 rounded-2xl shadow"
      >
        <h2 className="text-2xl font-bold mb-4">Admin Login</h2>
        {err && <div className="text-red-500 mb-3">{err}</div>}
        <input
          className="w-full mb-3 p-3 border rounded"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="w-full mb-4 p-3 border rounded"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="w-full bg-blue-600 text-white py-3 rounded">
          Sign in
        </button>
      </form>
    </div>
  );
}
