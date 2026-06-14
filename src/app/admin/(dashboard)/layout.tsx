"use client";

import AdminSidebar from "@/components/admin/Sidebar";
import React, { useState, useEffect, useRef } from "react";
import { Menu, X } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { supabaseClient } from "@/lib/supabaseClient";
import { toast } from "react-hot-toast";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Clear any pending toast show timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    // Dismiss the loading toast whenever pathname changes
    toast.dismiss("page-loading-toast");
  }, [pathname]);

  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a");
      if (!target) return;

      // Check modifier keys to let browser open in new tab/window naturally
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;

      const href = target.getAttribute("href");
      const targetAttr = target.getAttribute("target");
      const download = target.getAttribute("download");

      // Skip non-navigation URLs
      if (!href || href.startsWith("#") || targetAttr === "_blank" || download !== null) {
        return;
      }

      // Skip mailto and phone links
      if (href.startsWith("mailto:") || href.startsWith("tel:")) {
        return;
      }

      // Skip external links
      const isExternal = href.startsWith("http://") || href.startsWith("https://");
      if (isExternal && !href.startsWith(window.location.origin)) {
        return;
      }

      // Resolve URL to absolute to compare pathname
      try {
        const targetUrl = new URL(href, window.location.href);
        const currentPath = window.location.pathname;

        // Skip if it's the exact same pathname and search query
        if (targetUrl.pathname === currentPath && targetUrl.search === window.location.search) {
          return;
        }

        // Only show loading toast for admin dashboard navigations
        if (targetUrl.pathname.startsWith("/admin")) {
          // Clear any existing timeout
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }

          // Show a nice loading toast after 150ms delay to avoid flashing on instant loads
          timeoutRef.current = setTimeout(() => {
            toast.loading("Loading page...", {
              id: "page-loading-toast",
            });
            timeoutRef.current = null;
          }, 150);
        }
      } catch (err) {
        console.error("Failed to parse URL in transition loader:", err);
      }
    };

    const handlePopState = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        toast.loading("Loading page...", {
          id: "page-loading-toast",
        });
        timeoutRef.current = null;
      }, 150);
    };

    document.addEventListener("click", handleAnchorClick, { capture: true });
    window.addEventListener("popstate", handlePopState);

    return () => {
      document.removeEventListener("click", handleAnchorClick, { capture: true });
      window.removeEventListener("popstate", handlePopState);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      // Dismiss toast on unmount
      toast.dismiss("page-loading-toast");
    };
  }, []);

  useEffect(() => {
    async function checkAuth() {
      try {
        const {
          data: { session },
        } = await supabaseClient.auth.getSession();

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
          document.cookie = "sb-access-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
          await supabaseClient.auth.signOut();
          router.replace("/admin/login");
          return;
        }

        // Set the access token cookie for server actions/routes
        document.cookie = `sb-access-token=${session.access_token}; path=/; max-age=604800; SameSite=Lax; Secure`;
        setIsLoading(false);
      } catch (error) {
        console.error("Auth check failed:", error);
        document.cookie = "sb-access-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
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
          <p className="text-slate-400 font-medium animate-pulse">
            Verifying Admin Session...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 relative text-slate-900">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-600/[0.03] blur-[120px] rounded-full"></div>
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-purple-600/[0.03] blur-[120px] rounded-full"></div>
      </div>

      {/* Mobile Top Bar */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-white/80 backdrop-blur-xl border-b border-slate-200 text-slate-900 fixed top-0 w-full z-40">
        <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Admin Portal
        </h2>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
        >
          {isSidebarOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      <AdminSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <main className="lg:ml-64 min-h-screen px-4 md:px-8 pb-8 pt-20 lg:pt-10 transition-all duration-300">
        <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
          {children}
        </div>
      </main>
    </div>
  );
}
