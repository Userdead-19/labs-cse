"use client";

import { useState } from "react";
import { DashboardHeader } from "@/components/dashboard-header";
import { DashboardShell } from "@/components/dashboard-shell";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UpcomingBookings } from "@/components/upcoming-bookings";
import { Button } from "@/components/ui/button";
import { CalendarIcon, ClockIcon } from "lucide-react";
import Link from "next/link";

export default function MyBookingsPage() {
  const [activeTab, setActiveTab] = useState("upcoming");

  return (
    <DashboardShell>
      <DashboardHeader
        heading="My Bookings"
        text="Manage your lab booking requests and reservations"
      >
        <Link href="/dashboard/new-booking">
          <Button>New Booking</Button>
        </Link>
      </DashboardHeader>

      <Tabs
        defaultValue="upcoming"
        className="space-y-4"
        onValueChange={setActiveTab}
      >
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past Bookings</TabsTrigger>
          <TabsTrigger value="pending">Pending Requests</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Upcoming Bookings</CardTitle>
                <CardDescription>
                  Your confirmed upcoming lab reservations
                </CardDescription>
              </div>
              <CalendarIcon className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <UpcomingBookings />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="past" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Past Bookings</CardTitle>
                <CardDescription>Your previous lab bookings</CardDescription>
              </div>
              <ClockIcon className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {/* In a real app, you would have a PastBookings component or parameter for UpcomingBookings */}
              <div className="text-center py-8 text-muted-foreground">
                No past bookings found.
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Requests</CardTitle>
              <CardDescription>
                Booking requests awaiting approval
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* In a real app, this would filter to only show pending bookings */}
              <div className="text-center py-8 text-muted-foreground">
                No pending requests found.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  );
}
