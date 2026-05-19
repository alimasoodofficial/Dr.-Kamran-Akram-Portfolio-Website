"use server";

import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { getSupabaseService } from "@/lib/supabaseService";
import { verifyAdminSession } from "@/lib/adminAuth";
import { parseISO, addDays, format, addMinutes, isBefore, isSameDay, startOfDay, endOfDay } from "date-fns";
import { randomUUID } from "crypto";

export interface AvailabilitySlot {
  id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_enabled: boolean; 
}

export interface BlockedDate {
  id: string;
  date: string;
  reason: string;
}

export async function getAvailability(): Promise<AvailabilitySlot[]> {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("availability")
    .select("id, day_of_week, start_time, end_time, is_enabled")
    .order("day_of_week", { ascending: true });

  if (error) {
    console.error("Error fetching availability:", error);
    return [];
  }

  return (data || []).map(row => ({
    id: row.id,
    day_of_week: row.day_of_week,
    start_time: row.start_time?.slice(0, 5) || "09:00",
    end_time: row.end_time?.slice(0, 5) || "17:00",
    is_enabled: row.is_enabled ?? false,
  }));
}

export async function updateAvailability(slots: AvailabilitySlot[]) {
  if (!(await verifyAdminSession())) {
    return { success: false, error: "Unauthorized access: Admin privileges required." };
  }

  const supabase = getSupabaseService();

  const mappedSlots = slots.map(slot => ({
    id: String(slot.id).startsWith("new-") ? randomUUID() : slot.id,
    day_of_week: slot.day_of_week,
    start_time: slot.start_time.length === 5 ? slot.start_time + ":00" : slot.start_time,
    end_time:   slot.end_time.length   === 5 ? slot.end_time   + ":00" : slot.end_time,
    is_enabled: slot.is_enabled,
  }));

  const { error } = await supabase
    .from("availability")
    .upsert(mappedSlots, {
      onConflict: "day_of_week",
      ignoreDuplicates: false,
    });

  if (error) {
    console.error("Error saving availability:", error);
    return { success: false, error: error.message || "Unknown database error" };
  }

  return { success: true };
}

export async function getBlockedDates(): Promise<BlockedDate[]> {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("blocked_dates")
    .select("*")
    .order("date", { ascending: true });

  if (error) {
    console.error("Error fetching blocked dates:", error);
    return [];
  }

  return data || [];
}

export async function addBlockedDate(date: string, reason: string) {
  if (!(await verifyAdminSession())) {
    return { success: false, error: "Unauthorized access: Admin privileges required." };
  }

  const supabase = getSupabaseService();
  const { error } = await supabase
    .from("blocked_dates")
    .insert([{ date, reason }]);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function removeBlockedDate(id: string) {
  if (!(await verifyAdminSession())) {
    return { success: false, error: "Unauthorized access: Admin privileges required." };
  }

  const supabase = getSupabaseService();
  const { error } = await supabase
    .from("blocked_dates")
    .delete()
    .eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function saveDateOverride(
  date: string,
  type: "standard" | "off" | "custom",
  startTime?: string,
  endTime?: string
) {
  if (!(await verifyAdminSession())) {
    return { success: false, error: "Unauthorized access: Admin privileges required." };
  }

  const supabase = getSupabaseService();

  if (type === "standard") {
    const { error } = await supabase
      .from("blocked_dates")
      .delete()
      .eq("date", date);
    if (error) return { success: false, error: error.message };
    return { success: true };
  }

  const reason = type === "off" ? "OFF" : `CUSTOM:${startTime}-${endTime}`;

  const { data: existing } = await supabase
    .from("blocked_dates")
    .select("id")
    .eq("date", date)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from("blocked_dates")
      .update({ reason })
      .eq("id", existing.id);
    if (error) return { success: false, error: error.message };
  } else {
    const { error } = await supabase
      .from("blocked_dates")
      .insert([{ date, reason }]);
    if (error) return { success: false, error: error.message };
  }

  return { success: true };
}

export async function getTimeSlots(dateString: string, durationMinutes: number) {
  const supabase = createSupabaseServerClient();

  const [year, month, day] = dateString.split("-").map(Number);
  const requestedDate = new Date(year, month - 1, day);
  const dayOfWeek = requestedDate.getDay();

  // 1. Fetch any blocked_dates/override entries for this date
  const { data: blockedRows } = await supabase
    .from("blocked_dates")
    .select("id, reason")
    .eq("date", dateString);

  const block = blockedRows && blockedRows[0];

  // If the date is completely blocked off (either standard block or explicit OFF)
  if (block && (!block.reason || !block.reason.startsWith("CUSTOM:"))) {
    return []; 
  }

  let start_time = "";
  let end_time = "";
  let is_override_enabled = false;

  // If there is a custom hours override, parse it
  if (block && block.reason && block.reason.startsWith("CUSTOM:")) {
    const timesPart = block.reason.substring(7); // e.g. "09:00-12:30"
    const [customStart, customEnd] = timesPart.split("-");
    if (customStart && customEnd) {
      start_time = customStart;
      end_time = customEnd;
      is_override_enabled = true;
    }
  }

  // If no custom override exists, fallback to standard weekly schedule
  if (!is_override_enabled) {
    const { data: availability, error: availError } = await supabase
      .from("availability")
      .select("id, day_of_week, start_time, end_time, is_enabled")
      .eq("day_of_week", dayOfWeek)
      .single();

    if (availError || !availability || availability.is_enabled === false) {
      return [];
    }

    start_time = availability.start_time;
    end_time = availability.end_time;
  }

  const startOfDayObj = new Date(year, month - 1, day, 0, 0, 0);
  const endOfDayObj   = new Date(year, month - 1, day, 23, 59, 59);

  const { data: existingBookedSlots, error: slotsError } = await supabase
    .from("time_slots")
    .select("start_time, end_time")
    .gte("start_time", startOfDayObj.toISOString())
    .lte("start_time", endOfDayObj.toISOString())
    .eq("is_booked", true);

  if (slotsError) {
    console.error("Failed to fetch booked slots for slot generation:", slotsError);
    return [];
  }

  const [sH, sM] = start_time.split(":").map(Number);
  const [eH, eM] = end_time.split(":").map(Number);

  const workStart = new Date(year, month - 1, day, sH, sM);
  const workEnd   = new Date(year, month - 1, day, eH, eM);

  const availableSlots: any[] = [];
  let currentSlotStart = workStart;

  while (isBefore(currentSlotStart, workEnd)) {
    const currentSlotEnd = addMinutes(currentSlotStart, durationMinutes);

    if (isBefore(workEnd, currentSlotEnd)) break;

    const isOverlapping = (existingBookedSlots || []).some(slot => {
      const slotStart = new Date(slot.start_time);
      const slotEnd   = new Date(slot.end_time);
      return isBefore(currentSlotStart, slotEnd) && isBefore(slotStart, currentSlotEnd);
    });

    const startTimeStr = format(currentSlotStart, "HH:mm:ss");
    const endTimeStr   = format(currentSlotEnd,   "HH:mm:ss");

    availableSlots.push({
      id: startTimeStr,
      date: dateString,
      start_time: startTimeStr,
      end_time:   endTimeStr,
      duration:   durationMinutes,
      is_booked:  isOverlapping,
    });

    currentSlotStart = addMinutes(currentSlotStart, 30);
  }

  return availableSlots;
}

export async function syncTimeSlots(date?: string, duration?: number): Promise<{ success: boolean; error?: string }> {
  return { success: true };
}

export async function syncSlotsForDate(date?: string, start?: string, end?: string): Promise<{ success: boolean; error?: string }> {
  return { success: true };
}
