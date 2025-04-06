"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

import { useAuth } from "./AuthContext";

// Define types for our context data
export interface Lab {
  _id: string;
  name: string;
  building: string;
  capacity: number;
  equipment: string[];
}

export interface Booking {
  _id: string;
  labId: string;
  date: string;
  startTime: string;
  endTime: string;
  title: string;
  purpose: string;
  userId: string | null;
  user: string;
  studentCount: number;
  equipment: string;
  yearGroup: number;
  isExam: boolean;
  status: "pending" | "approved" | "rejected";
}

export interface ExamPeriod {
  _id: string;
  name: string;
  startDate: string;
  endDate: string;
}

export interface BookingContextType {
  labs: Lab[];
  bookings: Booking[];
  userBookings: Booking[];
  examPeriods: ExamPeriod[];
  totalLabs: number;
  availableNow: number;
  upcomingUserBookings: number;
  upcomingExamPeriod: ExamPeriod | null;
  loading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
  userId: string | null;
}

const BookingContext = createContext<BookingContextType | null>(null);

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error("useBooking must be used within a BookingProvider");
  }
  return context;
};

interface BookingProviderProps {
  children: ReactNode;
}

export const BookingProvider = ({ children }: BookingProviderProps) => {
  const [labs, setLabs] = useState<Lab[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [examPeriods, setExamPeriods] = useState<ExamPeriod[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const userId = user ? user._id : null;
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

      const [labsRes, bookingsRes, examPeriodsRes] = await Promise.all([
        fetch(`${apiUrl}/api/labs`, { cache: "no-store" }),
        fetch(`${apiUrl}/api/bookings`, { cache: "no-store" }),
        fetch(`${apiUrl}/api/exam-periods`, { cache: "no-store" }),
      ]);

      if (!labsRes.ok) throw new Error("Failed to fetch labs");
      if (!bookingsRes.ok) throw new Error("Failed to fetch bookings");
      if (!examPeriodsRes.ok) throw new Error("Failed to fetch exam periods");

      const labsData = await labsRes.json();
      const bookingsData = await bookingsRes.json();
      const examPeriodsData = await examPeriodsRes.json();

      setLabs(labsData);
      setBookings(bookingsData);
      setExamPeriods(examPeriodsData);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Calculate derived data
  const userBookings = bookings.filter((b) => b.userId === userId);

  const now = new Date();
  const today = now.toISOString().split("T")[0];
  const currentHour = now.getHours().toString().padStart(2, "0") + ":00";

  const totalLabs = labs.length;

  const availableNow =
    totalLabs -
    bookings.filter(
      (b) =>
        b.date === today &&
        b.startTime <= currentHour &&
        b.endTime > currentHour &&
        b.status === "approved"
    ).length;

  const upcomingUserBookings = userBookings.filter((b) => {
    const bookingDate = new Date(b.date);
    return bookingDate >= now;
  }).length;

  const upcomingExamPeriod =
    examPeriods
      .filter((p) => new Date(p.startDate) > now)
      .sort(
        (a, b) =>
          new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
      )[0] || null;

  const value = {
    labs,
    bookings,
    userBookings,
    examPeriods,
    totalLabs,
    availableNow,
    upcomingUserBookings,
    upcomingExamPeriod,
    loading,
    error,
    refreshData: fetchData,
    userId,
  };

  return (
    <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
  );
};
