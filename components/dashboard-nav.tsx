"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  CalendarDays,
  ClipboardList,
  Home,
  LayoutDashboard,
  LogOut,
  Settings,
  BarChart,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export function DashboardNav() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const isAdmin = user?.role === "admin";
  return (
    <div className="flex h-full w-full flex-col border-r bg-muted/40">
      <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span>Lab Booking System</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-2 text-sm font-medium">
          <Link
            href="/dashboard"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:text-primary",
              pathname === "/dashboard" && "bg-muted text-primary"
            )}
          >
            <LayoutDashboard className="h-4 w-4" />
            <span>Dashboard</span>
          </Link>
          <Link
            href="/dashboard/calendar"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:text-primary",
              pathname === "/dashboard/calendar" && "bg-muted text-primary"
            )}
          >
            <CalendarDays className="h-4 w-4" />
            <span>Calendar</span>
          </Link>
          <Link
            href="/dashboard/my-bookings"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:text-primary",
              pathname === "/dashboard/my-bookings" && "bg-muted text-primary"
            )}
          >
            <ClipboardList className="h-4 w-4" />
            <span>My Bookings</span>
          </Link>
          <Link
            href="/dashboard/new-booking"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:text-primary",
              pathname === "/dashboard/new-booking" && "bg-muted text-primary"
            )}
          >
            <Home className="h-4 w-4" />
            <span>New Booking</span>
          </Link>
          <Link
            href="/dashboard/analytics"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:text-primary",
              pathname === "/dashboard/analytics" && "bg-muted text-primary"
            )}
          >
            <BarChart className="h-4 w-4" />
            <span>Analytics</span>
          </Link>
          {!isAdmin && (
            <Link
              href="/dashboard/admin"
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:text-primary",
                pathname === "/dashboard/admin" && "bg-muted text-primary"
              )}
            >
              <Settings className="h-4 w-4" />
              <span>Admin</span>
            </Link>
          )}
        </nav>
      </div>
      <div className="mt-auto p-4">
        <Button
          variant="outline"
          className="w-full justify-start gap-2"
          onClick={logout}
        >
          <LogOut className="h-4 w-4" />
          <span>Log out</span>
        </Button>
      </div>
    </div>
  );
}
