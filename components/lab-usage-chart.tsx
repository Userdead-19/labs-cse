"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Bar, BarChart, XAxis, YAxis, Tooltip, Legend, Cell } from "recharts";
import { ResponsiveContainer } from "recharts";

// Colors for charts
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

export function LabUsageChart() {
  const [labs, setLabs] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [selectedLab, setSelectedLab] = useState("all");
  const [loading, setLoading] = useState(true);
  const [usageData, setUsageData] = useState<any[]>([]);
  const [hourlyData, setHourlyData] = useState<any[]>([]);

  // Fetch data
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        const [labsRes, bookingsRes] = await Promise.all([
          fetch("/api/labs", { cache: "no-store" }),
          fetch("/api/bookings?status=approved", { cache: "no-store" }),
        ]);

        const labsData = labsRes.ok ? await labsRes.json() : [];
        const bookingsData = bookingsRes.ok ? await bookingsRes.json() : [];

        setLabs(labsData);
        setBookings(bookingsData);

        // Process data
        processUsageData(labsData, bookingsData, selectedLab);
      } catch (error) {
        console.error("Error fetching lab usage data:", error);
        setLabs([]);
        setBookings([]);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [selectedLab]);

  // Process data for charts
  const processUsageData = (
    labs: any[],
    bookings: any[],
    selectedLabId: string
  ) => {
    // Filter bookings by selected lab if needed
    const filteredBookings =
      selectedLabId === "all"
        ? bookings
        : bookings.filter((booking: any) => booking.labId === selectedLabId);

    // Calculate total available hours per lab (12 hours per day * 7 days = 84 hours per week)
    const hoursPerDay = 12; // 8am to 8pm
    const daysPerWeek = 7; // Including weekends
    const totalHoursPerWeek = hoursPerDay * daysPerWeek;

    // Calculate usage data for each lab
    const labUsage = labs.map((lab: any) => {
      const labBookings = bookings.filter(
        (booking: any) => booking.labId === lab._id
      );

      // Calculate total booked hours
      let bookedHours = 0;
      labBookings.forEach((booking: any) => {
        const startHour = Number.parseInt(booking.startTime.split(":")[0]);
        const endHour = Number.parseInt(booking.endTime.split(":")[0]);
        bookedHours += endHour - startHour;
      });

      const freeHours = totalHoursPerWeek - bookedHours;
      const utilizationRate = (bookedHours / totalHoursPerWeek) * 100;

      return {
        name: lab.name,
        id: lab._id,
        bookedHours,
        freeHours,
        utilizationRate: Math.round(utilizationRate * 10) / 10, // Round to 1 decimal place
      };
    });

    // Sort by utilization rate (descending)
    labUsage.sort((a, b) => b.utilizationRate - a.utilizationRate);

    // Set usage data
    setUsageData(labUsage);

    // Calculate hourly usage data (for the selected lab or all labs)
    const hourlyUsage = Array(hoursPerDay)
      .fill(0)
      .map((_, index) => {
        const hour = index + 8; // Starting from 8am
        const hourString = `${hour}:00`;

        // Count bookings for this hour
        const bookingsAtHour = filteredBookings.filter((booking: any) => {
          const startHour = Number.parseInt(booking.startTime.split(":")[0]);
          const endHour = Number.parseInt(booking.endTime.split(":")[0]);
          return startHour <= hour && endHour > hour;
        }).length;

        return {
          hour: hourString,
          bookings: bookingsAtHour,
        };
      });

    setHourlyData(hourlyUsage);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        Loading lab usage data...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Lab Utilization Statistics</h3>
        <Select value={selectedLab} onValueChange={setSelectedLab}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select lab" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Labs</SelectItem>
            {labs.map((lab: any) => (
              <SelectItem key={lab._id} value={lab._id}>
                {lab.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Lab Utilization</CardTitle>
            <CardDescription>Free vs. booked hours per week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={
                    selectedLab === "all"
                      ? usageData
                      : usageData.filter((lab) => lab.id === selectedLab)
                  }
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                >
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="name" width={100} />
                  <Tooltip formatter={(value) => [`${value} hours`, ""]} />
                  <Legend />
                  <Bar
                    dataKey="bookedHours"
                    stackId="a"
                    fill="#8884d8"
                    name="Booked Hours"
                  />
                  <Bar
                    dataKey="freeHours"
                    stackId="a"
                    fill="#82ca9d"
                    name="Free Hours"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Hourly Usage</CardTitle>
            <CardDescription>Number of bookings by hour of day</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hourlyData}>
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="bookings" fill="#8884d8" name="Bookings" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {selectedLab === "all" && (
        <Card>
          <CardHeader>
            <CardTitle>Lab Utilization Rates</CardTitle>
            <CardDescription>
              Percentage of available time booked
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={usageData}>
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip
                    formatter={(value) => [`${value}%`, "Utilization Rate"]}
                  />
                  <Bar dataKey="utilizationRate" fill="#8884d8">
                    {usageData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
