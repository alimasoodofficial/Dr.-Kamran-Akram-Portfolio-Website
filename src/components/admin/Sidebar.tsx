"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Image as ImageIcon,
  BookOpen,
  FileText,
  Mail,
  LogOut,
  Settings,
  Globe,
  Calendar,
  CreditCard,
} from "lucide-react";
import { supabaseClient } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Gallery", href: "/admin/gallery", icon: ImageIcon },
  { label: "Articles", href: "/admin/articles", icon: FileText },
  { label: "Ebooks", href: "/admin/ebooks", icon: BookOpen },
  { label: "Newsletter", href: "/admin/newsletter", icon: Mail },
  { label: "Bookings", href: "/admin/bookings", icon: Calendar },
  { label: "Transactions", href: "/admin/transactions", icon: CreditCard },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminSidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    document.cookie = "sb-access-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    await supabaseClient.auth.signOut();
    router.push("/admin/login");
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-white text-slate-900 flex flex-col border-r border-slate-200 z-50 transition-transform duration-300 lg:translate-x-0 shadow-sm ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-8 border-b border-slate-100 flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-600/20 mb-2">
            <Settings className="w-7 h-7 text-white" />
          </div>
          <h4 className="text-xl font-bold tracking-tight text-slate-900">
            Admin Portal
          </h4>
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 border border-blue-100 rounded-full">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Authorized</span>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-8 px-4 space-y-2.5">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3.5 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative ${
                  isActive
                    ? "bg-blue-50 text-blue-700 border border-blue-100 shadow-sm"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900 border border-transparent"
                }`}
              >
                {isActive && (
                  <motion.div 
                    layoutId="sidebar-active"
                    className="absolute inset-0 bg-blue-50 rounded-2xl -z-10"
                  />
                )}
                <item.icon
                  className={`w-5 h-5 transition-all duration-300 ${
                    isActive
                      ? "text-blue-600 scale-110"
                      : "text-slate-400 group-hover:text-slate-600"
                  }`}
                />
                <span className={`font-medium transition-colors ${isActive ? "text-blue-700" : "text-slate-500 group-hover:text-slate-700"}`}>
                  {item.label}
                </span>
                
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.4)]" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-slate-100 space-y-3">
          <Link
            href="/"
            className="flex w-full items-center gap-3.5 px-4 py-3 rounded-2xl text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all border border-transparent hover:border-slate-200"
          >
            <Globe className="w-5 h-5 text-slate-400" />
            <span className="font-medium text-sm">Main Website</span>
          </Link>
          <button
            onClick={handleSignOut}
            className="flex w-full items-center gap-3.5 px-4 py-3 rounded-2xl text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all border border-transparent hover:border-red-100 cursor-pointer"
          >
            <LogOut className="w-5 h-5 text-slate-400 group-hover:text-red-500" />
            <span className="font-medium text-sm">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
