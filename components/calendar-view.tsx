"use client";

import { useState, useEffect } from "react";
import { useBooking } from "@/context/booking-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { format, addDays, startOfWeek, addWeeks, subWeeks } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface CalendarViewProps {
  view?: "day" | "week";
}

// Year groups for filtering
const yearGroups = [
  { value: "all", label: "All Years" },
  { value: "1", label: "1st Year" },
  { value: "2", label: "2nd Year" },
  { value: "3", label: "3rd Year" },
  { value: "4", label: "4th Year" },
];

export function CalendarView({ view = "week" }: CalendarViewProps) {
  const { labs, bookings, loading, error, refreshData } = useBooking();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentWeek, setCurrentWeek] = useState(
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );
  const [currentView, setCurrentView] = useState<"day" | "week">(view);
  const [selectedYearGroup, setSelectedYearGroup] = useState("all");
  const [filteredBookings, setFilteredBookings] = useState(bookings);

  // Filter bookings when year group selection or bookings change
  useEffect(() => {
    console.log(bookings);
    if (selectedYearGroup === "all") {
      setFilteredBookings(bookings);
    } else {
      setFilteredBookings(
        bookings.filter(
          (booking) => booking.yearGroup.toString() === selectedYearGroup
        )
      );
    }
  }, [selectedYearGroup, bookings]);

  const nextWeek = () => {
    setCurrentWeek(addWeeks(currentWeek, 1));
  };

  const prevWeek = () => {
    setCurrentWeek(subWeeks(currentWeek, 1));
  };

  const nextDay = () => {
    setCurrentDate(addDays(currentDate, 1));
  };

  const prevDay = () => {
    setCurrentDate(addDays(currentDate, -1));
  };

  // Generate week days (now including weekends)
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(currentWeek, i));

  // Time slots for the day view
  const timeSlots = [
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
  ];

  // Check if a lab is booked at a specific time
  const isBooked = (labId: string, date: string, time: string) => {
    return filteredBookings.some(
      (booking) =>
        booking.labId === labId &&
        booking.date === date &&
        booking.startTime <= time &&
        booking.endTime > time
    );
  };

  // Get booking details for a specific slot
  const getBookingDetails = (labId: string, date: string, time: string) => {
    console.log("getBookingDetails", labId, date, time);
    console.log("filteredBookings", filteredBookings);
    return filteredBookings.find(
      (booking) =>
        booking.labId === labId &&
        booking.date === date &&
        booking.startTime <= time &&
        booking.endTime > time
    );
  };

  // Get color for year group
  const getYearGroupColor = (yearGroup: number) => {
    switch (yearGroup) {
      case 1:
        return "bg-blue-100 text-blue-800 border-blue-300";
      case 2:
        return "bg-green-100 text-green-800 border-green-300";
      case 3:
        return "bg-purple-100 text-purple-800 border-purple-300";
      case 4:
        return "bg-amber-100 text-amber-800 border-amber-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        Loading calendar data...
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load calendar data: {error}
        </AlertDescription>
      </Alert>
    );
  }

  // Update the days array to include weekends:
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <Button
            variant={currentView === "day" ? "default" : "outline"}
            size="sm"
            onClick={() => setCurrentView("day")}
          >
            Day
          </Button>
          <Button
            variant={currentView === "week" ? "default" : "outline"}
            size="sm"
            onClick={() => setCurrentView("week")}
          >
            Week
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <Select
            value={selectedYearGroup}
            onValueChange={setSelectedYearGroup}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Filter by year" />
            </SelectTrigger>
            <SelectContent>
              {yearGroups.map((year) => (
                <SelectItem key={year.value} value={year.value}>
                  {year.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={currentView === "week" ? prevWeek : prevDay}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium">
            {currentView === "week"
              ? `Week of ${format(currentWeek, "MMMM d, yyyy")}`
              : format(currentDate, "EEEE, MMMM d, yyyy")}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={currentView === "week" ? nextWeek : nextDay}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-2">
        <div className="text-sm font-medium">Year Groups:</div>
        <Badge
          variant="outline"
          className="bg-blue-100 text-blue-800 border-blue-300"
        >
          1st Year
        </Badge>
        <Badge
          variant="outline"
          className="bg-green-100 text-green-800 border-green-300"
        >
          2nd Year
        </Badge>
        <Badge
          variant="outline"
          className="bg-purple-100 text-purple-800 border-purple-300"
        >
          3rd Year
        </Badge>
        <Badge
          variant="outline"
          className="bg-amber-100 text-amber-800 border-amber-300"
        >
          4th Year
        </Badge>
        <Badge
          variant="outline"
          className="bg-red-100 text-red-800 border-red-300"
        >
          Exam
        </Badge>
      </div>

      {currentView === "week" ? (
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            <div className="grid grid-cols-8 gap-2 border-b pb-2">
              <div className="font-medium">Labs</div>
              {weekDays.map((day, i) => (
                <div key={i} className="text-center font-medium">
                  {format(day, "EEE, MMM d")}
                </div>
              ))}
            </div>
            <div className="space-y-2 pt-2">
              {labs.map((lab) => (
                <div key={lab._id} className="grid grid-cols-8 gap-2">
                  <div className="flex items-center font-medium">
                    {lab.name}
                  </div>
                  {weekDays.map((day, i) => {
                    const dateStr = format(day, "yyyy-MM-dd");
                    const hasBooking = filteredBookings.some(
                      (b) => b.labId === lab._id && b.date === dateStr
                    );
                    const dayBookings = filteredBookings.filter(
                      (b) => b.labId === lab._id && b.date === dateStr
                    );

                    return (
                      <div
                        key={i}
                        className={`flex h-16 items-center justify-center rounded-md border p-2 ${
                          hasBooking
                            ? "bg-primary/10 border-primary/20"
                            : "bg-muted/40"
                        }`}
                      >
                        {hasBooking ? (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="flex flex-col items-center">
                                  {dayBookings.length > 1 ? (
                                    <Badge
                                      variant="outline"
                                      className="bg-primary/20"
                                    >
                                      {dayBookings.length} Bookings
                                    </Badge>
                                  ) : (
                                    <Badge
                                      variant="outline"
                                      className={`${
                                        dayBookings[0].isExam
                                          ? "bg-red-100 text-red-800 border-red-300"
                                          : getYearGroupColor(
                                              dayBookings[0].yearGroup
                                            )
                                      }`}
                                    >
                                      {dayBookings[0].isExam
                                        ? "Exam"
                                        : `Year ${dayBookings[0].yearGroup}`}
                                    </Badge>
                                  )}
                                  <Info className="mt-1 h-4 w-4 text-muted-foreground" />
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <div className="space-y-1 text-xs">
                                  {dayBookings.map((booking) => (
                                    <div
                                      key={booking._id}
                                      className="border-b pb-1 last:border-0 last:pb-0"
                                    >
                                      <div className="font-medium">
                                        {booking.title}
                                      </div>
                                      <div>
                                        {booking.startTime} - {booking.endTime}
                                      </div>
                                      <div>{booking.user}</div>
                                      <div className="flex items-center gap-1 mt-1">
                                        <Badge
                                          variant="outline"
                                          className={`${
                                            booking.isExam
                                              ? "bg-red-100 text-red-800 border-red-300"
                                              : getYearGroupColor(
                                                  booking.yearGroup
                                                )
                                          }`}
                                        >
                                          {booking.isExam
                                            ? "Exam"
                                            : `Year ${booking.yearGroup}`}
                                        </Badge>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        ) : (
                          <span className="text-sm text-muted-foreground">
                            Available
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            <div className="grid grid-cols-[100px_repeat(5,1fr)] gap-2 border-b pb-2">
              <div className="font-medium">Time</div>
              {labs.map((lab) => (
                <div key={lab._id} className="text-center font-medium">
                  {lab.name}
                </div>
              ))}
            </div>
            <div className="space-y-2 pt-2">
              {timeSlots.map((time, i) => {
                const dateStr = format(currentDate, "yyyy-MM-dd");

                return (
                  <div
                    key={i}
                    className="grid grid-cols-[100px_repeat(5,1fr)] gap-2"
                  >
                    <div className="flex items-center font-medium">{time}</div>
                    {labs.map((lab) => {
                      const booked = isBooked(lab._id, dateStr, time);
                      const booking = getBookingDetails(lab._id, dateStr, time);

                      return (
                        <div
                          key={lab._id}
                          className={`flex h-12 items-center justify-center rounded-md border p-2 ${
                            booked
                              ? "bg-primary/10 border-primary/20"
                              : "bg-muted/40"
                          }`}
                        >
                          {booked ? (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-medium truncate">
                                      {booking?.title}
                                    </span>
                                    <Badge
                                      variant="outline"
                                      className={`${
                                        booking?.isExam
                                          ? "bg-red-100 text-red-800 border-red-300"
                                          : getYearGroupColor(
                                              booking?.yearGroup ?? 0
                                            )
                                      }`}
                                    >
                                      {booking?.isExam
                                        ? "Exam"
                                        : `Y${booking?.yearGroup}`}
                                    </Badge>
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <div className="space-y-1 text-xs">
                                    <div className="font-medium">
                                      {booking?.title}
                                    </div>
                                    <div>
                                      {booking?.startTime} - {booking?.endTime}
                                    </div>
                                    <div>{booking?.user}</div>
                                    <div className="flex items-center gap-1 mt-1">
                                      <Badge
                                        variant="outline"
                                        className={`${
                                          booking?.isExam
                                            ? "bg-red-100 text-red-800 border-red-300"
                                            : getYearGroupColor(
                                                booking?.yearGroup ?? 0
                                              )
                                        }`}
                                      >
                                        {booking?.isExam
                                          ? "Exam"
                                          : `Year ${booking?.yearGroup}`}
                                      </Badge>
                                    </div>
                                  </div>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          ) : (
                            <span className="text-xs text-muted-foreground">
                              Available
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
