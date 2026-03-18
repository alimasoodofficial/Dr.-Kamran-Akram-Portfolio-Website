"use client";

import { useState } from "react";
import GradientText from "@/components/ui/GradientText";
import { Plus, Send, Users, ExternalLink, Download, Edit, FileText } from "lucide-react";
import Link from "next/link";
import type { Subscriber } from "./page";

type Newsletter = {
  id: string;
  title: string;
  subtitle?: string;
  status: "draft" | "published";
  updated_at: string;
};

type AdminNewsletterClientProps = {
  initialNewsletters: Newsletter[];
  initialSubscribers: Subscriber[];
};

// ---------------------------------------------------------------------------
// CSV export helper
// ---------------------------------------------------------------------------
function exportToCsv(subscribers: Subscriber[]) {
  const header = ["ID", "Full Name", "Email", "Date Joined"];
  const rows = subscribers.map((s) => [
    s.id,
    s.full_name ?? "",
    s.email,
    new Date(s.created_at).toLocaleDateString("en-AU", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }),
  ]);

  const csvContent = [header, ...rows]
    .map((row) => row.map((cell) => `"${cell}"`).join(","))
    .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `subscribers_${new Date().toISOString().split("T")[0]}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function AdminNewsletterClient({
  initialNewsletters,
  initialSubscribers,
}: AdminNewsletterClientProps) {
  const [activeTab, setActiveTab] = useState<"campaigns" | "subscribers">(
    "campaigns",
  );

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            <GradientText colors={["#10B981", "#3B82F6"]}>
              Newsletter
            </GradientText>
          </h1>
          <p className="text-slate-500 mt-1">
            Manage email campaigns and subscribers.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {activeTab === "subscribers" && (
            <button
              onClick={() => exportToCsv(initialSubscribers)}
              disabled={initialSubscribers.length === 0}
              className="flex items-center gap-2 text-xs md:text-sm bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 px-4 py-2 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          )}

          <Link
            href="/newsletter"
            target="_blank"
            className="flex items-center gap-2 text-xs md:text-sm bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 px-4 py-2 rounded-lg transition-colors"
          >
            <ExternalLink className="w-5 h-5" />
            <span>View Page</span>
          </Link>

          <Link
            href="/admin/newsletter/create"
            className="flex items-center gap-2 text-xs md:text-sm bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors shadow-lg shadow-emerald-500/20"
          >
            <Plus className="w-5 h-5" />
            <span>New Newsletter</span>
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <nav className="-mb-px flex gap-6">
          <button
            onClick={() => setActiveTab("campaigns")}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === "campaigns"
                ? "border-emerald-500 text-emerald-600"
                : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
            }`}
          >
            Newsletters
          </button>
          <button
            onClick={() => setActiveTab("subscribers")}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2 ${
              activeTab === "subscribers"
                ? "border-emerald-500 text-emerald-600"
                : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
            }`}
          >
            Subscribers
            <span className="text-xs font-semibold bg-slate-100 text-slate-500 rounded-full px-2 py-0.5">
              {initialSubscribers.length}
            </span>
          </button>
        </nav>
      </div>

      {/* Tab panels */}
      {activeTab === "campaigns" ? (
        <div className="space-y-4">
          {initialNewsletters.length === 0 ? (
            <div className="text-center py-12 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <Send className="w-12 h-12 mb-2 mx-auto opacity-50" />
              <p>No newsletters found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {initialNewsletters.map((nl) => (
                <div key={nl.id} className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between group hover:border-emerald-200 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-500 transition-colors">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 line-clamp-1">{nl.title}</h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full ${
                          nl.status === 'published' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {nl.status}
                        </span>
                        <span className="text-xs text-slate-400">
                          Updated {new Date(nl.updated_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link 
                      href={`/newsletter/${nl.id}`}
                      target="_blank"
                      className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
                      title="View Public Link"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                    <Link 
                      href={`/admin/newsletter/${nl.id}/edit`}
                      className="flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-emerald-50 text-slate-600 hover:text-emerald-600 rounded-lg text-sm font-medium transition-all"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* ── Subscribers tab ─────────────────────────────────────── */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {initialSubscribers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
              <Users className="w-10 h-10 opacity-30" />
              <p className="text-sm font-medium">No subscribers yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-left">
                    <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">
                      Date Joined
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {initialSubscribers.map((sub) => (
                    <tr
                      key={sub.id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-6 py-4 font-medium text-slate-700">
                        {sub.full_name ?? (
                          <span className="text-slate-400 italic">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-slate-500">
                        <a
                          href={`mailto:${sub.email}`}
                          className="hover:text-emerald-600 transition-colors"
                        >
                          {sub.email}
                        </a>
                      </td>
                      <td className="px-6 py-4 text-slate-400 whitespace-nowrap">
                        {new Date(sub.created_at).toLocaleDateString("en-AU", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
