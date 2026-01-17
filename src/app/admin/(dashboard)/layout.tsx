"use client";

import AdminSidebar from "@/components/admin/Sidebar";
import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { supabaseClient } from "@/lib/supabaseClient";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      try {
        const { data: { session } } = await supabaseClient.auth.getSession();
        
        if (!session) {
          router.replace("/admin/login");
          return;
        }

        // Verify admin role via server
        const res = await fetch("/api/admin/check", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ accessToken: session.access_token }),
        });

        if (!res.ok) {
          await supabaseClient.auth.signOut();
          router.replace("/admin/login");
          return;
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Auth check failed:", error);
        router.replace("/admin/login");
      }
    }

    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 font-medium animate-pulse">Verifying Admin Session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 relative">
      {/* Mobile Top Bar */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-slate-900 text-white fixed top-0 w-full z-40">
        <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
          Admin Panel
        </h2>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
        >
          {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <main className="lg:ml-64 min-h-screen px-4 md:px-8 pb-8 pt-20 lg:pt-10 transition-all duration-300">
        <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
          {children}
        </div>
      </main>
    </div>
  );
}
