import { getSupabaseService } from "@/lib/supabaseService";
import AdminTransactionsClient, { Transaction } from "./AdminTransactionsClient";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

async function getTransactionsData() {
  const serviceClient = getSupabaseService();
  try {
    const { data: transactions, error } = await serviceClient
      .from("transactions")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (error) {
      console.error("Error fetching transactions:", error);
      return { transactions: [], ebooks: [], tableMissing: true };
    }

    // Also fetch first 10 ebooks for simulator context
    const { data: ebooks } = await serviceClient
      .from("ebooks")
      .select("id, title")
      .limit(10);

    return { 
      transactions: (transactions ?? []) as Transaction[], 
      ebooks: ebooks ?? [], 
      tableMissing: false 
    };
  } catch (err) {
    console.error("Failed to query transactions:", err);
    return { transactions: [], ebooks: [], tableMissing: true };
  }
}

function LoadingSkeleton() {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin" />
      <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Loading Ledger...</p>
    </div>
  );
}

export default async function AdminTransactions() {
  const { transactions, ebooks, tableMissing } = await getTransactionsData();

  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <AdminTransactionsClient
        initialTransactions={transactions}
        ebooks={ebooks || []}
        tableMissing={tableMissing}
      />
    </Suspense>
  );
}
