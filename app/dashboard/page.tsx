export const dynamic = "force-dynamic";

import { Suspense } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarView } from "@/components/calendar-view";
import { BookingStats } from "@/components/booking-stats";
import { UpcomingBookings } from "@/components/upcoming-bookings";
import { DashboardHeader } from "@/components/dashboard-header";
import { DashboardShell } from "@/components/dashboard-shell";
import { Skeleton } from "@/components/ui/skeleton";

// Loading component for Suspense
function DashboardLoading() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                <Skeleton className="h-4 w-24" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                <Skeleton className="h-8 w-16" />
              </div>
              <p className="text-xs text-muted-foreground">
                <Skeleton className="h-4 w-32 mt-1" />
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>
              <Skeleton className="h-6 w-32" />
            </CardTitle>
            <CardDescription>
              <Skeleton className="h-4 w-48" />
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[350px] w-full" />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>
              <Skeleton className="h-6 w-32" />
            </CardTitle>
            <CardDescription>
              <Skeleton className="h-4 w-48" />
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Fetch dashboard data
async function getDashboardData() {
  try {
    // In a real app, these would be API calls to your backend
    const labsRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/labs`,
      {
        next: { revalidate: 60 },
        cache: "no-store",
      }
    );
    const bookingsRes = await fetch(
      `${
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
      }/api/bookings`,
      {
        next: { revalidate: 60 },
        cache: "no-store",
      }
    );
    const examPeriodsRes = await fetch(
      `${
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
      }/api/exam-periods`,
      {
        next: { revalidate: 60 },
        cache: "no-store",
      }
    );

    const [labs, bookings, examPeriods] = await Promise.all([
      labsRes.ok ? labsRes.json() : [],
      bookingsRes.ok ? bookingsRes.json() : [],
      examPeriodsRes.ok ? examPeriodsRes.json() : [],
    ]);

    // Calculate stats
    const totalLabs = labs.length || 0;
    const availableNow =
      totalLabs -
      (bookings.filter(
        (b: { date: string; startTime: number; endTime: number }) => {
          const now = new Date();
          const today = now.toISOString().split("T")[0];
          const currentHour =
            now.getHours().toString().padStart(2, "0") + ":00";
          return (
            b.date === today &&
            b.startTime <= parseInt(currentHour, 10) &&
            b.endTime > parseInt(currentHour, 10)
          );
        }
      ).length || 0);

    // Get upcoming exam period
    const upcomingExamPeriod = examPeriods
      .filter(
        (p: { startDate: string | number | Date }) =>
          new Date(p.startDate) > new Date()
      )
      .sort(
        (
          a: { startDate: string | number | Date },
          b: { startDate: string | number | Date }
        ) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
      )[0];

    return {
      totalLabs,
      availableNow,
      bookings: bookings || [],
      upcomingExamPeriod,
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    // Return default values if there's an error
    return {
      totalLabs: 0,
      availableNow: 0,
      bookings: [],
      upcomingExamPeriod: null,
    };
  }
}

export default function DashboardPage() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Dashboard"
        text="Manage your lab bookings and view availability"
      >
        <Link href="/dashboard/new-booking">
          <Button>New Booking</Button>
        </Link>
      </DashboardHeader>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="my-bookings">My Bookings</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <Suspense fallback={<DashboardLoading />}>
            <DashboardContent />
          </Suspense>
        </TabsContent>
        <TabsContent value="calendar" className="space-y-4">
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle>Lab Calendar</CardTitle>
              <CardDescription>
                View and manage lab availability
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<Skeleton className="h-[500px] w-full" />}>
                <CalendarView />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="my-bookings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>My Bookings</CardTitle>
              <CardDescription>Manage your lab bookings</CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
                <UpcomingBookings userId={2} />{" "}
                {/* In a real app, this would be the current user's ID */}
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Utilization Reports</CardTitle>
              <CardDescription>
                Analytics and insights on lab usage
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
                <BookingStats />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  );
}

// Dashboard content component
async function DashboardContent() {
  const data = await getDashboardData();

  // Get user bookings (in a real app, this would be filtered by the current user's ID)
  const userBookings = data.bookings.filter(
    (b: { userId: number }) => b.userId === 2
  );
  const upcomingUserBookings = userBookings.filter(
    (b: { date: string | number | Date }) => {
      const bookingDate = new Date(b.date);
      const today = new Date();
      return bookingDate >= today;
    }
  ).length;

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Labs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalLabs}</div>
            <p className="text-xs text-muted-foreground">
              Across all buildings
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Now</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.availableNow}</div>
            <p className="text-xs text-muted-foreground">
              {data.totalLabs - data.availableNow} labs currently in use
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Your Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userBookings.length}</div>
            <p className="text-xs text-muted-foreground">
              {upcomingUserBookings} upcoming
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Exam Period</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.upcomingExamPeriod
                ? `${new Date(
                    data.upcomingExamPeriod.startDate
                  ).toLocaleDateString()} - ${new Date(
                    data.upcomingExamPeriod.endDate
                  ).toLocaleDateString()}`
                : "None scheduled"}
            </div>
            <p className="text-xs text-muted-foreground">
              {data.upcomingExamPeriod
                ? data.upcomingExamPeriod.name
                : "No upcoming exam periods"}
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Weekly Overview</CardTitle>
            <CardDescription>
              Lab utilization for the current week
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <BookingStats />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Upcoming Bookings</CardTitle>
            <CardDescription>Your scheduled lab sessions</CardDescription>
          </CardHeader>
          <CardContent>
            <UpcomingBookings userId={2} limit={3} />{" "}
            {/* In a real app, this would be the current user's ID */}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
