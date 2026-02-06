import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";

// ✅ Ensure Windows & Mac paths both work
const dataDir = path.join(process.cwd(), "data");
const filePath = path.join(dataDir, "bookings.json");

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("📩 Received booking data:", body);

    const { name, email, phone, date, time, message, timezone } = body;

    // ✅ Validate required fields
    if (!name || !email || !date || !time) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // ✅ Make sure /data folder exists
    await fs.mkdir(dataDir, { recursive: true });

    // ✅ Read old data (or initialize)
    let existing: any[] = [];
    try {
      const raw = await fs.readFile(filePath, "utf-8");
      existing = JSON.parse(raw);
    } catch (err) {
      console.warn("⚠️ No existing file, creating new one");
      existing = [];
    }

    // ✅ Create new booking
    const newBooking = {
      id: Date.now(),
      name,
      email,
      phone,
      message,
      date: new Date(date).toISOString(),
      time,
      timezone,
      createdAt: new Date().toISOString(),
    };

    existing.push(newBooking);

    // ✅ Write to file safely
    await fs.writeFile(filePath, JSON.stringify(existing, null, 2), "utf-8");

    console.log("✅ Booking saved successfully!");
    return NextResponse.json({ success: true, booking: newBooking });
  } catch (err) {
    console.error("❌ Error saving booking:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
