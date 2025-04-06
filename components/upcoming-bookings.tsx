"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin } from "lucide-react";
import { format, parseISO } from "date-fns";
import { toast } from "@/components/ui/use-toast";
import { deleteBooking } from "@/app/actions/booking-actions";
import { useAuth } from "@/context/AuthContext";

interface UpcomingBookingsProps {
  userId?: number;
  limit?: number;
}

export function UpcomingBookings({ userId, limit }: UpcomingBookingsProps) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const { user } = useAuth(); // Get authenticated user from context

  useEffect(() => {
    async function fetchBookings() {
      try {
        setLoading(true);
        // Build the URL with query parameters
        let url = "/api/bookings";
        const params = new URLSearchParams();

        // Use userId from props if provided, otherwise use authenticated user's ID
        const bookingUserId = userId || user?._id;

        if (bookingUserId) {
          params.append("userId", bookingUserId.toString());
        }

        if (params.toString()) {
          url += `?${params.toString()}`;
        }

        const response = await fetch(url, { cache: "no-store" });

        if (response.ok) {
          let data = await response.json();

          // Sort by date and time
          data.sort((a: any, b: any) => {
            const dateA = new Date(`${a.date}T${a.startTime}`);
            const dateB = new Date(`${b.date}T${b.startTime}`);
            return dateA.getTime() - dateB.getTime();
          });

          // Filter to only show upcoming bookings
          const now = new Date();
          data = data.filter((booking: any) => {
            const bookingDate = new Date(`${booking.date}T${booking.endTime}`);
            return bookingDate >= now;
          });

          // Limit the number of bookings if specified
          if (limit && data.length > limit) {
            data = data.slice(0, limit);
          }

          setBookings(data);
        } else {
          // Set empty array if response is not ok
          setBookings([]);
        }
      } catch (error) {
        console.error("Error fetching bookings:", error);
        // Set empty array if there's an error
        setBookings([]);
      } finally {
        setLoading(false);
      }
    }

    fetchBookings();
  }, [userId, limit, user]);

  const handleDelete = async (id: number) => {
    try {
      setIsDeleting(id);
      const result = await deleteBooking(id.toString());

      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        });
        // Remove the booking from the state
        setBookings(bookings.filter((booking: any) => booking.id !== id));
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error deleting booking:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        Loading bookings...
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No upcoming bookings found.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking: any) => (
        <div
          key={booking._id}
          className="flex items-center justify-between space-x-4 rounded-lg border p-4"
        >
          <div className="space-y-1">
            <h3 className="font-medium">{booking.title}</h3>
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="mr-1 h-3 w-3" />
              {booking.labId?.name ?? "Unknown Lab"}
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="mr-1 h-3 w-3" />
              {format(parseISO(booking.date), "MMMM dd yyyy")}
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="mr-1 h-3 w-3" />
              {booking.startTime} - {booking.endTime}
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDelete(booking.id)}
            disabled={isDeleting === booking.id}
          >
            {isDeleting === booking.id ? "Cancelling..." : "Cancel"}
          </Button>
        </div>
      ))}
    </div>
  );
}
