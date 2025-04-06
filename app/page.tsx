import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  CalendarDays,
  ClipboardList,
  Users,
  ArrowRight,
  CheckCircle2,
  BarChart3,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Lab Booking System",
  description:
    "A comprehensive system for booking and managing laboratory halls",
};

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <Link href="/" className="flex items-center space-x-2">
            <div className="relative h-8 w-8 overflow-hidden rounded-full bg-primary">
              <CalendarDays className="h-5 w-5 absolute inset-0 m-auto text-primary-foreground" />
            </div>
            <span className="font-bold text-lg">LabBook</span>
          </Link>
          <nav className="ml-auto flex items-center gap-4">
            <Link
              href="/about"
              className="text-sm font-medium text-muted-foreground hover:text-foreground hidden md:inline-block"
            >
              About
            </Link>
            <Link
              href="/features"
              className="text-sm font-medium text-muted-foreground hover:text-foreground hidden md:inline-block"
            >
              Features
            </Link>

            <Link href="/login">
              <Button variant="outline" size="sm">
                Login
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="sm">Dashboard</Button>
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background to-muted">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
                  Streamlined Lab Management
                </div>
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Simplify Your Lab Booking Process
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Schedule, track, and manage laboratory resources with our
                  intuitive platform designed for educational institutions.
                </p>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/dashboard">
                    <Button size="lg" className="h-12 px-6">
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/demo">
                    <Button size="lg" variant="outline" className="h-12 px-6">
                      View Demo
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="relative mx-auto aspect-video overflow-hidden rounded-xl border bg-background shadow-xl lg:order-last">
                <Image
                  src="/placeholder.svg?height=720&width=1280"
                  alt="Dashboard preview"
                  width={1280}
                  height={720}
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-background/20"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="rounded-lg bg-background/90 backdrop-blur p-4 shadow-lg border">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                      <p className="text-sm font-medium">
                        Labs available: 12/15
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="container px-4 py-16 md:px-6 md:py-24">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
            <h2 className="text-3xl font-bold leading-[1.1] sm:text-3xl md:text-5xl">
              Powerful Features
            </h2>
            <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
              Our platform offers everything you need to efficiently manage
              laboratory resources
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mt-12">
            <div className="group relative overflow-hidden rounded-lg border bg-background p-6 shadow-sm transition-all hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                <CalendarDays className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">Visual Calendar</h3>
              <p className="text-muted-foreground mt-2">
                Intuitive calendar interface showing lab availability with
                color-coded status indicators
              </p>
              <div className="mt-4 flex items-center text-sm text-primary">
                <span>Learn more</span>
                <ArrowRight className="ml-1 h-4 w-4" />
              </div>
              <div className="absolute bottom-0 left-0 h-1 w-0 bg-primary transition-all group-hover:w-full"></div>
            </div>
            <div className="group relative overflow-hidden rounded-lg border bg-background p-6 shadow-sm transition-all hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                <ClipboardList className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">Exam Period Handling</h3>
              <p className="text-muted-foreground mt-2">
                Special handling for exam periods with batch updates and
                automatic status reversion
              </p>
              <div className="mt-4 flex items-center text-sm text-primary">
                <span>Learn more</span>
                <ArrowRight className="ml-1 h-4 w-4" />
              </div>
              <div className="absolute bottom-0 left-0 h-1 w-0 bg-primary transition-all group-hover:w-full"></div>
            </div>
            <div className="group relative overflow-hidden rounded-lg border bg-background p-6 shadow-sm transition-all hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">Role-Based Access</h3>
              <p className="text-muted-foreground mt-2">
                Different permission levels for administrators, teachers, and
                students
              </p>
              <div className="mt-4 flex items-center text-sm text-primary">
                <span>Learn more</span>
                <ArrowRight className="ml-1 h-4 w-4" />
              </div>
              <div className="absolute bottom-0 left-0 h-1 w-0 bg-primary transition-all group-hover:w-full"></div>
            </div>
            <div className="group relative overflow-hidden rounded-lg border bg-background p-6 shadow-sm transition-all hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                <BarChart3 className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">Analytics</h3>
              <p className="text-muted-foreground mt-2">
                Generate insights on lab utilization and booking patterns with
                detailed reports
              </p>
              <div className="mt-4 flex items-center text-sm text-primary">
                <span>Learn more</span>
                <ArrowRight className="ml-1 h-4 w-4" />
              </div>
              <div className="absolute bottom-0 left-0 h-1 w-0 bg-primary transition-all group-hover:w-full"></div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="container px-4 py-16 md:px-6 md:py-24">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                Why Choose Our Lab Booking System?
              </h2>
              <p className="text-muted-foreground md:text-lg">
                Our platform is designed to streamline the lab booking process,
                making it easier for administrators, teachers, and students to
                manage resources efficiently.
              </p>
              <ul className="grid gap-4">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-1 h-5 w-5 text-primary flex-shrink-0" />
                  <div>
                    <p className="font-medium">Real-time Availability</p>
                    <p className="text-sm text-muted-foreground">
                      See lab availability in real-time, preventing double
                      bookings
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-1 h-5 w-5 text-primary flex-shrink-0" />
                  <div>
                    <p className="font-medium">Automated Notifications</p>
                    <p className="text-sm text-muted-foreground">
                      Receive booking confirmations, reminders, and updates
                      automatically
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-1 h-5 w-5 text-primary flex-shrink-0" />
                  <div>
                    <p className="font-medium">Equipment Management</p>
                    <p className="text-sm text-muted-foreground">
                      Track lab equipment and ensure it's available for each
                      session
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-1 h-5 w-5 text-primary flex-shrink-0" />
                  <div>
                    <p className="font-medium">Customizable Workflows</p>
                    <p className="text-sm text-muted-foreground">
                      Adapt the system to your institution's specific needs and
                      processes
                    </p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="relative mx-auto aspect-square max-w-md overflow-hidden rounded-lg border bg-background shadow-xl">
              <Image
                src="/placeholder.svg?height=600&width=600"
                alt="Lab booking interface"
                width={600}
                height={600}
                className="object-cover"
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-muted to-background">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight lg:text-5xl">
                  Ready to streamline your lab management?
                </h2>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Get started today and see how our system can transform your
                  lab booking process.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/dashboard">
                  <Button size="lg" className="h-12 px-8">
                    Get Started Now
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="outline" className="h-12 px-8">
                    Contact Sales
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t bg-muted/50">
        <div className="container px-4 py-8 md:px-6 md:py-12">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-4">
              <Link href="/" className="flex items-center space-x-2">
                <div className="relative h-8 w-8 overflow-hidden rounded-full bg-primary">
                  <CalendarDays className="h-5 w-5 absolute inset-0 m-auto text-primary-foreground" />
                </div>
                <span className="font-bold text-lg">LabBook</span>
              </Link>
              <p className="text-sm text-muted-foreground">
                A comprehensive system for booking and managing laboratory halls
                in educational institutions.
              </p>
            </div>
          </div>
          <div className="mt-8 border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © 2025 LabBook. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <Link
                href="/terms"
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Terms of Service
              </Link>
              <Link
                href="/privacy"
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
