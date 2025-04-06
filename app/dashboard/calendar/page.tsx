"use client";

import { DashboardHeader } from "@/components/dashboard-header";
import { DashboardShell } from "@/components/dashboard-shell";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CalendarView } from "@/components/calendar-view";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function CalendarPage() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Lab Calendar"
        text="View and manage lab availability and bookings"
      />
      <Card>
        <CardHeader>
          <CardTitle>Lab Schedule</CardTitle>
          <CardDescription>
            View lab bookings and availability across all labs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<Skeleton className="h-[600px] w-full" />}>
            <CalendarView />
          </Suspense>
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
