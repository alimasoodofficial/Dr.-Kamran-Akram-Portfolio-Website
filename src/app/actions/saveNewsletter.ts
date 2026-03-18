"use server";

import { getSupabaseService } from "@/lib/supabaseService";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { sendNewsletterEmails } from "@/lib/sendNewsletterEmail";
import { headers } from "next/headers";

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------
const newsletterSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().optional(),
  hero_image_url: z.string().url("Invalid image URL").optional().or(z.literal("")),
  content: z.string().min(1, "Content is required"),
  status: z.enum(["draft", "published"]).default("draft"),
});

export type SaveNewsletterState = {
  success?: boolean;
  id?: string;
  error?: string;
} | null;

// ---------------------------------------------------------------------------
// Server Action
// ---------------------------------------------------------------------------
export async function saveNewsletter(
  prevState: SaveNewsletterState,
  formData: FormData
): Promise<SaveNewsletterState> {
  const supabase = getSupabaseService();
  const host = (await headers()).get("host");
  const protocol = host?.includes("localhost") ? "http" : "https";
  const baseUrl = `${protocol}://${host}`;

  const raw = {
    id: (formData.get("id") as string) || undefined,
    title: formData.get("title") as string,
    subtitle: (formData.get("subtitle") as string) || undefined,
    hero_image_url: (formData.get("hero_image_url") as string) || undefined,
    content: formData.get("content") as string,
    status: (formData.get("status") as string) || "draft",
  };

  const validation = newsletterSchema.safeParse(raw);
  if (!validation.success) {
    const firstError = Object.values(
      z.flattenError(validation.error).fieldErrors
    )[0]?.[0];
    return { error: firstError ?? "Invalid form data." };
  }

  const { id, ...payload } = validation.data;

  // Function to notify subscribers
  const notifySubscribers = async (newsletterId: string) => {
    if (payload.status === "published") {
      const { data: subscribers } = await supabase
        .from("subscribers")
        .select("email");

      if (subscribers && subscribers.length > 0) {
        const emails = subscribers.map((s) => s.email);
        await sendNewsletterEmails(
          emails,
          {
            id: newsletterId,
            title: payload.title,
            subtitle: payload.subtitle,
            hero_image_url: payload.hero_image_url,
            content: payload.content,
          },
          baseUrl
        );
      }
    }
  };

  if (id) {
    // UPDATE
    const { error } = await supabase
      .from("newsletters")
      .update({ ...payload, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) return { error: error.message };

    // Notify if status changed to published (or stays published on update)
    await notifySubscribers(id);

    revalidatePath("/admin/newsletter");
    revalidatePath(`/newsletter/${id}`);
    return { success: true, id };
  } else {
    // INSERT
    const { data, error } = await supabase
      .from("newsletters")
      .insert([payload])
      .select("id")
      .single();

    if (error) return { error: error.message };

    // Notify if first time published
    await notifySubscribers(data.id);

    revalidatePath("/admin/newsletter");
    return { success: true, id: data.id };
  }
}
