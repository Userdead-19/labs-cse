import type React from "react";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import { BookingProvider } from "@/context/booking-context";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Lab Booking System",
  description: "CSE Lab Booking System",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <BookingProvider>
            {children}
            <Toaster />
          </BookingProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

import "./globals.css";
