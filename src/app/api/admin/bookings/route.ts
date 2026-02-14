import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { sendUserRescheduleNotification, sendAdminRescheduleNotification } from "@/lib/email";

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const bookingId = searchParams.get("id");
    const slotId = searchParams.get("slotId");

    if (!bookingId || !slotId) {
      return NextResponse.json({ error: "Booking ID and Slot ID are required" }, { status: 400 });
    }

    // 1. Delete the booking
    const { error: bookingError } = await supabaseAdmin
      .from("bookings")
      .delete()
      .eq("id", bookingId);

    if (bookingError) throw bookingError;

    // 2. Mark the slot as available again
    const { error: slotError } = await supabaseAdmin
      .from("time_slots")
      .update({ is_booked: false })
      .eq("id", slotId);

    if (slotError) throw slotError;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error cancelling booking:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * PATCH - Reschedule a booking to a new time slot
 * Body: { bookingId: string, newSlotId: string }
 */
export async function PATCH(request: NextRequest) {
  try {
    const { bookingId, newSlotId } = await request.json();

    if (!bookingId || !newSlotId) {
      return NextResponse.json(
        { error: "bookingId and newSlotId are required" },
        { status: 400 }
      );
    }

    // 1. Fetch the current booking with its slot info
    const { data: booking, error: bookingFetchError } = await supabaseAdmin
      .from("bookings")
      .select("*, time_slots(*)")
      .eq("id", bookingId)
      .single();

    if (bookingFetchError || !booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    const oldSlotId = booking.slot_id;
    const oldSlot = booking.time_slots;

    // 2. Verify the new slot exists and is not booked
    const { data: newSlot, error: newSlotError } = await supabaseAdmin
      .from("time_slots")
      .select("*")
      .eq("id", newSlotId)
      .single();

    if (newSlotError || !newSlot) {
      return NextResponse.json({ error: "New time slot not found" }, { status: 404 });
    }

    if (newSlot.is_booked) {
      return NextResponse.json(
        { error: "The selected time slot is already booked" },
        { status: 409 }
      );
    }

    // 3. Mark the new slot as booked
    const { error: markNewError } = await supabaseAdmin
      .from("time_slots")
      .update({ is_booked: true })
      .eq("id", newSlotId)
      .eq("is_booked", false);

    if (markNewError) {
      return NextResponse.json({ error: "Failed to book the new slot" }, { status: 500 });
    }

    // 4. Update the booking to point to the new slot
    const { error: updateBookingError } = await supabaseAdmin
      .from("bookings")
      .update({ slot_id: newSlotId })
      .eq("id", bookingId);

    if (updateBookingError) {
      // Rollback: unbook the new slot
      await supabaseAdmin
        .from("time_slots")
        .update({ is_booked: false })
        .eq("id", newSlotId);

      return NextResponse.json({ error: "Failed to update booking" }, { status: 500 });
    }

    // 5. Free up the old slot
    const { error: freeOldError } = await supabaseAdmin
      .from("time_slots")
      .update({ is_booked: false })
      .eq("id", oldSlotId);

    if (freeOldError) {
      console.error("Warning: Failed to free old slot:", freeOldError);
      // Non-critical, continue
    }

    // 6. Send reschedule emails to both admin and client
    const rescheduleData = {
      userName: booking.user_name,
      userEmail: booking.user_email,
      country: booking.country || '',
      oldStartTime: oldSlot.start_time,
      oldEndTime: oldSlot.end_time,
      newStartTime: newSlot.start_time,
      newEndTime: newSlot.end_time,
    };

    Promise.all([
      sendUserRescheduleNotification(rescheduleData).catch((err) =>
        console.error("Failed to send user reschedule email:", err)
      ),
      sendAdminRescheduleNotification(rescheduleData).catch((err) =>
        console.error("Failed to send admin reschedule email:", err)
      ),
    ]);

    return NextResponse.json({
      success: true,
      message: "Booking rescheduled successfully. Notification emails sent.",
      booking: {
        id: bookingId,
        oldSlot: {
          id: oldSlotId,
          startTime: oldSlot.start_time,
          endTime: oldSlot.end_time,
        },
        newSlot: {
          id: newSlotId,
          startTime: newSlot.start_time,
          endTime: newSlot.end_time,
        },
      },
    });
  } catch (error: any) {
    console.error("Error rescheduling booking:", error);
    return NextResponse.json({ error: error.message || "Unexpected error" }, { status: 500 });
  }
}
