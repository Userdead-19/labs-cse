"use client";

import { useState, useEffect, useMemo } from "react";
import { useBooking } from "@/context/booking-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Info, CalendarIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  format,
  addDays,
  startOfWeek,
  addWeeks,
  subWeeks,
  isSameDay,
} from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

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

// Helper function to normalize MongoDB ObjectIDs
const normalizeId = (id: any) => {
  if (id && typeof id === "object" && id.$oid) {
    return id.$oid;
  }
  return id;
};

export function CalendarView({ view = "week" }: CalendarViewProps) {
  const { labs, bookings, loading, error } = useBooking();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentWeek, setCurrentWeek] = useState(
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );
  const [currentView, setCurrentView] = useState<"day" | "week">(view);
  const [selectedYearGroup, setSelectedYearGroup] = useState("all");
  interface Booking {
    _id: string;
    labId: string;
    userId: string;
    date: string;
    startTime: string;
    endTime: string;
    title?: string;
    purpose?: string;
    user: string;
    studentCount?: number;
    yearGroup: number;
    isExam?: boolean;
    status: string;
  }

  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );

  const normalizedBookings = useMemo(() => {
    return bookings.map((booking) => ({
      ...booking,
      _id: normalizeId(booking._id),
      labId: normalizeId(booking.labId._id),
      userId: normalizeId(booking.userId),
    }));
  }, [bookings]);
  ``;

  const normalizedLabs = labs.map((lab) => ({
    ...lab,
    _id: normalizeId(lab._id),
  }));

  // Filter bookings when year group selection or bookings change
  useEffect(() => {
    if (selectedYearGroup === "all") {
      setFilteredBookings(normalizedBookings);
    } else {
      setFilteredBookings(
        normalizedBookings.filter(
          (booking) => booking.yearGroup.toString() === selectedYearGroup
        )
      );
    }
  }, [selectedYearGroup, normalizedBookings]);

  // Update current date when calendar date is selected
  useEffect(() => {
    if (selectedDate) {
      setCurrentDate(selectedDate);
      setCurrentWeek(startOfWeek(selectedDate, { weekStartsOn: 1 }));
    }
  }, [selectedDate]);

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
        return "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900 dark:text-blue-100 dark:border-blue-700";
      case 2:
        return "bg-green-100 text-green-800 border-green-300 dark:bg-green-900 dark:text-green-100 dark:border-green-700";
      case 3:
        return "bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900 dark:text-purple-100 dark:border-purple-700";
      case 4:
        return "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900 dark:text-amber-100 dark:border-amber-700";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-sm text-muted-foreground">
            Loading calendar data...
          </p>
        </div>
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

  // Debug output to check bookings format
  console.log("Original bookings:", bookings);
  console.log("Normalized bookings:", normalizedBookings);
  console.log("Filtered bookings:", filteredBookings);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Lab Calendar</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs
          defaultValue={currentView}
          onValueChange={(value) => setCurrentView(value as "day" | "week")}
        >
          <div className="px-6 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <TabsList>
                <TabsTrigger value="day">Day</TabsTrigger>
                <TabsTrigger value="week">Week</TabsTrigger>
              </TabsList>
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

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="min-w-[180px] justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {currentView === "week"
                      ? `Week of ${format(currentWeek, "MMM d, yyyy")}`
                      : format(currentDate, "EEEE, MMM d, yyyy")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              <Button
                variant="outline"
                size="icon"
                onClick={currentView === "week" ? nextWeek : nextDay}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-4 px-6">
            <div className="text-sm font-medium">Legend:</div>
            <Badge
              variant="outline"
              className="bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900 dark:text-blue-100 dark:border-blue-700"
            >
              1st Year
            </Badge>
            <Badge
              variant="outline"
              className="bg-green-100 text-green-800 border-green-300 dark:bg-green-900 dark:text-green-100 dark:border-green-700"
            >
              2nd Year
            </Badge>
            <Badge
              variant="outline"
              className="bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900 dark:text-purple-100 dark:border-purple-700"
            >
              3rd Year
            </Badge>
            <Badge
              variant="outline"
              className="bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900 dark:text-amber-100 dark:border-amber-700"
            >
              4th Year
            </Badge>
            <Badge
              variant="outline"
              className="bg-red-100 text-red-800 border-red-300 dark:bg-red-900 dark:text-red-100 dark:border-red-700"
            >
              Exam
            </Badge>
            <Badge
              variant="outline"
              className="bg-primary/10 text-primary border-primary/20"
            >
              Available
            </Badge>
          </div>

          <TabsContent value="week" className="m-0">
            <div className="overflow-x-auto pb-6">
              <div className="min-w-[800px] px-6">
                <div className="grid grid-cols-8 gap-2 border-b pb-2">
                  <div className="font-medium">Labs</div>
                  {weekDays.map((day, i) => (
                    <div key={i} className="text-center font-medium">
                      <div className="font-bold">{format(day, "EEE")}</div>
                      <div className="text-sm text-muted-foreground">
                        {format(day, "MMM d")}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="space-y-3 pt-3">
                  {normalizedLabs.map((lab) => (
                    <div key={lab._id} className="grid grid-cols-8 gap-2">
                      <div className="flex items-center font-medium">
                        <div className="truncate">
                          <div>{lab.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {lab.building}
                          </div>
                        </div>
                      </div>
                      {weekDays.map((day, i) => {
                        const dateStr = format(day, "yyyy-MM-dd");
                        const dayBookings = filteredBookings.filter(
                          (b) => b.labId === lab._id && b.date === dateStr
                        );
                        const hasBooking = dayBookings.length > 0;
                        const isToday = isSameDay(day, new Date());

                        return (
                          <div
                            key={i}
                            className={`flex h-20 items-center justify-center rounded-md border p-2 transition-all hover:border-primary/50 ${
                              hasBooking
                                ? "bg-primary/10 border-primary/20"
                                : "bg-background border-border hover:bg-primary/5"
                            } ${isToday ? "ring-2 ring-primary/30" : ""}`}
                          >
                            {hasBooking ? (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div className="flex flex-col items-center gap-1">
                                      {dayBookings.length > 1 ? (
                                        <Badge
                                          variant="outline"
                                          className="bg-primary/20 border-primary/30"
                                        >
                                          {dayBookings.length} Bookings
                                        </Badge>
                                      ) : (
                                        <Badge
                                          variant="outline"
                                          className={`${
                                            dayBookings[0].isExam
                                              ? "bg-red-100 text-red-800 border-red-300 dark:bg-red-900 dark:text-red-100 dark:border-red-700"
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
                                      <div className="text-xs text-center font-medium truncate max-w-full">
                                        {dayBookings[0].title ||
                                          dayBookings[0].purpose}
                                      </div>
                                      <Info className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent className="max-w-[300px]">
                                    <div className="space-y-2 text-xs">
                                      {dayBookings.map((booking) => (
                                        <div
                                          key={booking._id}
                                          className="border-b pb-2 last:border-0 last:pb-0"
                                        >
                                          <div className="font-bold text-sm">
                                            {booking.title || booking.purpose}
                                          </div>
                                          <div className="mt-1 flex items-center gap-1">
                                            <span className="font-medium">
                                              Time:
                                            </span>{" "}
                                            {booking.startTime} -{" "}
                                            {booking.endTime}
                                          </div>
                                          <div className="flex items-center gap-1">
                                            <span className="font-medium">
                                              Booked by:
                                            </span>{" "}
                                            {booking.user}
                                          </div>
                                          {(booking.studentCount ?? 0) > 0 && (
                                            <div className="flex items-center gap-1">
                                              <span className="font-medium">
                                                Students:
                                              </span>{" "}
                                              {booking.studentCount}
                                            </div>
                                          )}
                                          <div className="flex items-center gap-1 mt-1">
                                            <Badge
                                              variant="outline"
                                              className={`${
                                                booking.isExam
                                                  ? "bg-red-100 text-red-800 border-red-300 dark:bg-red-900 dark:text-red-100 dark:border-red-700"
                                                  : getYearGroupColor(
                                                      booking.yearGroup
                                                    )
                                              }`}
                                            >
                                              {booking.isExam
                                                ? "Exam"
                                                : `Year ${booking.yearGroup}`}
                                            </Badge>
                                            <Badge
                                              variant={
                                                booking.status === "approved"
                                                  ? "default"
                                                  : "outline"
                                              }
                                            >
                                              {booking.status
                                                .charAt(0)
                                                .toUpperCase() +
                                                booking.status.slice(1)}
                                            </Badge>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            ) : (
                              <div className="flex flex-col items-center">
                                <span className="text-sm text-muted-foreground">
                                  Available
                                </span>
                                <span className="text-xs text-muted-foreground mt-1">
                                  All day
                                </span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="day" className="m-0">
            <div className="overflow-x-auto pb-6">
              <div className="min-w-[800px] px-6">
                <div className="grid grid-cols-[120px_repeat(5,1fr)] gap-2 border-b pb-2">
                  <div className="font-medium">Time</div>
                  {normalizedLabs.slice(0, 5).map((lab) => (
                    <div key={lab._id} className="text-center font-medium">
                      <div>{lab.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {lab.building}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="space-y-2 pt-3">
                  {timeSlots.map((time, i) => {
                    const dateStr = format(currentDate, "yyyy-MM-dd");
                    const nextTime = timeSlots[i + 1] || "18:00";

                    return (
                      <div
                        key={i}
                        className="grid grid-cols-[120px_repeat(5,1fr)] gap-2"
                      >
                        <div className="flex items-center font-medium">
                          <div>
                            <div>{time}</div>
                            <div className="text-xs text-muted-foreground">
                              to {nextTime}
                            </div>
                          </div>
                        </div>
                        {normalizedLabs.slice(0, 5).map((lab) => {
                          const booked = isBooked(lab._id, dateStr, time);
                          const booking = getBookingDetails(
                            lab._id,
                            dateStr,
                            time
                          );

                          return (
                            <div
                              key={lab._id}
                              className={`flex h-16 items-center justify-center rounded-md border p-2 transition-all hover:border-primary/50 ${
                                booked
                                  ? "bg-primary/10 border-primary/20"
                                  : "bg-background border-border hover:bg-primary/5"
                              }`}
                            >
                              {booked && booking ? (
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <div className="flex flex-col items-center gap-1 w-full">
                                        <Badge
                                          variant="outline"
                                          className={`${
                                            booking.isExam
                                              ? "bg-red-100 text-red-800 border-red-300 dark:bg-red-900 dark:text-red-100 dark:border-red-700"
                                              : getYearGroupColor(
                                                  booking.yearGroup
                                                )
                                          }`}
                                        >
                                          {booking.isExam
                                            ? "Exam"
                                            : `Year ${booking.yearGroup}`}
                                        </Badge>
                                        <div className="text-xs text-center font-medium truncate max-w-full">
                                          {booking.title || booking.purpose}
                                        </div>
                                      </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <div className="space-y-1 text-xs">
                                        <div className="font-bold text-sm">
                                          {booking.title || booking.purpose}
                                        </div>
                                        <div className="mt-1 flex items-center gap-1">
                                          <span className="font-medium">
                                            Time:
                                          </span>{" "}
                                          {booking.startTime} -{" "}
                                          {booking.endTime}
                                        </div>
                                        <div className="flex items-center gap-1">
                                          <span className="font-medium">
                                            Booked by:
                                          </span>{" "}
                                          {booking.user}
                                        </div>
                                        {(booking.studentCount ?? 0) > 0 && (
                                          <div className="flex items-center gap-1">
                                            <span className="font-medium">
                                              Students:
                                            </span>{" "}
                                            {booking.studentCount}
                                          </div>
                                        )}
                                        <div className="flex items-center gap-1 mt-1">
                                          <Badge
                                            variant="outline"
                                            className={`${
                                              booking.isExam
                                                ? "bg-red-100 text-red-800 border-red-300 dark:bg-red-900 dark:text-red-100 dark:border-red-700"
                                                : getYearGroupColor(
                                                    booking.yearGroup
                                                  )
                                            }`}
                                          >
                                            {booking.isExam
                                              ? "Exam"
                                              : `Year ${booking.yearGroup}`}
                                          </Badge>
                                          <Badge
                                            variant={
                                              booking.status === "approved"
                                                ? "default"
                                                : "outline"
                                            }
                                          >
                                            {booking.status
                                              .charAt(0)
                                              .toUpperCase() +
                                              booking.status.slice(1)}
                                          </Badge>
                                        </div>
                                      </div>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              ) : (
                                <div className="flex flex-col items-center">
                                  <span className="text-sm text-muted-foreground">
                                    Available
                                  </span>
                                </div>
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
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
