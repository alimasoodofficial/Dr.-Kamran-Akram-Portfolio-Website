"use client";

import React, { useState, useMemo } from "react";
import GradientText from "@/components/ui/GradientText";
import { 
  Download, 
  Search, 
  Filter, 
  CreditCard, 
  DollarSign, 
  BookOpen, 
  Calendar, 
  Percent, 
  AlertCircle,
  Copy,
  Check,
  ArrowRight,
  Play,
  X,
  Sparkles,
  Mail
} from "lucide-react";
import toast from "react-hot-toast";

export type Transaction = {
  id: string;
  stripe_session_id: string;
  customer_name: string;
  customer_email: string;
  promocode_used: string | null;
  price_paid: number;
  item_type: string;
  item_name: string;
  created_at: string;
};

type SimulatedEbook = {
  id: string;
  title: string;
};

type AdminTransactionsClientProps = {
  initialTransactions: Transaction[];
  ebooks: SimulatedEbook[];
  tableMissing: boolean;
};

// ---------------------------------------------------------------------------
// CSV export helper
// ---------------------------------------------------------------------------
function exportToCsv(transactions: Transaction[]) {
  const header = ["ID", "Stripe Session ID", "Customer Name", "Customer Email", "Item Name", "Item Type", "Promo Code Used", "Price Paid", "Date"];
  const rows = transactions.map((t) => [
    t.id,
    t.stripe_session_id,
    t.customer_name,
    t.customer_email,
    t.item_name,
    t.item_type,
    t.promocode_used ?? "None",
    `$${Number(t.price_paid).toFixed(2)}`,
    new Date(t.created_at).toLocaleString("en-US"),
  ]);

  const csvContent = [header, ...rows]
    .map((row) => row.map((cell) => `"${cell}"`).join(","))
    .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `transactions_${new Date().toISOString().split("T")[0]}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export default function AdminTransactionsClient({
  initialTransactions,
  ebooks,
  tableMissing,
}: AdminTransactionsClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "ebook" | "booking" | "promo">("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Simulator Modal State
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [simType, setSimType] = useState<"ebook" | "booking">("ebook");
  const [simLoading, setSimLoading] = useState(false);

  // Simulator Form Fields
  const [simName, setSimName] = useState("John Doe Tester");
  const [simEmail, setSimEmail] = useState("");
  const [simEbookId, setSimEbookId] = useState(ebooks[0]?.id || "");
  const [simPromo, setSimPromo] = useState("");
  const [simPrice, setSimPrice] = useState("19.99");
  
  // Booking-specific simulator state
  const [simDate, setSimDate] = useState("2026-06-15");
  const [simTimeSlot, setSimTimeSlot] = useState("10:00 - 10:30");
  const [simPlatform, setSimPlatform] = useState("Zoom");
  const [simDuration, setSimDuration] = useState("30");
  const [simNotes, setSimNotes] = useState("Need professional environmental advice.");

  // Copy helper
  const handleCopySession = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success("Stripe Session ID copied!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Compute metrics
  const metrics = useMemo(() => {
    const totalRev = initialTransactions.reduce((acc, t) => acc + Number(t.price_paid), 0);
    const ebookTx = initialTransactions.filter((t) => t.item_type === "ebook");
    const ebookRev = ebookTx.reduce((acc, t) => acc + Number(t.price_paid), 0);
    const bookingTx = initialTransactions.filter((t) => t.item_type === "booking");
    const bookingRev = bookingTx.reduce((acc, t) => acc + Number(t.price_paid), 0);
    const promoTx = initialTransactions.filter((t) => t.promocode_used !== null && t.promocode_used !== "");

    return {
      totalRevenue: totalRev,
      ebookSalesCount: ebookTx.length,
      ebookRevenue: ebookRev,
      bookingSalesCount: bookingTx.length,
      bookingRevenue: bookingRev,
      promoCodeCount: promoTx.length,
    };
  }, [initialTransactions]);

  // Filter & Search logic
  const filteredTransactions = useMemo(() => {
    return initialTransactions.filter((t) => {
      const matchesSearch = 
        t.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.customer_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (t.promocode_used && t.promocode_used.toLowerCase().includes(searchTerm.toLowerCase())) ||
        t.stripe_session_id.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilter =
        filterType === "all" ||
        (filterType === "ebook" && t.item_type === "ebook") ||
        (filterType === "booking" && t.item_type === "booking") ||
        (filterType === "promo" && t.promocode_used !== null && t.promocode_used !== "");

      return matchesSearch && matchesFilter;
    });
  }, [initialTransactions, searchTerm, filterType]);

  // Webhook Simulator Function
  const handleSimulateWebhook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!simEmail) {
      toast.error("Please enter a destination email address!");
      return;
    }

    setSimLoading(true);
    const mockSessionId = `cs_test_${Math.random().toString(36).substring(2, 15)}`;

    let payload: any = {
      id: `evt_sim_${Math.random().toString(36).substring(2, 15)}`,
      type: "checkout.session.completed",
      data: {
        object: {
          id: mockSessionId,
          amount_total: Math.round(parseFloat(simPrice) * 100),
          customer_details: {
            email: simEmail,
            name: simName,
          },
        }
      }
    };

    if (simType === "ebook") {
      if (!simEbookId) {
        toast.error("No ebooks found in database! Create an eBook first to simulate a purchase.");
        setSimLoading(false);
        return;
      }
      payload.data.object.metadata = {
        ebookId: simEbookId,
        customerEmail: simEmail,
        fullName: simName,
        promoCodeApplied: simPromo,
      };
    } else {
      payload.data.object.metadata = {
        email: simEmail,
        fullName: simName,
        time_slot: simTimeSlot,
        date: simDate,
        platform: simPlatform,
        duration: simDuration,
        notes: simNotes,
      };
    }

    try {
      const response = await fetch("/api/webhooks/stripe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Notice: no stripe-signature header is sent, forcing the local verification bypass!
        },
        body: JSON.stringify(payload),
      });

      const resData = await response.json();

      if (response.ok) {
        toast.success("Webhook event simulated successfully!");
        setIsSimulatorOpen(false);
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        console.error("Simulation error response:", resData);
        toast.error(`Simulation failed: ${resData.error || "Unknown Error"}`);
      }
    } catch (err: any) {
      console.error("Simulation connection error:", err);
      toast.error(`Network error: ${err.message}`);
    } finally {
      setSimLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-10">
      
      {/* Table Missing Warning (Self-healing Instruction Box) */}
      {tableMissing && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-3xl p-6 md:p-8 space-y-4 shadow-sm animate-pulse">
          <div className="flex gap-4 items-start">
            <div className="p-3 bg-amber-500 text-slate-900 rounded-2xl shrink-0">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h4 className="font-extrabold text-lg text-slate-900">Supabase Table Missing!</h4>
              <p className="text-slate-700 text-sm leading-relaxed">
                The <code className="bg-white/60 px-1.5 py-0.5 rounded font-mono font-bold text-slate-900">transactions</code> table does not exist in your database yet. 
                Please copy the SQL commands from the <code className="bg-white/60 px-1.5 py-0.5 rounded font-mono font-bold text-slate-900">supabase-schema.sql</code> file and run them in your Supabase SQL Editor.
              </p>
              <div className="pt-2">
                <a 
                  href="https://supabase.com/" 
                  target="_blank" 
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow"
                >
                  <span>Go to Supabase Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            <GradientText colors={["#2563EB", "#7C3AED"]}>
              Transactions Ledger
            </GradientText>
          </h1>
          <p className="text-slate-500 mt-1">
            Real-time audit log of Stripe payments, ebook downloads, and bookings.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Simulator Trigger */}
          <button
            onClick={() => setIsSimulatorOpen(true)}
            className="flex items-center gap-2 text-xs md:text-sm bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2.5 rounded-xl transition-all shadow-md font-semibold cursor-pointer"
          >
            <Play className="w-4 h-4" />
            <span>Simulate Payment Event</span>
          </button>

          <button
            onClick={() => exportToCsv(filteredTransactions)}
            disabled={filteredTransactions.length === 0}
            className="flex items-center gap-2 text-xs md:text-sm bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 px-4 py-2.5 rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-sm font-semibold cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export Ledger</span>
          </button>
          
          <a
            href="https://dashboard.stripe.com/test/payments"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-xs md:text-sm bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-xl transition-colors shadow-lg shadow-black/5 font-semibold"
          >
            <CreditCard className="w-4 h-4" />
            <span>Stripe Dashboard</span>
          </a>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Metric: Total Revenue */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-500 opacity-5 blur-2xl group-hover:opacity-10 transition-opacity" />
          <div className="relative z-10 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Total Revenue</p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">${metrics.totalRevenue.toFixed(2)}</h3>
            </div>
          </div>
        </div>

        {/* Metric: Ebook Sales */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-br from-pink-500 to-rose-500 opacity-5 blur-2xl group-hover:opacity-10 transition-opacity" />
          <div className="relative z-10 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center text-pink-600">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Ebook Revenue</p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">
                ${metrics.ebookRevenue.toFixed(2)}{" "}
                <span className="text-xs font-normal text-slate-400">({metrics.ebookSalesCount} sales)</span>
              </h3>
            </div>
          </div>
        </div>

        {/* Metric: Consultation Sales */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-br from-amber-500 to-orange-500 opacity-5 blur-2xl group-hover:opacity-10 transition-opacity" />
          <div className="relative z-10 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Consultation Revenue</p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">
                ${metrics.bookingRevenue.toFixed(2)}{" "}
                <span className="text-xs font-normal text-slate-400">({metrics.bookingSalesCount} slots)</span>
              </h3>
            </div>
          </div>
        </div>

        {/* Metric: Promo Codes Used */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-br from-emerald-500 to-teal-500 opacity-5 blur-2xl group-hover:opacity-10 transition-opacity" />
          <div className="relative z-10 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <Percent className="w-5 h-5" />
            </div>
            <div>
              <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Promos Redeemed</p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">
                {metrics.promoCodeCount}{" "}
                <span className="text-xs font-normal text-slate-400">times</span>
              </h3>
            </div>
          </div>
        </div>

      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, email, item, code or session id..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 text-sm"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0 hidden sm:block" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="w-full sm:w-auto bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="all">All Items</option>
            <option value="ebook">Ebooks Only</option>
            <option value="booking">Consultations Only</option>
            <option value="promo">Promo Codes Only</option>
          </select>
        </div>

      </div>

      {/* Main Ledger Table */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] border-collapse text-left text-slate-700">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Customer Details</th>
                <th className="px-6 py-4">Item Type / Name</th>
                <th className="px-6 py-4 text-center">Promo Applied</th>
                <th className="px-6 py-4 text-right">Price Paid</th>
                <th className="px-6 py-4">Stripe Session ID</th>
                <th className="px-6 py-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors">
                    
                    {/* Status badge */}
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
                        Paid
                      </span>
                    </td>

                    {/* Customer */}
                    <td className="px-6 py-4 space-y-0.5">
                      <div className="text-slate-800 font-extrabold text-sm">{tx.customer_name}</div>
                      <div className="text-slate-400 text-xs">{tx.customer_email}</div>
                    </td>

                    {/* Item type and title */}
                    <td className="px-6 py-4 space-y-1">
                      <div>
                        {tx.item_type === "ebook" ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-purple-50 text-purple-600 border border-purple-100">
                            <BookOpen className="w-2.5 h-2.5" />
                            <span>Ebook</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-amber-50 text-amber-600 border border-amber-100">
                            <Calendar className="w-2.5 h-2.5" />
                            <span>Booking</span>
                          </span>
                        )}
                      </div>
                      <div className="text-slate-700 text-sm font-semibold max-w-[280px] truncate" title={tx.item_name}>
                        {tx.item_name}
                      </div>
                    </td>

                    {/* Promo Code used */}
                    <td className="px-6 py-4 text-center">
                      {tx.promocode_used ? (
                        <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-xl text-xs font-black uppercase border border-emerald-100">
                          <Percent className="w-3 h-3" />
                          <span>{tx.promocode_used}</span>
                        </span>
                      ) : (
                        <span className="text-slate-400 text-xs font-normal">—</span>
                      )}
                    </td>

                    {/* Price Paid */}
                    <td className="px-6 py-4 text-right">
                      <span className="text-emerald-600 font-extrabold text-sm bg-emerald-500/10 px-2.5 py-1.5 rounded-xl border border-emerald-500/20">
                        ${Number(tx.price_paid).toFixed(2)}
                      </span>
                    </td>

                    {/* Stripe session ID */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 group max-w-[150px]">
                        <span className="text-slate-400 font-mono text-[10px] truncate select-all">
                          {tx.stripe_session_id}
                        </span>
                        <button
                          onClick={() => handleCopySession(tx.id, tx.stripe_session_id)}
                          className="text-slate-300 hover:text-slate-600 p-1 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                          title="Copy Stripe Session ID"
                        >
                          {copiedId === tx.id ? (
                            <Check className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 text-slate-500 text-xs">
                      {new Date(tx.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-20 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <CreditCard className="w-10 h-10 text-slate-300" />
                      <p className="font-bold uppercase tracking-widest text-xs">No transactions recorded</p>
                      <p className="text-xs text-slate-400 max-w-[300px]">
                        Once checkout events are received via Stripe webhook, they will appear here.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 🚀 HIGH-FIDELITY WEBHOOK SIMULATION MODAL */}
      {isSimulatorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden transform transition-all scale-100 flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="p-6 bg-slate-50 dark:bg-slate-950/40 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                  <Sparkles className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900">Payment & Webhook simulator</h3>
                  <p className="text-xs text-slate-500">Test Supabase logging & Nodemailer connection instantly</p>
                </div>
              </div>
              <button 
                onClick={() => setIsSimulatorOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-xl transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSimulateWebhook} className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-700">
              
              {/* Simulator Type Selection */}
              <div className="grid grid-cols-2 gap-3 bg-slate-100/70 p-1.5 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setSimType("ebook")}
                  className={`flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-xs transition-all ${
                    simType === "ebook" 
                      ? "bg-white text-slate-900 shadow-sm" 
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>E-Book purchase</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSimType("booking")}
                  className={`flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-xs transition-all ${
                    simType === "booking" 
                      ? "bg-white text-slate-900 shadow-sm" 
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  <span>Consultation call</span>
                </button>
              </div>

              {/* Shared Client Information Section */}
              <div className="space-y-4">
                <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-400">1. Customer Information</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Customer Name</label>
                    <input
                      type="text"
                      value={simName}
                      onChange={(e) => setSimName(e.target.value)}
                      required
                      placeholder="e.g. John Doe"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Destination Email</label>
                    <input
                      type="email"
                      value={simEmail}
                      onChange={(e) => setSimEmail(e.target.value)}
                      required
                      placeholder="Use your email to check Nodemailer receipt!"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-blue-200 hover:border-blue-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-sm shadow-blue-500/5 font-semibold"
                    />
                  </div>
                </div>
              </div>

              {/* Item Details Selection (Ebooks) */}
              {simType === "ebook" && (
                <div className="space-y-4">
                  <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-400">2. E-Book details</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Select Ebook</label>
                      <select
                        value={simEbookId}
                        onChange={(e) => setSimEbookId(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-medium"
                      >
                        {ebooks.length > 0 ? (
                          ebooks.map((b) => (
                            <option key={b.id} value={b.id}>
                              {b.title}
                            </option>
                          ))
                        ) : (
                          <option value="">No ebooks found - create one first</option>
                        )}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Promo Code Used (Optional)</label>
                      <input
                        type="text"
                        value={simPromo}
                        onChange={(e) => setSimPromo(e.target.value)}
                        placeholder="e.g. WELCOME10"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 uppercase font-bold text-slate-700"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Price Paid (USD)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={simPrice}
                        onChange={(e) => setSimPrice(e.target.value)}
                        required
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-bold text-slate-800"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Item Details Selection (Bookings) */}
              {simType === "booking" && (
                <div className="space-y-4">
                  <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-400">2. Consultation details</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Booking Date</label>
                      <input
                        type="date"
                        value={simDate}
                        onChange={(e) => setSimDate(e.target.value)}
                        required
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Time Slot</label>
                      <input
                        type="text"
                        value={simTimeSlot}
                        onChange={(e) => setSimTimeSlot(e.target.value)}
                        required
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Duration (Minutes)</label>
                      <select
                        value={simDuration}
                        onChange={(e) => setSimDuration(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none"
                      >
                        <option value="30">30 minutes</option>
                        <option value="60">60 minutes</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Platform</label>
                      <select
                        value={simPlatform}
                        onChange={(e) => setSimPlatform(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none"
                      >
                        <option value="Zoom">Zoom Video</option>
                        <option value="Google Meet">Google Meet</option>
                      </select>
                    </div>

                    <div className="space-y-1 md:col-span-2">
                      <label className="text-xs font-bold text-slate-700">Client Notes</label>
                      <textarea
                        value={simNotes}
                        onChange={(e) => setSimNotes(e.target.value)}
                        rows={2}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none resize-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Price Paid (USD)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={simPrice}
                        onChange={(e) => setSimPrice(e.target.value)}
                        required
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none font-bold text-slate-800"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Informative Diagnostic Alert Box */}
              <div className="bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-[12px] leading-relaxed text-slate-600 flex items-start gap-2.5 shadow-inner">
                <Mail className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <strong>💡 How the Testing Process Works:</strong> Running this simulation will bypass live Stripe signature logic (local testing mode), trigger the webhook server action, write the record inside your Supabase <code className="font-mono bg-white dark:bg-slate-800 px-1 py-0.5 rounded font-bold">transactions</code> table, and send emails using Nodemailer.
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                <button
                  type="button"
                  onClick={() => setIsSimulatorOpen(false)}
                  className="px-5 py-2.5 border border-slate-200 text-slate-500 rounded-xl hover:bg-slate-50 font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={simLoading}
                  className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-extrabold text-xs transition-colors flex items-center gap-2 shadow cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {simLoading ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      <span>Processing transaction...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Simulate transaction event</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
