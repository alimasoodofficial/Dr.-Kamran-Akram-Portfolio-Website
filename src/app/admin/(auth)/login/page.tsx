"use client";

import { useState, useEffect } from "react";
import { supabaseClient } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import GradientText from "@/components/ui/GradientText";
import ElectricBorder from "@/components/ui/ElectricBorder";
import { toast } from "react-hot-toast";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [isVerifying, setIsVerifying] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function checkExistingSession() {
      try {
        const { data: { session } } = await supabaseClient.auth.getSession();
        if (session) {
          const res = await fetch("/api/admin/check", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ accessToken: session.access_token }),
          });

          if (res.ok) {
            router.replace("/admin/gallery");
            return;
          }
        }
      } catch (error) {
        console.error("Session check failed:", error);
      } finally {
        setIsVerifying(false);
      }
    }
    checkExistingSession();
  }, [router]);

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

    const res = await fetch("/api/admin/check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accessToken: token }),
    });

    if (!res.ok) {
      try {
        const body = await res.json();
        setErr(body?.error || `Not authorized as admin (${res.status})`);
      } catch (e) {
        setErr(`Not authorized as admin (${res.status})`);
      }
      await supabaseClient.auth.signOut();
      return;
    }
    toast.success("Welcome Dr Kamran!", { duration: 3000 });
    router.push("/admin/gallery");
  };

  if (isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 font-medium">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 pt-10">
      {/* <ElectricBorder
        color="orange"
        speed={100}
        chaos={2}
        thickness={20}
        style={{ borderRadius: 20 }}
      > */}
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white dark:bg-gray-900 p-8 rounded-2xl shadow"
        >
          <h2 className="font-heading text-center text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-6">
            <GradientText
              colors={["#97ABFF", "#123597"]}
              animationSpeed={6}
              className="text-5xl"
            >
              Admin Login
            </GradientText>
          </h2>
          {err && <div className="text-red-500 mb-3">{err}</div>}
          <input
            className="w-full mb-3 p-3 border border-gray-200 rounded placeholder:text-gray-600"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="w-full mb-4 p-3 border rounded border-gray-200 placeholder:text-gray-600"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="w-full bg-blue-600 text-white py-3 rounded">
            Sign in
          </button>
        </form>
      {/* </ElectricBorder> */}
    </div>
  );
}
