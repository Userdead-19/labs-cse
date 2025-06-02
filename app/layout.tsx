import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { BookingProvider } from "@/context/booking-context";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "@/components/ui/toast"; // <-- Import it

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "LabBook - Lab Booking System",
    template: "%s | LabBook",
  },
  description:
    "A comprehensive system for booking and managing laboratory halls",
  keywords: ["lab booking", "laboratory management", "education", "scheduling"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <BookingProvider>
              {children}
              <Toaster
                position="top-right"
                richColors
                closeButton
                duration={3000}
              />
            </BookingProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
