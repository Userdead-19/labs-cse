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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Pie,
  PieChart,
  Cell,
  ResponsiveContainer,
} from "recharts";

// Year groups for filtering
const yearGroups = [
  { value: "all", label: "All Years" },
  { value: "1", label: "1st Year" },
  { value: "2", label: "2nd Year" },
  { value: "3", label: "3rd Year" },
  { value: "4", label: "4th Year" },
];

// Colors for charts
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];
const YEAR_COLORS = {
  1: "#3b82f6", // blue
  2: "#10b981", // green
  3: "#8b5cf6", // purple
  4: "#f59e0b", // amber
};

export function LabAnalytics() {
  const [bookings, setBookings] = useState<
    { labId: string; yearGroup: number; date: string; isExam?: boolean }[]
  >([]);
  const [labs, setLabs] = useState<{ _id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedYearGroup, setSelectedYearGroup] = useState("all");
  const [selectedTimeframe, setSelectedTimeframe] = useState("week");

  // Fetch data
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        // Build URL for bookings with year group filter
        let bookingsUrl = "/api/bookings?status=approved";
        if (selectedYearGroup !== "all") {
          bookingsUrl += `&yearGroup=${selectedYearGroup}`;
        }

        const [labsRes, bookingsRes] = await Promise.all([
          fetch("/api/labs", { cache: "no-store" }),
          fetch(bookingsUrl, { cache: "no-store" }),
        ]);

        const labsData = labsRes.ok ? await labsRes.json() : [];
        const bookingsData = bookingsRes.ok ? await bookingsRes.json() : [];

        setLabs(labsData);
        setBookings(bookingsData);
      } catch (error) {
        console.error("Error fetching analytics data:", error);
        setLabs([]);
        setBookings([]);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [selectedYearGroup]);

  // Process data for charts
  const processUtilizationByDay = () => {
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    const dayMap = {
      1: "Monday",
      2: "Tuesday",
      3: "Wednesday",
      4: "Thursday",
      5: "Friday",
    };

    // Initialize data structure
    const utilizationData = days.map((day) => ({
      name: day,
      total: 0,
      year1: 0,
      year2: 0,
      year3: 0,
      year4: 0,
    }));

    // Count bookings by day and year
    bookings.forEach((booking: any) => {
      const date = new Date(booking.date);
      const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, etc.

      if (dayOfWeek >= 1 && dayOfWeek <= 5) {
        // Only weekdays
        const dayName = dayMap[dayOfWeek as keyof typeof dayMap];
        const dayIndex = days.indexOf(dayName);

        if (dayIndex !== -1) {
          utilizationData[dayIndex].total += 1;

          // Increment year-specific counter
          if (booking.yearGroup === 1) utilizationData[dayIndex].year1 += 1;
          else if (booking.yearGroup === 2)
            utilizationData[dayIndex].year2 += 1;
          else if (booking.yearGroup === 3)
            utilizationData[dayIndex].year3 += 1;
          else if (booking.yearGroup === 4)
            utilizationData[dayIndex].year4 += 1;
        }
      }
    });

    return utilizationData;
  };

  const processUtilizationByLab = () => {
    // Create a map to store lab utilization
    const labUtilization: Record<string, number> = {};

    // Initialize with all labs
    labs.forEach((lab: { _id: string; name: string }) => {
      labUtilization[lab._id] = 0;
    });

    // Count bookings by lab
    bookings.forEach((booking: any) => {
      if (labUtilization[booking.labId] !== undefined) {
        labUtilization[booking.labId] += 1;
      }
    });

    // Convert to chart data format
    return Object.entries(labUtilization)
      .map(([labId, count]) => {
        const lab = labs.find(
          (l: { _id: string; name: string }) => l._id === labId
        );
        return {
          name: lab ? lab.name : labId,
          value: count,
        };
      })
      .sort((a, b) => b.value - a.value); // Sort by count descending
  };

  const processUtilizationByYearGroup = () => {
    // Count bookings by year group
    const yearCounts = [0, 0, 0, 0]; // Index 0 = Year 1, etc.

    bookings.forEach((booking: any) => {
      if (booking.yearGroup >= 1 && booking.yearGroup <= 4) {
        yearCounts[booking.yearGroup - 1] += 1;
      }
    });

    // Convert to chart data format
    return [
      { name: "1st Year", value: yearCounts[0], color: YEAR_COLORS[1] },
      { name: "2nd Year", value: yearCounts[1], color: YEAR_COLORS[2] },
      { name: "3rd Year", value: yearCounts[2], color: YEAR_COLORS[3] },
      { name: "4th Year", value: yearCounts[3], color: YEAR_COLORS[4] },
    ];
  };

  const utilizationByDay = processUtilizationByDay();
  const utilizationByLab = processUtilizationByLab();
  const utilizationByYearGroup = processUtilizationByYearGroup();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        Loading analytics data...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
          <Select
            value={selectedTimeframe}
            onValueChange={setSelectedTimeframe}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="semester">This Semester</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="by-day">By Day</TabsTrigger>
          <TabsTrigger value="by-lab">By Lab</TabsTrigger>
          <TabsTrigger value="by-year">By Year Group</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Bookings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{bookings.length}</div>
                <p className="text-xs text-muted-foreground">
                  {selectedYearGroup === "all"
                    ? "All year groups"
                    : `Year ${selectedYearGroup} only`}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Exam Bookings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {bookings.filter((b: any) => b.isExam).length}
                </div>
                <p className="text-xs text-muted-foreground">
                  {(
                    (bookings.filter((b: any) => b.isExam).length /
                      bookings.length) *
                    100
                  ).toFixed(1)}
                  % of total
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Most Used Lab
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {utilizationByLab.length > 0
                    ? utilizationByLab[0].name
                    : "N/A"}
                </div>
                <p className="text-xs text-muted-foreground">
                  {utilizationByLab.length > 0
                    ? `${utilizationByLab[0].value} bookings`
                    : "No data available"}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Busiest Day
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {
                    utilizationByDay.reduce(
                      (max, day) => (day.total > max.total ? day : max),
                      {
                        name: "N/A",
                        total: 0,
                      }
                    ).name
                  }
                </div>
                <p className="text-xs text-muted-foreground">
                  {
                    utilizationByDay.reduce(
                      (max, day) => (day.total > max.total ? day : max),
                      {
                        name: "N/A",
                        total: 0,
                      }
                    ).total
                  }{" "}
                  bookings
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Bookings by Day</CardTitle>
                <CardDescription>
                  Distribution of bookings across weekdays
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={utilizationByDay}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar
                        dataKey="total"
                        fill="#8884d8"
                        name="Total Bookings"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Bookings by Year Group</CardTitle>
                <CardDescription>
                  Distribution of bookings by year group
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={utilizationByYearGroup}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {utilizationByYearGroup.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="by-day" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Daily Booking Distribution</CardTitle>
              <CardDescription>
                Detailed breakdown of bookings by day and year group
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={utilizationByDay}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="year1"
                      stackId="a"
                      fill={YEAR_COLORS[1]}
                      name="1st Year"
                    />
                    <Bar
                      dataKey="year2"
                      stackId="a"
                      fill={YEAR_COLORS[2]}
                      name="2nd Year"
                    />
                    <Bar
                      dataKey="year3"
                      stackId="a"
                      fill={YEAR_COLORS[3]}
                      name="3rd Year"
                    />
                    <Bar
                      dataKey="year4"
                      stackId="a"
                      fill={YEAR_COLORS[4]}
                      name="4th Year"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="by-lab" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Lab Utilization</CardTitle>
              <CardDescription>Number of bookings per lab</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={utilizationByLab}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                  >
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="name" width={100} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8884d8" name="Bookings" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="by-year" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Year Group Distribution</CardTitle>
              <CardDescription>
                Booking distribution across year groups
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={utilizationByYearGroup}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value, percent }) =>
                        `${name}: ${value} (${(percent * 100).toFixed(0)}%)`
                      }
                    >
                      {utilizationByYearGroup.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
