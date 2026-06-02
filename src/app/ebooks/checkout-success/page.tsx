import React from "react";
import { headers } from "next/headers";
import { confirmEbookPurchase } from "@/app/actions/payments";
import CheckoutSuccessClient from "./CheckoutSuccessClient";

interface SuccessPageProps {
  searchParams: Promise<{ session_id?: string }>;
}

export default async function CheckoutSuccessPage({ searchParams }: SuccessPageProps) {
  const { session_id } = await searchParams;

  let initialData = null;
  if (session_id) {
    const host = (await headers()).get("host") || "imkamran.com";
    const protocol = host.startsWith("localhost") ? "http" : "https";
    const origin = `${protocol}://${host}`;

    const result = await confirmEbookPurchase(session_id, origin);
    if (result.success && result.purchaseDetails) {
      initialData = result.purchaseDetails;
    }
  }

  return <CheckoutSuccessClient initialData={initialData} />;
}

