"use client";

import { useState } from "react";
import { useBooking } from "@/context/booking-context";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import { deleteBooking } from "@/app/dashboard/actions";
import { toast } from "@/components/ui/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface UpcomingBookingsProps {
  limit?: number;
}

export function UpcomingBookings({ limit }: UpcomingBookingsProps) {
  const { userBookings, refreshData, loading, error } = useBooking();
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(
    null
  );

  // Sort bookings by date and time
  const sortedBookings = [...userBookings]
    .filter((booking) => {
      const bookingDate = new Date(booking.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return bookingDate >= today;
    })
    .sort((a, b) => {
      // Sort by date first
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      if (dateA.getTime() !== dateB.getTime()) {
        return dateA.getTime() - dateB.getTime();
      }
      // If same date, sort by start time
      return a.startTime.localeCompare(b.startTime);
    });

  // Apply limit if provided
  const displayedBookings = limit
    ? sortedBookings.slice(0, limit)
    : sortedBookings;

  const handleDeleteBooking = async (id: string) => {
    try {
      setIsDeleting(true);
      setSelectedBookingId(id);

      const result = await deleteBooking(id);

      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        });
        refreshData();
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete booking",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setSelectedBookingId(null);
    }
  };

  if (loading) {
    return <div>Loading your bookings...</div>;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Failed to load bookings: {error}</AlertDescription>
      </Alert>
    );
  }

  if (displayedBookings.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-muted-foreground">You have no upcoming bookings</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {displayedBookings.map((booking) => {
        const bookingDate = new Date(booking.date);
        const formattedDate = bookingDate.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        });
        return (
          <Card key={booking._id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{booking.title}</CardTitle>
                <Badge
                  variant={
                    booking.status === "approved"
                      ? "default"
                      : booking.status === "pending"
                      ? "outline"
                      : "destructive"
                  }
                >
                  {booking.status.charAt(0).toUpperCase() +
                    booking.status.slice(1)}
                </Badge>
              </div>
              <CardDescription>{booking.purpose}</CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="grid gap-2">
                <div className="flex items-center text-sm">
                  <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                  {formattedDate}
                </div>
                <div className="flex items-center text-sm">
                  <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                  {booking.startTime} - {booking.endTime}
                </div>
                <div className="flex items-center text-sm">
                  <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                  Lab: {booking.labId.name}
                </div>

                {booking.studentCount > 0 && (
                  <div className="flex items-center text-sm">
                    <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                    {booking.studentCount} students
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="pt-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{booking.title}</DialogTitle>
                    <DialogDescription>{booking.purpose}</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <span className="text-sm font-medium">Date:</span>
                      <span className="col-span-3">{formattedDate}</span>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <span className="text-sm font-medium">Time:</span>
                      <span className="col-span-3">
                        {booking.startTime} - {booking.endTime}
                      </span>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <span className="text-sm font-medium">Lab:</span>
                      <span className="col-span-3">{booking.labId.name}</span>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <span className="text-sm font-medium">Year Group:</span>
                      <span className="col-span-3">{booking.yearGroup}</span>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <span className="text-sm font-medium">Students:</span>
                      <span className="col-span-3">{booking.studentCount}</span>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <span className="text-sm font-medium">Equipment:</span>
                      <span className="col-span-3">
                        {booking.equipment || "None"}
                      </span>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <span className="text-sm font-medium">Exam:</span>
                      <span className="col-span-3">
                        {booking.isExam ? "Yes" : "No"}
                      </span>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <span className="text-sm font-medium">Status:</span>
                      <span className="col-span-3">
                        <Badge
                          variant={
                            booking.status === "approved"
                              ? "default"
                              : booking.status === "pending"
                              ? "outline"
                              : "destructive"
                          }
                        >
                          {booking.status.charAt(0).toUpperCase() +
                            booking.status.slice(1)}
                        </Badge>
                      </span>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="destructive"
                      onClick={() => handleDeleteBooking(booking._id)}
                      disabled={isDeleting && selectedBookingId === booking._id}
                    >
                      {isDeleting && selectedBookingId === booking._id
                        ? "Deleting..."
                        : "Cancel Booking"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Button
                variant="destructive"
                size="sm"
                className="ml-2"
                onClick={() => handleDeleteBooking(booking._id)}
                disabled={isDeleting && selectedBookingId === booking._id}
              >
                {isDeleting && selectedBookingId === booking._id
                  ? "Deleting..."
                  : "Cancel"}
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
