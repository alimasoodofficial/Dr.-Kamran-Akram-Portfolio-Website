import { createSupabaseServerClient } from "@/lib/supabaseServer";
import AdminBookingsClient from "./AdminBookingsClient";
import { Suspense } from "react";
import { BookingWithSlot } from "@/types/booking";

// Enable dynamic rendering for admin pages to ensure fresh data
export const dynamic = "force-dynamic";

async function getBookings(): Promise<BookingWithSlot[]> {
  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase
    .from("bookings")
    .select(
      `
      *,
      time_slots (*)
    `,
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching bookings:", error);
    return [];
  }

  return data as BookingWithSlot[];
}

function LoadingSkeleton() {
  return (
    <div className="p-20 flex flex-col items-center justify-center gap-4">
      <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-500 rounded-full animate-spin"></div>
      <p className="text-slate-400">Loading your schedule...</p>
    </div>
  );
}

export default async function BookingsAdminPage() {
  const bookings = await getBookings();

  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <AdminBookingsClient initialBookings={bookings} />
    </Suspense>
  );
}
