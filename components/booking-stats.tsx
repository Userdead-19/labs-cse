"use client";

import { useBooking } from "@/context/booking-context";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export function BookingStats() {
  const { bookings, labs, loading, error } = useBooking();

  if (loading) {
    return <div>Loading booking statistics...</div>;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load booking statistics: {error}
        </AlertDescription>
      </Alert>
    );
  }

  // Get current week dates
  const today = new Date();
  const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const startOfWeek = new Date(today);
  startOfWeek.setDate(
    today.getDate() - currentDay + (currentDay === 0 ? -6 : 1)
  ); // Start from Monday

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + i);
    return day;
  });

  // Format dates for display and comparison
  const formattedWeekDays = weekDays.map((day) => ({
    display: day.toLocaleDateString("en-US", { weekday: "short" }),
    date: day.toISOString().split("T")[0],
  }));

  // Count bookings per day
  const bookingsPerDay = formattedWeekDays.map((day) => {
    return bookings.filter((booking) => booking.date === day.date).length;
  });

  // Calculate utilization percentage
  const utilizationPerDay = formattedWeekDays.map((day, index) => {
    const dailyBookings = bookings.filter(
      (booking) => booking.date === day.date
    ).length;
    const totalPossibleBookings = labs.length * 10; // Assuming 10 time slots per day
    return (dailyBookings / totalPossibleBookings) * 100;
  });

  const chartData = {
    labels: formattedWeekDays.map((day) => day.display),
    datasets: [
      {
        label: "Number of Bookings",
        data: bookingsPerDay,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
        yAxisID: "y",
      },
      {
        label: "Utilization %",
        data: utilizationPerDay,
        backgroundColor: "rgba(153, 102, 255, 0.6)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 1,
        yAxisID: "y1",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        type: "linear" as const,
        display: true,
        position: "left" as const,
        title: {
          display: true,
          text: "Number of Bookings",
        },
      },
      y1: {
        type: "linear" as const,
        display: true,
        position: "right" as const,
        grid: {
          drawOnChartArea: false,
        },
        title: {
          display: true,
          text: "Utilization %",
        },
        min: 0,
        max: 100,
      },
    },
  };

  return (
    <div className="h-[350px]">
      <Bar data={chartData} options={options} />
    </div>
  );
}
