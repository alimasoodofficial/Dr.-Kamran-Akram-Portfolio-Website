import { NextResponse } from "next/server";

// 🧠 Mock availability data (could come from DB)
const availability: Record<string, string[]> = {
  "2025-10-29": ["09:00 AM", "10:00 AM", "02:00 PM"],
  "2025-10-30": ["11:00 AM", "03:00 PM", "04:00 PM"],
  "2025-10-31": ["09:00 AM", "01:00 PM", "05:00 PM"],
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");

  // If date exists in our data, return those slots; otherwise, empty list
  const slots = date && availability[date] ? availability[date] : [];

  return NextResponse.json({ date, availableTimes: slots });
}
