import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

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
