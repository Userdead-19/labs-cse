"use client";

import { useBooking } from "@/context/booking-context";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BookingStats } from "@/components/booking-stats";
import { UpcomingBookings } from "@/components/upcoming-bookings";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function DashboardContent() {
  const {
    totalLabs,
    availableNow,
    userBookings,
    upcomingUserBookings,
    upcomingExamPeriod,
    loading,
    error,
  } = useBooking();
  console.log("DashboardContent", {
    totalLabs,
    availableNow,
    userBookings,
    upcomingUserBookings,
    upcomingExamPeriod,
    loading,
    error,
  });
  if (loading) {
    return <div>Loading dashboard data...</div>;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load dashboard data: {error}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Labs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLabs}</div>
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
            <div className="text-2xl font-bold">{availableNow}</div>
            <p className="text-xs text-muted-foreground">
              {totalLabs - availableNow} labs currently in use
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
              {upcomingExamPeriod
                ? `${new Date(
                    upcomingExamPeriod.startDate
                  ).toLocaleDateString()} - ${new Date(
                    upcomingExamPeriod.endDate
                  ).toLocaleDateString()}`
                : "None scheduled"}
            </div>
            <p className="text-xs text-muted-foreground">
              {upcomingExamPeriod
                ? upcomingExamPeriod.name
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
            <UpcomingBookings limit={3} />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
