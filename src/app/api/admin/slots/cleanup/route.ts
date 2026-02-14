import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const { data, error } = await supabaseAdmin.rpc("cleanup_old_unbooked_slots");

    if (error) throw error;

    return NextResponse.json({ 
      success: true, 
      count: data 
    });
  } catch (error: any) {
    console.error("Error cleaning up slots:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
