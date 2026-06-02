import React from "react";
import Stripe from "stripe";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import CheckoutSuccessClient from "./CheckoutSuccessClient";

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

    if (!ebookId) return null;

    const supabase = createSupabaseServerClient();
    const { data: ebook } = await supabase
      .from("ebooks")
      .select("id, title, cover_url, file_url")
      .eq("id", ebookId)
      .single();

    if (!ebook) return null;

    const amountPaid = session.amount_total ? (session.amount_total / 100).toFixed(2) : "0.00";
    const receiptNo = (session.payment_intent as string) || "";

    return {
      receiptNo,
      amountPaid,
      email,
      ebook: {
        id: ebook.id,
        title: ebook.title,
        cover_url: ebook.cover_url || null,
        file_url: ebook.file_url || null,
      },
    };
  } catch (err) {
    console.error("Error retrieving Stripe session or ebook:", err);
    return null;
  }
}

export default async function CheckoutSuccessPage({ searchParams }: SuccessPageProps) {
  const { session_id } = await searchParams;

  let initialData = null;
  if (session_id) {
    initialData = await getPurchaseDetails(session_id);
  }

  return <CheckoutSuccessClient initialData={initialData} />;
}
