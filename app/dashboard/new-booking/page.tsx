import { Suspense } from "react";
import { DashboardHeader } from "@/components/dashboard-header";
import { DashboardShell } from "@/components/dashboard-shell";
import { NewBookingForm } from "@/components/new-booking-form";
import { Skeleton } from "@/components/ui/skeleton";
import { BookingProvider } from "@/context/booking-context";

export default function NewBookingPage() {
  return (
    <BookingProvider>
      <DashboardShell>
        <DashboardHeader
          heading="New Booking"
          text="Create a new lab booking request"
        />
        <div className="grid gap-8">
          <Suspense fallback={<Skeleton className="h-[500px] w-full" />}>
            <NewBookingForm />
          </Suspense>
        </div>
      </DashboardShell>
    </BookingProvider>
  );
}
