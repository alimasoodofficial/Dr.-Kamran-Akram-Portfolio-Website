import { NextResponse } from "next/server";
import { getSupabaseService, syncPurchasesForEmail } from "@/lib/supabaseService";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const { id: ebookId, accessToken, libraryToken, email } = await req.json();

    if (!ebookId) {
      return NextResponse.json({ error: "Missing ebookId" }, { status: 400 });
    }

    const supabaseService = getSupabaseService();

    // 1. Fetch eBook details
    const { data: ebook, error: ebookErr } = await supabaseService
      .from("ebooks")
      .select("*")
      .eq("id", ebookId)
      .single();

    if (ebookErr || !ebook) {
      return NextResponse.json({ error: "Ebook not found" }, { status: 404 });
    }

    // 2. Check if eBook is downloadable
    if (!ebook.is_downloadable) {
      return NextResponse.json(
        { error: "Direct PDF downloads are disabled for this eBook. Please use the interactive flipbook reader." },
        { status: 403 }
      );
    }

    // 3. Determine if eBook is free (price = 0 or null)
    const basePrice = ebook.price !== null ? Number(ebook.price) : 9.99;
    const now = new Date();
    const hasActiveDiscount = 
      ebook.discount_price !== null && 
      Number(ebook.discount_price) > 0 && 
      (!ebook.discount_expires_at || new Date(ebook.discount_expires_at) > now);
      
    const activePrice = hasActiveDiscount ? Number(ebook.discount_price) : basePrice;
    const isFree = activePrice === 0;

    let authorized = isFree; // Authorized if free

    // 4. Verify authorization if not free
    if (!authorized) {
      // Check user authentication using accessToken
      if (accessToken) {
        const { data: userData } = await supabaseService.auth.getUser(accessToken);
        if (userData?.user) {
          const userId = userData.user.id;
          const userEmail = userData.user.email || null;

          // Check if admin
          const { data: profile } = await supabaseService
            .from("profiles")
            .select("is_admin")
            .eq("id", userId)
            .maybeSingle();

          if (profile?.is_admin) {
            authorized = true;
          }

          if (!authorized && userEmail) {
            await syncPurchasesForEmail(userEmail);
            const { data: purchase } = await supabaseService
              .from("purchases")
              .select("*")
              .eq("ebook_id", ebookId)
              .or(`user_id.eq.${userId},user_email.ilike.${userEmail}`)
              .maybeSingle();

            if (purchase) {
              authorized = true;
            }
          }
        }
      }

      // Check libraryToken and email
      if (!authorized && libraryToken && email) {
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
              
              if (tokenEmail === email.trim().toLowerCase() && Date.now() - tokenTimestamp <= sevenDaysMs) {
                const sanitizedEmail = email.trim().toLowerCase();
                await syncPurchasesForEmail(sanitizedEmail);

                const { data: purchase } = await supabaseService
                  .from("purchases")
                  .select("*")
                  .eq("ebook_id", ebookId)
                  .ilike("user_email", sanitizedEmail)
                  .maybeSingle();

                if (purchase) {
                  authorized = true;
                }
              }
            }
          }
        } catch (err) {
          console.error("Error verifying libraryToken in download-token:", err);
        }
      }
    }

    if (!authorized) {
      return NextResponse.json(
        { error: "Access denied. You have not purchased this eBook." },
        { status: 403 }
      );
    }

    // 5. Generate signed URL for vault or return fallback URL
    if (ebook.pdf_storage_path) {
      const downloadFileName = `${ebook.title.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`;
      const { data: signedData, error: signError } = await supabaseService
        .storage
        .from("ebooks-vault")
        .createSignedUrl(ebook.pdf_storage_path, 900, {
          download: downloadFileName
        });

      if (signError || !signedData?.signedUrl) {
        console.error("Error generating signed URL from vault:", signError);
        return NextResponse.json(
          { error: "Failed to generate access URL for the eBook file." },
          { status: 500 }
        );
      }

      return NextResponse.json({ file_url: signedData.signedUrl });
    } else if (ebook.file_url) {
      return NextResponse.json({ file_url: ebook.file_url });
    } else {
      return NextResponse.json(
        { error: "This eBook does not have a PDF file configured." },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error("Download error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
