"use server";

import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { getSupabaseService } from "@/lib/supabaseService";
import { verifyAdminSession } from "@/lib/adminAuth";
import { randomUUID } from "crypto";

export interface ResumeEducation {
  id: string;
  degree: string;
  institution: string;
  years: string;
  description: string;
  logo: string;
  highlight: boolean;
  display_order: number;
}

export async function getEducation(): Promise<ResumeEducation[]> {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("resume_education")
    .select("*")
    .order("display_order", { ascending: true });

  if (error) {
    console.error("Error fetching education:", error);
    return [];
  }

  return data || [];
}

export async function saveEducation(education: ResumeEducation) {
  if (!(await verifyAdminSession())) {
    return { success: false, error: "Unauthorized access: Admin privileges required." };
  }

  const supabase = getSupabaseService();
  const isNew = !education.id || education.id.startsWith("new-");
  
  const payload = {
    id: isNew ? randomUUID() : education.id,
    degree: education.degree,
    institution: education.institution,
    years: education.years,
    description: education.description,
    logo: education.logo,
    highlight: education.highlight,
    display_order: education.display_order,
  };

  const { error } = await supabase
    .from("resume_education")
    .upsert(payload, { onConflict: "id" });

  if (error) {
    console.error("Error saving education:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function deleteEducation(id: string) {
  if (!(await verifyAdminSession())) {
    return { success: false, error: "Unauthorized access: Admin privileges required." };
  }

  const supabase = getSupabaseService();
  const { error } = await supabase
    .from("resume_education")
    .delete()
    .eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

export interface ResumeExperience {
  id: string;
  position: string;
  company: string;
  duration: string;
  description: string;
  type: string;
  is_active: boolean;
  display_order: number;
}

export interface ResumeAwards {
  id: string;
  title: string;
  description: string;
  image: string;
  link: string;
  display_order: number;
}

export async function getExperience(): Promise<ResumeExperience[]> {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("resume_experience")
    .select("*")
    .order("display_order", { ascending: true });

  if (error) {
    console.error("Error fetching experience:", error);
    return [];
  }

  return data || [];
}

export async function saveExperience(exp: ResumeExperience) {
  if (!(await verifyAdminSession())) {
    return { success: false, error: "Unauthorized access" };
  }

  const supabase = getSupabaseService();
  const isNew = !exp.id || exp.id.startsWith("new-");
  
  const payload = {
    id: isNew ? randomUUID() : exp.id,
    position: exp.position,
    company: exp.company,
    duration: exp.duration,
    description: exp.description,
    type: exp.type || 'work',
    is_active: exp.is_active || false,
    display_order: exp.display_order,
  };

  const { error } = await supabase.from("resume_experience").upsert(payload, { onConflict: "id" });
  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function deleteExperience(id: string) {
  if (!(await verifyAdminSession())) return { success: false, error: "Unauthorized access" };
  const supabase = getSupabaseService();
  const { error } = await supabase.from("resume_experience").delete().eq("id", id);
  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function getAwards(): Promise<ResumeAwards[]> {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("resume_awards")
    .select("*")
    .order("display_order", { ascending: true });

  if (error) {
    console.error("Error fetching awards:", error);
    return [];
  }

  return data || [];
}

export async function saveAwards(award: ResumeAwards) {
  if (!(await verifyAdminSession())) return { success: false, error: "Unauthorized access" };

  const supabase = getSupabaseService();
  const isNew = !award.id || award.id.startsWith("new-");
  
  const payload = {
    id: isNew ? randomUUID() : award.id,
    title: award.title,
    description: award.description,
    image: award.image,
    link: award.link,
    display_order: award.display_order,
  };

  const { error } = await supabase.from("resume_awards").upsert(payload, { onConflict: "id" });
  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function deleteAwards(id: string) {
  if (!(await verifyAdminSession())) return { success: false, error: "Unauthorized access" };
  const supabase = getSupabaseService();
  const { error } = await supabase.from("resume_awards").delete().eq("id", id);
  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function getCVUrl(): Promise<string | null> {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("hero_settings")
    .select("button_link")
    .eq("id", "resume_cv")
    .maybeSingle();

  if (error || !data) {
    return null;
  }
  return data.button_link || null;
}

export async function saveCVUrl(url: string) {
  if (!(await verifyAdminSession())) {
    return { success: false, error: "Unauthorized access: Admin privileges required." };
  }

  const supabase = getSupabaseService();
  const payload = {
    id: "resume_cv",
    card_type: "text",
    category: "Settings",
    title: "Resume CV Link",
    button_link: url,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from("hero_settings")
    .upsert(payload);

  if (error) {
    console.error("Error saving CV URL:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}
