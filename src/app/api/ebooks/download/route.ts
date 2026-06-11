import { NextResponse } from "next/server";

export async function POST(req: Request) {
  return NextResponse.json(
    { error: "Direct PDF downloads are disabled. Please use the interactive flipbook reader." },
    { status: 403 }
  );
}
