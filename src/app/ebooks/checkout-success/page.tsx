import React from "react";
import Link from "next/link";
import Stripe from "stripe";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { CheckCircle2, Download, BookOpen, ChevronRight, Mail, Calendar, CreditCard } from "lucide-react";
import BookCard from "@/components/ui/BookCard";
import { slugify } from "@/lib/utils";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2022-11-15" as any,
});

interface SuccessPageProps {
  searchParams: Promise<{ session_id?: string }>;
}

async function getPurchaseDetails(sessionId: string) {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const ebookId = session.metadata?.ebookId;
    const email = session.metadata?.customerEmail || session.customer_email || "";

    if (!ebookId) return { session, ebook: null, email };

    const supabase = createSupabaseServerClient();
    const { data: ebook } = await supabase
      .from("ebooks")
      .select("*")
      .eq("id", ebookId)
      .single();

    return {
      session,
      ebook: ebook || null,
      email
    };
  } catch (err) {
    console.error("Error retrieving Stripe session or ebook:", err);
    return { session: null, ebook: null, email: "" };
  }
}

export default async function CheckoutSuccessPage({ searchParams }: SuccessPageProps) {
  const { session_id } = await searchParams;

  if (!session_id) {
    return (
      <div className="min-h-screen pt-36 pb-20 flex items-center justify-center bg-gradient-to-br from-slate-50 to-emerald-50/20 dark:from-gray-950 dark:to-slate-950 px-4">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 text-center space-y-6 shadow-xl">
          <div className="p-3 bg-rose-500/10 text-rose-500 rounded-full w-fit mx-auto">
            <CheckCircle2 className="w-10 h-10 rotate-180" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Session Missing</h1>
          <p className="text-sm text-slate-500">We could not locate your payment session. Please check your purchase confirmation email or navigate back to the e-book store.</p>
          <Link href="/ebooks" className="block w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl">
            Return to Store
          </Link>
        </div>
      </div>
    );
  }

  const { session, ebook, email } = await getPurchaseDetails(session_id);

  if (!session || !ebook) {
    return (
      <div className="min-h-screen pt-36 pb-20 flex items-center justify-center bg-gradient-to-br from-slate-50 to-emerald-50/20 dark:from-gray-950 dark:to-slate-950 px-4">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 text-center space-y-6 shadow-xl">
          <div className="p-3 bg-amber-500/10 text-amber-500 rounded-full w-fit mx-auto animate-bounce">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Payment Confirmed</h1>
          <p className="text-sm text-slate-500">Your order has been authorized, but we are still assembling your digital copy. Please check your email inbox in 2 minutes for your direct access links.</p>
          <Link href="/ebooks" className="block w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-2xl">
            Return to Store
          </Link>
        </div>
      </div>
    );
  }

  const amountPaid = session.amount_total ? (session.amount_total / 100).toFixed(2) : "0.00";
  const receiptNo = session.payment_intent as string || "N/A";

  return (
    <div className="min-h-screen pt-36 pb-20 bg-gradient-to-br from-slate-50 via-emerald-50/10 to-teal-50/20 dark:from-gray-950 dark:via-slate-950 dark:to-black px-4">
      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Info Column */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 md:p-10 shadow-xl flex flex-col justify-between space-y-8">
          
          <div className="space-y-6">
            <div className="flex items-center gap-3.5">
              <div className="p-2.5 bg-emerald-500 text-white rounded-2xl shadow-lg shadow-emerald-500/20">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-extrabold text-emerald-500 tracking-wider">Purchase Successful</span>
                <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight font-heading">Thank you for your order!</h1>
              </div>
            </div>

            <p className="text-slate-500 text-sm leading-relaxed">
              We have completed your transaction and generated your personalized access tokens. You now have lifetime access to read and download this technical guide.
            </p>

            {/* Receipt Summary Grid */}
            <div className="bg-slate-50 dark:bg-slate-950/40 p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800/40 space-y-3.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-medium flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-emerald-500" />
                  Transaction ID
                </span>
                <span className="text-slate-800 dark:text-slate-200 font-bold truncate max-w-[180px]">{receiptNo.substring(0, 18)}...</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-medium flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-emerald-500" />
                  Order Date
                </span>
                <span className="text-slate-800 dark:text-slate-200 font-bold">
                  {new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-medium flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-emerald-500" />
                  Delivered To
                </span>
                <span className="text-slate-800 dark:text-slate-200 font-bold truncate max-w-[180px]">{email}</span>
              </div>
              <div className="flex justify-between items-center border-t border-slate-200 dark:border-slate-800/80 pt-3 text-xs">
                <span className="text-slate-400 font-bold uppercase tracking-wider">Amount Charged</span>
                <span className="text-emerald-500 font-extrabold text-base">${amountPaid} USD</span>
              </div>
            </div>

            {/* Delivery Alert info */}
            <div className="p-4 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-2xl border border-emerald-500/10 flex gap-3 text-xs leading-relaxed font-semibold">
              <Mail className="w-5 h-5 shrink-0 mt-0.5" />
              <p>We've dispatched a transaction receipt and secure reading links to <strong>{email}</strong>. If you do not see it in 2 minutes, check your spam or promotions folders.</p>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 pt-6">
            <Link 
              href={`/ebooks/${slugify(ebook.title)}/read`}
              className="flex-1 flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-6 py-4 rounded-2xl shadow-xl shadow-emerald-500/20 transition-all hover:scale-102 cursor-pointer"
            >
              <BookOpen className="w-5 h-5" />
              <span>Open Flipbook Reader</span>
            </Link>

            {ebook.file_url && (
              <a 
                href={ebook.file_url}
                target="_blank"
                download
                className="flex-1 flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 dark:bg-slate-950 dark:hover:bg-slate-800 text-white font-bold px-6 py-4 rounded-2xl transition-all hover:scale-102 cursor-pointer border border-slate-200/20"
              >
                <Download className="w-5 h-5 text-emerald-500" />
                <span>Download PDF File</span>
              </a>
            )}
          </div>

        </div>

        {/* Right Preview Column */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl flex flex-col items-center justify-center relative overflow-hidden text-center gap-6">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent -z-10 pointer-events-none" />
          
          <div className="scale-95 md:scale-100 hover:scale-103 transition-transform duration-500">
            <BookCard
              title={ebook.title}
              imageSrc={ebook.cover_url}
              width={200}
              height={275}
              coverColor="bg-gradient-to-br from-emerald-500 to-teal-600"
              coverText="OWNED"
              href="#"
              buttonText="Read Now"
              buttonClassName="hidden"
            />
          </div>

          <div className="space-y-1 mt-4">
            <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Digital Publication</span>
            <h3 className="font-extrabold text-slate-900 dark:text-white line-clamp-2 leading-snug text-lg">{ebook.title}</h3>
          </div>

          <Link
            href="/ebooks"
            className="text-xs text-slate-400 hover:text-slate-900 dark:hover:text-white font-bold inline-flex items-center gap-1.5 mt-2 transition-colors group"
          >
            <span>Back to Publications Store</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

      </div>
    </div>
  );
}
