import AdminBookingsClient from "./AdminBookingsClient";
import { Suspense } from "react";
import { getBookings } from "@/app/actions/bookings";
import { getAvailability, getBlockedDates } from "@/app/actions/availability";

// Enable dynamic rendering for admin pages to ensure fresh data
export const dynamic = "force-dynamic";

async function getInitialData() {
  const [bookings, availability, blockedDates] = await Promise.all([
    getBookings(),
    getAvailability(),
    getBlockedDates()
  ]);

  return {
    bookings,
    availability,
    blockedDates
  };
}

function LoadingSkeleton() {
  return (
    <div className="p-20 flex flex-col items-center justify-center gap-4">
      <div className="w-10 h-10 border-4 border-slate-200 border-t-primary rounded-full animate-spin"></div>
      <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Loading Schedule...</p>
    </div>
  );
}

export default async function BookingsAdminPage() {
  const { bookings, availability, blockedDates } = await getInitialData();

  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <AdminBookingsClient 
        initialBookings={bookings} 
        initialAvailability={availability} 
        initialBlockedDates={blockedDates} 
      />
    </Suspense>
  );
}
