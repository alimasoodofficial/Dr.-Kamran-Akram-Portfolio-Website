"use server";

import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { getSupabaseService } from "@/lib/supabaseService";
import { verifyAdminSession } from "@/lib/adminAuth";
import { sendMeetingInvitation } from "@/lib/mail";
import { generateMeetingLink } from "@/lib/meetings";

export interface Booking {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  date: string;
  time_slot: string;
  platform: "Zoom" | "Google Meet" | "Meeting";
  duration: 15 | 30 | 60;
  country?: string;
  status: "pending" | "confirmed" | "cancelled";
  created_at: string;
}

const mapDbToBooking = (dbRow: any): Booking => {
  const startTime = dbRow.time_slots?.start_time || dbRow.start_time || dbRow.created_at;
  const startDate = startTime ? new Date(startTime) : new Date();
  
  let clientMessage = dbRow.notes || "";
  if (clientMessage.startsWith("stripe_session_id:")) {
    const parts = clientMessage.split("\n\n");
    if (parts.length > 1) {
      clientMessage = parts.slice(1).join("\n\n");
    } else {
      const lines = clientMessage.split("\n");
      clientMessage = lines.slice(1).join("\n");
    }
  }
  
  return {
    id: dbRow.id,
    full_name: dbRow.user_name || dbRow.full_name || "",
    email: dbRow.user_email || dbRow.email || "",
    phone: "",
    service: "",
    message: clientMessage,
    date: startTime ? `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, '0')}-${String(startDate.getDate()).padStart(2, '0')}` : "",
    time_slot: startTime ? `${String(startDate.getHours()).padStart(2, '0')}:${String(startDate.getMinutes()).padStart(2, '0')}` : "",
    platform: dbRow.meeting_platform || "Zoom",
    duration: dbRow.duration || dbRow.duration_minutes || 30,
    status: dbRow.status || "pending",
    created_at: dbRow.created_at,
  };
};

export async function createBooking(data: Omit<Booking, "id" | "status" | "created_at"> & { stripe_session_id?: string }) {
  const supabase = getSupabaseService();
  
  const [hours, minutes] = data.time_slot.split(':').map(Number);
  const [year, month, day] = data.date.split('-').map(Number);
  const startTimeObj = new Date(year, month - 1, day, hours, minutes);
  const endTimeObj = new Date(startTimeObj.getTime() + data.duration * 60000);

  // Generate meeting link
  const meetingLink = await generateMeetingLink(data.platform, {
    topic: `Consultation: ${data.full_name}`,
    startTime: startTimeObj.toISOString(),
    duration: data.duration,
    userEmail: data.email
  });

  // Find or create a time slot for this time
  const { data: slot, error: slotError } = await supabase
    .from("time_slots")
    .select("id, is_booked")
    .eq("start_time", startTimeObj.toISOString())
    .maybeSingle();

  if (slotError) {
    return { success: false, error: "Failed to verify time slots." };
  }

  let finalSlotId = "";

  if (!slot) {
    const { data: newSlot, error: createSlotError } = await supabase
      .from("time_slots")
      .insert([{
        start_time: startTimeObj.toISOString(),
        end_time: endTimeObj.toISOString(),
        is_booked: true
      }])
      .select()
      .single();

    if (createSlotError || !newSlot) {
      console.error("Error creating slot in createBooking:", createSlotError);
      return { success: false, error: "Failed to create a time slot for this booking." };
    }
    finalSlotId = newSlot.id;
  } else {
    if (slot.is_booked) {
      return { success: false, error: "This time slot is already booked." };
    }
    
    const { error: updateSlotError } = await supabase
      .from("time_slots")
      .update({ is_booked: true })
      .eq("id", slot.id);

    if (updateSlotError) {
      console.error("Error updating slot in createBooking:", updateSlotError);
      return { success: false, error: "Failed to reserve the time slot." };
    }
    finalSlotId = slot.id;
  }

  // Save to DB
  const { data: booking, error } = await supabase
    .from("bookings")
    .insert([{ 
      slot_id: finalSlotId,
      user_name: data.full_name,
      user_email: data.email,
      meeting_platform: data.platform === "Meeting" ? "Zoom" : data.platform,
      duration: data.duration,
      meeting_link: meetingLink,
      status: "confirmed",
      notes: data.message,
      message: data.stripe_session_id || null
    }])
    .select()
    .single();

  if (error) {
    console.error("Error inserting booking in createBooking:", error);
    // Rollback: mark slot as available
    await supabase
      .from("time_slots")
      .update({ is_booked: false })
      .eq("id", finalSlotId);

    return { success: false, error: error.message };
  }

  // Send Invitation Email
  await sendMeetingInvitation({
    to: data.email,
    name: data.full_name,
    date: data.date,
    time: data.time_slot,
    duration: data.duration,
    platform: data.platform,
    meetingLink: meetingLink
  });
  
  return { 
    success: true, 
    booking: {
      id: booking.id,
      fullName: data.full_name,
      email: data.email,
      date: data.date,
      timeSlot: data.time_slot,
      platform: data.platform,
      duration: data.duration,
      meetingLink: meetingLink
    }
  };
}

export async function getBookings(): Promise<Booking[]> {
  const supabase = getSupabaseService();
  const { data, error } = await supabase
    .from("bookings")
    .select(`
      *,
      time_slots (
        start_time,
        end_time
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching bookings:", error);
    return [];
  }

  return (data || []).map(mapDbToBooking);
}

export async function updateBookingStatus(id: string, status: string) {
  if (!(await verifyAdminSession())) {
    return { success: false, error: "Unauthorized access: Admin privileges required." };
  }
  const supabase = getSupabaseService();
  const { error } = await supabase
    .from("bookings")
    .update({ status })
    .eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function deleteBooking(id: string) {
  if (!(await verifyAdminSession())) {
    return { success: false, error: "Unauthorized access: Admin privileges required." };
  }
  const supabase = getSupabaseService();
  
  const { data: booking, error: fetchError } = await supabase
    .from("bookings")
    .select("slot_id")
    .eq("id", id)
    .maybeSingle();

  const slotId = booking?.slot_id;

  const { error } = await supabase.from("bookings").delete().eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  if (slotId) {
    await supabase
      .from("time_slots")
      .update({ is_booked: false })
      .eq("id", slotId);
  }

  return { success: true };
}

export async function updateBooking(id: string, data: Partial<Omit<Booking, "id" | "created_at">>) {
  if (!(await verifyAdminSession())) {
    return { success: false, error: "Unauthorized access: Admin privileges required." };
  }
  const supabase = getSupabaseService();
  
  const updatePayload: any = {};
  if (data.full_name) updatePayload.user_name = data.full_name;
  if (data.email) updatePayload.user_email = data.email;
  if (data.message !== undefined) updatePayload.notes = data.message;
  if (data.status) updatePayload.status = data.status;
  if (data.platform) updatePayload.meeting_platform = data.platform;
  if (data.duration) updatePayload.duration = data.duration;

  if (data.date && data.time_slot) {
    const [hours, minutes] = data.time_slot.split(':').map(Number);
    const [year, month, day] = data.date.split('-').map(Number);
    const startTimeObj = new Date(year, month - 1, day, hours, minutes);
    const duration = data.duration || 30;
    const endTimeObj = new Date(startTimeObj.getTime() + duration * 60000);
    
    const { data: currentBooking, error: fetchError } = await supabase
      .from("bookings")
      .select("slot_id")
      .eq("id", id)
      .maybeSingle();

    if (fetchError || !currentBooking) {
      return { success: false, error: "Booking not found" };
    }

    const oldSlotId = currentBooking.slot_id;

    const { data: slot, error: slotError } = await supabase
      .from("time_slots")
      .select("id, is_booked")
      .eq("start_time", startTimeObj.toISOString())
      .maybeSingle();

    if (slotError) {
      return { success: false, error: "Failed to verify time slots." };
    }

    let finalSlotId = "";

    if (!slot) {
      const { data: newSlot, error: createSlotError } = await supabase
        .from("time_slots")
        .insert([{
          start_time: startTimeObj.toISOString(),
          end_time: endTimeObj.toISOString(),
          is_booked: true
        }])
        .select()
        .single();

      if (createSlotError || !newSlot) {
        return { success: false, error: "Failed to create a time slot for this booking." };
      }
      finalSlotId = newSlot.id;
    } else {
      if (slot.id !== oldSlotId && slot.is_booked) {
        return { success: false, error: "The new time slot is already booked." };
      }
      
      await supabase
        .from("time_slots")
        .update({ is_booked: true })
        .eq("id", slot.id);
        
      finalSlotId = slot.id;
    }

    updatePayload.slot_id = finalSlotId;

    if (oldSlotId && oldSlotId !== finalSlotId) {
      await supabase
        .from("time_slots")
        .update({ is_booked: false })
        .eq("id", oldSlotId);
    }
  }

  const { error } = await supabase
    .from("bookings")
    .update(updatePayload)
    .eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function rescheduleBooking(id: string, newStartTime: string, durationMinutes: 30 | 60 = 30) {
  if (!(await verifyAdminSession())) {
    return { success: false, error: "Unauthorized access: Admin privileges required." };
  }
  const supabase = getSupabaseService();
  const startObj  = new Date(newStartTime);
  const endObj    = new Date(startObj.getTime() + durationMinutes * 60000);

  const { data: currentBooking, error: fetchError } = await supabase
    .from("bookings")
    .select("slot_id")
    .eq("id", id)
    .maybeSingle();

  if (fetchError || !currentBooking) {
    return { success: false, error: "Booking not found" };
  }

  const oldSlotId = currentBooking.slot_id;

  const { data: slot, error: slotError } = await supabase
    .from("time_slots")
    .select("id, is_booked")
    .eq("start_time", startObj.toISOString())
    .maybeSingle();

  if (slotError) {
    return { success: false, error: "Failed to verify time slots." };
  }

  let finalSlotId = "";

  if (!slot) {
    const { data: newSlot, error: createSlotError } = await supabase
      .from("time_slots")
      .insert([{
        start_time: startObj.toISOString(),
        end_time: endObj.toISOString(),
        is_booked: true
      }])
      .select()
      .single();

    if (createSlotError || !newSlot) {
      return { success: false, error: "Failed to create time slot." };
    }
    finalSlotId = newSlot.id;
  } else {
    if (slot.id !== oldSlotId && slot.is_booked) {
      return { success: false, error: "The new time slot is already booked." };
    }
    await supabase
      .from("time_slots")
      .update({ is_booked: true })
      .eq("id", slot.id);
    finalSlotId = slot.id;
  }

  const { error } = await supabase
    .from("bookings")
    .update({
      slot_id: finalSlotId,
      status: "confirmed",
    })
    .eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  if (oldSlotId && oldSlotId !== finalSlotId) {
    await supabase
      .from("time_slots")
      .update({ is_booked: false })
      .eq("id", oldSlotId);
  }

  return { success: true };
}
