import { Suspense } from "react";
import StatusClient from "@/components/sections/StatusClient";
import Loading from "@/app/loading";

export const dynamic = "force-dynamic";

export default function BookingStatusPage() {
  return (
    <div className="pt-24 pb-12 bg-[#0b0c12] min-h-screen text-white">
      <Suspense fallback={<Loading />}>
        <StatusClient />
      </Suspense>
    </div>
  );
}
