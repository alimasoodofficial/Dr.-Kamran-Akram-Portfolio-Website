import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const { start_date, end_date, start_hour, end_hour, slot_duration_minutes } = await request.json();

    if (!start_date || !end_date) {
      return NextResponse.json({ error: "Start and end dates are required" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin.rpc("generate_time_slots", {
      start_date,
      end_date,
      start_hour,
      end_hour,
      slot_duration_minutes,
    });

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("Error generating slots:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Slot ID is required" }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from("time_slots")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting slot:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
