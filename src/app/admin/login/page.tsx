"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

const notify = () => toast("Here is your toast.");

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");

  const login = async (e: any) => {
    e.preventDefault();

    setError("");

    // 1) Login user
    const { data: auth, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password: pass,
    });

    if (authError) {
      setError("Invalid email or password");
      return;
    }

    // 2) Check is_admin
    const { data: profile } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", auth.user.id)
      .single();

    if (!profile?.is_admin) {
      setError("You are not authorized to access admin panel.");
      return;
    }

    // 3) Redirect to admin panel
    router.push("/admin/gallery");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <form
        onSubmit={login}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm"
      >
        <h1 className="text-xl mb-4 font-bold">Admin Login</h1>

        <input
          type="email"
          className="w-full p-3 border rounded mb-3"
          placeholder="Admin email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full p-3 border rounded mb-4"
          placeholder="Password"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
        />

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <button className="w-full py-3 bg-blue-600 text-white rounded-lg">
          Login
        </button>
      </form>
      <Toaster />
    </div>
  );
}
