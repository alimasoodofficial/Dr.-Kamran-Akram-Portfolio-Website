import { NextResponse } from "next/server";
import { getSupabaseService, syncPurchasesForEmail } from "@/lib/supabaseService";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const { ebookId, accessToken, stripeSessionId, libraryToken } = await req.json();

    if (!ebookId) {
      return NextResponse.json({ error: "Missing ebookId" }, { status: 400 });
    }

    const supabaseService = getSupabaseService();
    let authorized = false;
    let userId: string | null = null;
    let userEmail: string | null = null;

    // 1. If accessToken is provided, verify user auth session
    if (accessToken) {
      const { data: userData, error: authError } = await supabaseService.auth.getUser(accessToken);
      if (userData?.user) {
        userId = userData.user.id;
        userEmail = userData.user.email || null;

        // Check if user is Admin
        const { data: profile } = await supabaseService
          .from("profiles")
          .select("is_admin")
          .eq("id", userId)
          .maybeSingle();

        if (profile?.is_admin) {
          authorized = true;
        }

        // If not admin, check purchases by user_id or email
        if (!authorized) {
          if (userEmail) {
            await syncPurchasesForEmail(userEmail);
          }
          const { data: purchase, error: purchaseErr } = await supabaseService
            .from("purchases")
            .select("*")
            .eq("ebook_id", ebookId)
            .or(`user_id.eq.${userId},user_email.ilike.${userEmail}`)
            .maybeSingle();

          if (purchase) {
            authorized = true;

            // If user_id is not set in the purchase record, link it now
            if (!purchase.user_id) {
              await supabaseService
                .from("purchases")
                .update({ user_id: userId })
                .eq("id", purchase.id);
            }
          }
        }
      }
    }

    // 2. If not authorized yet and stripeSessionId is provided, check purchases table
    if (!authorized && stripeSessionId) {
      // Resolve transaction email to run sync
      const { data: tx } = await supabaseService
        .from("transactions")
        .select("customer_email")
        .eq("stripe_session_id", stripeSessionId)
        .eq("item_type", "ebook")
        .maybeSingle();
        
      if (tx?.customer_email) {
        await syncPurchasesForEmail(tx.customer_email);
      }

      const { data: purchase } = await supabaseService
        .from("purchases")
        .select("*")
        .eq("ebook_id", ebookId)
        .eq("stripe_checkout_id", stripeSessionId)
        .maybeSingle();

      if (purchase) {
        authorized = true;

        // If user is also authenticated but purchase user_id wasn't set, link it
        if (userId && !purchase.user_id) {
          await supabaseService
            .from("purchases")
            .update({ user_id: userId })
            .eq("id", purchase.id);
        }
      }
    }

    // 3. If libraryToken is provided, verify HMAC signature & expiration, then check purchases
    if (!authorized && libraryToken) {
      try {
        const secret = process.env.JWT_SECRET || process.env.STRIPE_SECRET_KEY || "kamran_secret_key_123_abc";
        const lastDotIndex = libraryToken.lastIndexOf(".");
        if (lastDotIndex !== -1) {
          const tokenData = libraryToken.substring(0, lastDotIndex);
          const signature = libraryToken.substring(lastDotIndex + 1);
          const expectedSignature = crypto.createHmac("sha256", secret).update(tokenData).digest("hex");
          
          if (signature === expectedSignature) {
            const [tokenEmail, tokenTimestampStr] = tokenData.split(":");
            const tokenTimestamp = Number(tokenTimestampStr);
            const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
            
            // Check token expiration (7 days)
            if (Date.now() - tokenTimestamp <= sevenDaysMs) {
              const sanitizedEmail = tokenEmail.trim().toLowerCase();
              
              await syncPurchasesForEmail(sanitizedEmail);

              const { data: purchase } = await supabaseService
                .from("purchases")
                .select("*")
                .eq("ebook_id", ebookId)
                .ilike("user_email", sanitizedEmail)
                .maybeSingle();

              if (purchase) {
                authorized = true;

                // If user is authenticated but purchase user_id wasn't set, link it
                if (userId && !purchase.user_id) {
                  await supabaseService
                    .from("purchases")
                    .update({ user_id: userId })
                    .eq("id", purchase.id);
                }
              }
            }
          }
        }
      } catch (err) {
        console.error("Error verifying libraryToken in read-token:", err);
      }
    }

    // 3. Retrieve eBook details to check price or get file storage info
    const { data: ebook, error: ebookErr } = await supabaseService
      .from("ebooks")
      .select("*")
      .eq("id", ebookId)
      .single();

    if (ebookErr || !ebook) {
      return NextResponse.json({ error: "Ebook not found" }, { status: 404 });
    }

    // 4. Check if eBook is free (price = 0 or null)
    if (!authorized && (ebook.price === 0 || ebook.price === null)) {
      authorized = true;
    }

    if (!authorized) {
      return NextResponse.json(
        { error: "Access denied. You have not purchased this eBook." },
        { status: 403 }
      );
    }

    // 5. Generate signed URL for vault or return fallback URL
    if (ebook.pdf_storage_path) {
      const { data: signedData, error: signError } = await supabaseService
        .storage
        .from("ebooks-vault")
        .createSignedUrl(ebook.pdf_storage_path, 900); // 15 minutes = 900 seconds

      if (signError || !signedData?.signedUrl) {
        console.error("Error generating signed URL from vault:", signError);
        return NextResponse.json(
          { error: "Failed to generate access URL for the eBook file." },
          { status: 500 }
        );
      }

      return NextResponse.json({ signedUrl: signedData.signedUrl });
    } else if (ebook.file_url) {
      // Fallback for public URLs (e.g. legacy ebooks or external URLs)
      return NextResponse.json({ signedUrl: ebook.file_url });
    } else {
      return NextResponse.json(
        { error: "This eBook does not have a PDF file configured." },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error("Read token generation error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
