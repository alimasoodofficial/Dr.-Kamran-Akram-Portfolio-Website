import { NextResponse } from "next/server";
import { getSupabaseService } from "@/lib/supabaseService";

export async function POST(req: Request) {
  try {
    const { ebookId, accessToken, stripeSessionId, email } = await req.json();

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

    // 2.5. If not authorized yet and plain email is provided, check purchases table (case-insensitive email matching)
    if (!authorized && email) {
      const { data: purchase } = await supabaseService
        .from("purchases")
        .select("*")
        .eq("ebook_id", ebookId)
        .ilike("user_email", email.trim())
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
