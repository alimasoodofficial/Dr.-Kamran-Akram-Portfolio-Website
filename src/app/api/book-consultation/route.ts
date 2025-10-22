import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const filePath = path.join(process.cwd(), "data", "bookings.json");

    // Ensure folder exists
    if (!fs.existsSync(path.dirname(filePath))) {
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
    }

    // Read existing bookings
    let existing = [];
    if (fs.existsSync(filePath)) {
      const fileData = fs.readFileSync(filePath, "utf-8");
      existing = JSON.parse(fileData || "[]");
    }

    // Add new booking
    const newBooking = { ...data, id: Date.now() };
    existing.push(newBooking);

    // Save back to file
    fs.writeFileSync(filePath, JSON.stringify(existing, null, 2));

    return NextResponse.json({ success: true, message: "Booking saved!" });
  } catch (error) {
    console.error("Error saving booking:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
