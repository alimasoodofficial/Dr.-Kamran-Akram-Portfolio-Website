"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { z } from "zod";
import { getSupabaseService } from "@/lib/supabaseService";
import { verifyAdminSession } from "@/lib/adminAuth";
import { revalidatePath } from "next/cache";

const subscribeSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  fullName: z.string().optional(),
});

export type SubscribeState = {
  success?: boolean;
  message?: string;
  error?: string;
} | null;

export async function subscribeAction(
  prevState: SubscribeState,
  formData: FormData
): Promise<SubscribeState> {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Intentionally ignored: setAll is called in a Server Action
            // where cookies cannot be set after the response has started.
          }
        },
      },
    }
  );

  const validation = subscribeSchema.safeParse({
    email: formData.get("email"),
    fullName: formData.get("fullName") || undefined,
  });

  if (!validation.success) {
    return {
      error:
        z.flattenError(validation.error).fieldErrors.email?.[0] ?? "Invalid input.",
    };
  }

  const { email, fullName } = validation.data;

  const { error } = await supabase.from("subscribers").insert([
    {
      email,
      full_name: fullName ?? null,
    },
  ]);

  if (error) {
    // PostgreSQL unique_violation error code
    if (error.code === "23505") {
      return {
        success: true,
        message: "You're already subscribed! 🎉",
      };
    }
    console.error("[subscribeAction] Supabase error:", error.message);
    return { error: "Something went wrong. Please try again later." };
  }

  return { success: true, message: "You're subscribed! Welcome aboard 🚀" };
}

export async function deleteSubscriberAction(id: string) {
  if (!(await verifyAdminSession())) {
    return { success: false, error: "Unauthorized access: Admin privileges required." };
  }
  const supabase = getSupabaseService();
  const { error } = await supabase.from("subscribers").delete().eq("id", id);
  if (error) {
    console.error("[deleteSubscriberAction] Supabase error:", error.message);
    return { success: false, error: error.message };
  }
  revalidatePath("/admin/newsletter");
  return { success: true };
}

export async function unsubscribeByEmailAction(email: string) {
  const supabase = getSupabaseService();
  const { error } = await supabase.from("subscribers").delete().eq("email", email);
  if (error) {
    console.error("[unsubscribeByEmailAction] Supabase error:", error.message);
    return { success: false, error: error.message };
  }
  return { success: true };
}
