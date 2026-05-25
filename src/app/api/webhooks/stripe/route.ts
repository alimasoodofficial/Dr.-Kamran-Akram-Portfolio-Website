import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { sendEbookPurchaseConfirmation } from "@/lib/mail";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2022-11-15" as any,
});

// Disable body parsing so we can read the raw body for signature verification
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const reqText = await req.text();
  const sig = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event: Stripe.Event;

  try {
    if (sig && webhookSecret) {
      event = stripe.webhooks.constructEvent(reqText, sig, webhookSecret);
    } else {
      // Fallback for easy local testing when no webhook secret is set
      const jsonBody = JSON.parse(reqText);
      event = jsonBody as Stripe.Event;
    }
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // Handle completed checkout sessions
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    
    const ebookId = session.metadata?.ebookId;
    const customerEmail = session.metadata?.customerEmail || session.customer_email;

    if (ebookId && customerEmail) {
      console.log(`Processing successful purchase of ebook ${ebookId} by ${customerEmail}`);
      
      try {
        const supabase = createSupabaseServerClient();

        // 1. Get the ebook details from the database
        const { data: ebook, error: fetchError } = await supabase
          .from("ebooks")
          .select("*")
          .eq("id", ebookId)
          .single();

        if (fetchError || !ebook) {
          console.error("Ebook purchased but not found in DB:", fetchError);
          return NextResponse.json({ received: true, error: "Ebook not found" });
        }

        // 2. Increment the download count by +1 in Supabase
        const currentDownloads = Number(ebook.downloads || 0);
        await supabase
          .from("ebooks")
          .update({ downloads: currentDownloads + 1 })
          .eq("id", ebookId);

        // 3. Construct direct link and browser flipbook link
        // Get host for absolute URLs
        const host = req.headers.get("host") || "localhost:3000";
        const protocol = host.startsWith("localhost") ? "http" : "https";
        const origin = `${protocol}://${host}`;
        
        const downloadUrl = ebook.file_url || "";
        const flipbookUrl = `${origin}/free-resources/ebooks/${ebook.id}/read`;

        // 4. Send premium receipt and download details email
        await sendEbookPurchaseConfirmation({
          to: customerEmail,
          ebookTitle: ebook.title,
          ebookCover: ebook.cover_url || "",
          downloadUrl,
          flipbookUrl,
        });

        console.log(`Successfully dispatched ebook download email to ${customerEmail}`);
      } catch (err: any) {
        console.error("Failed to process completed checkout session metadata:", err);
      }
    }
  }

  return NextResponse.json({ received: true });
}
