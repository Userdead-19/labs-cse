import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CalendarDays,
  ClipboardList,
  Settings,
  Users,
  BarChart3,
  Bell,
  Clock,
  Shield,
  Smartphone,
  CheckCircle2,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Features",
  description: "Explore the powerful features of the LabBook system",
};

export default function FeaturesPage() {
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
              href="/"
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Home
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              About
            </Link>
            <Link
              href="/features"
              className="text-sm font-medium text-foreground"
            >
              Features
            </Link>
            <Link
              href="/contact"
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Contact
            </Link>
            <Link href="/dashboard">
              <Button size="sm">Dashboard</Button>
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Powerful Features
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Discover how LabBook can transform your lab management process
                  with our comprehensive feature set
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Categories */}
        <section className="container px-4 py-16 md:px-6 md:py-24">
          <Tabs defaultValue="booking" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-8">
              <TabsTrigger value="booking">Booking Management</TabsTrigger>
              <TabsTrigger value="admin">Administration</TabsTrigger>
              <TabsTrigger value="reporting">Reporting & Analytics</TabsTrigger>
              <TabsTrigger value="integration">
                Integration & Access
              </TabsTrigger>
            </TabsList>

            <TabsContent value="booking" className="space-y-8">
              <div className="grid gap-8 md:grid-cols-2">
                <div className="space-y-4">
                  <h2 className="text-3xl font-bold">Booking Management</h2>
                  <p className="text-muted-foreground">
                    Our intuitive booking system makes it easy to schedule and
                    manage lab resources, preventing conflicts and maximizing
                    utilization.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>
                        Visual calendar interface with day, week, and month
                        views
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>
                        Real-time availability checking to prevent double
                        bookings
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>
                        Recurring booking options for regular lab sessions
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>
                        Equipment and resource tracking within each lab
                      </span>
                    </li>
                  </ul>
                </div>
                <div className="relative rounded-xl overflow-hidden border">
                  <Image
                    src="/placeholder.svg?height=600&width=800"
                    alt="Booking calendar interface"
                    width={800}
                    height={600}
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CalendarDays className="h-6 w-6 text-primary mb-2" />
                    <CardTitle>Visual Calendar</CardTitle>
                    <CardDescription>
                      Intuitive calendar interface showing lab availability with
                      color-coded status indicators
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>Color-coded booking status</li>
                      <li>Day, week, and month views</li>
                      <li>Drag-and-drop booking creation</li>
                      <li>Quick view of booking details</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <Bell className="h-6 w-6 text-primary mb-2" />
                    <CardTitle>Notifications</CardTitle>
                    <CardDescription>
                      Automated notifications for booking confirmations,
                      reminders, and updates
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>Email and in-app notifications</li>
                      <li>Customizable notification preferences</li>
                      <li>Booking reminders for users</li>
                      <li>Status change alerts</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <Clock className="h-6 w-6 text-primary mb-2" />
                    <CardTitle>Time Management</CardTitle>
                    <CardDescription>
                      Flexible time slot management for different lab scheduling
                      needs
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>Customizable time slots</li>
                      <li>Buffer time between bookings</li>
                      <li>Operating hours enforcement</li>
                      <li>Time zone support</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="admin" className="space-y-8">
              <div className="grid gap-8 md:grid-cols-2">
                <div className="space-y-4">
                  <h2 className="text-3xl font-bold">Administration</h2>
                  <p className="text-muted-foreground">
                    Powerful administrative tools to manage labs, users, and
                    booking policies with ease.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>
                        Role-based access control for administrators, teachers,
                        and students
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>Approval workflows for booking requests</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>Lab and equipment inventory management</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>Customizable booking policies and rules</span>
                    </li>
                  </ul>
                </div>
                <div className="relative rounded-xl overflow-hidden border">
                  <Image
                    src="/placeholder.svg?height=600&width=800"
                    alt="Admin dashboard interface"
                    width={800}
                    height={600}
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                <Card>
                  <CardHeader>
                    <Users className="h-6 w-6 text-primary mb-2" />
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>
                      Comprehensive user management with role-based permissions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>Role-based access control</li>
                      <li>User groups and departments</li>
                      <li>Self-service user registration</li>
                      <li>Activity logging and auditing</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <ClipboardList className="h-6 w-6 text-primary mb-2" />
                    <CardTitle>Approval Workflows</CardTitle>
                    <CardDescription>
                      Customizable approval processes for booking requests
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>Multi-level approval workflows</li>
                      <li>Automatic approvals based on rules</li>
                      <li>Request modification capabilities</li>
                      <li>Approval history tracking</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <Settings className="h-6 w-6 text-primary mb-2" />
                    <CardTitle>System Configuration</CardTitle>
                    <CardDescription>
                      Flexible system settings to adapt to your institution's
                      needs
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>Customizable booking rules</li>
                      <li>Lab and resource configuration</li>
                      <li>Email template customization</li>
                      <li>Academic calendar integration</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="reporting" className="space-y-8">
              <div className="grid gap-8 md:grid-cols-2">
                <div className="space-y-4">
                  <h2 className="text-3xl font-bold">Reporting & Analytics</h2>
                  <p className="text-muted-foreground">
                    Gain valuable insights into lab usage patterns and resource
                    utilization with our comprehensive reporting tools.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>
                        Utilization reports by lab, department, or time period
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>Visual analytics dashboards with key metrics</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>Custom report generation with export options</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>Trend analysis for resource planning</span>
                    </li>
                  </ul>
                </div>
                <div className="relative rounded-xl overflow-hidden border">
                  <Image
                    src="/placeholder.svg?height=600&width=800"
                    alt="Analytics dashboard"
                    width={800}
                    height={600}
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                <Card>
                  <CardHeader>
                    <BarChart3 className="h-6 w-6 text-primary mb-2" />
                    <CardTitle>Usage Analytics</CardTitle>
                    <CardDescription>
                      Comprehensive analytics on lab usage patterns and trends
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>Utilization rate tracking</li>
                      <li>Peak usage time identification</li>
                      <li>Comparative period analysis</li>
                      <li>User activity metrics</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <ClipboardList className="h-6 w-6 text-primary mb-2" />
                    <CardTitle>Custom Reports</CardTitle>
                    <CardDescription>
                      Flexible report generation for different stakeholders
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>Report builder interface</li>
                      <li>Scheduled report delivery</li>
                      <li>Multiple export formats</li>
                      <li>Data visualization options</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <Settings className="h-6 w-6 text-primary mb-2" />
                    <CardTitle>Resource Planning</CardTitle>
                    <CardDescription>
                      Data-driven insights for future resource allocation
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>Capacity planning tools</li>
                      <li>Underutilization identification</li>
                      <li>Equipment usage tracking</li>
                      <li>Budget allocation assistance</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="integration" className="space-y-8">
              <div className="grid gap-8 md:grid-cols-2">
                <div className="space-y-4">
                  <h2 className="text-3xl font-bold">Integration & Access</h2>
                  <p className="text-muted-foreground">
                    Seamlessly integrate LabBook with your existing systems and
                    provide flexible access options for all users.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>
                        Integration with student information systems and LMS
                        platforms
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>
                        Mobile-responsive design for access on any device
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>API access for custom integrations</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>Single sign-on (SSO) support</span>
                    </li>
                  </ul>
                </div>
                <div className="relative rounded-xl overflow-hidden border">
                  <Image
                    src="/placeholder.svg?height=600&width=800"
                    alt="Mobile and integration interfaces"
                    width={800}
                    height={600}
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                <Card>
                  <CardHeader>
                    <Smartphone className="h-6 w-6 text-primary mb-2" />
                    <CardTitle>Mobile Access</CardTitle>
                    <CardDescription>
                      Access LabBook from any device with our responsive design
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>Responsive web interface</li>
                      <li>Native mobile apps</li>
                      <li>Offline capability</li>
                      <li>Push notifications</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <Settings className="h-6 w-6 text-primary mb-2" />
                    <CardTitle>API & Integrations</CardTitle>
                    <CardDescription>
                      Connect LabBook with your existing systems
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>RESTful API</li>
                      <li>LMS integration</li>
                      <li>Calendar system sync</li>
                      <li>Custom webhook support</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <Shield className="h-6 w-6 text-primary mb-2" />
                    <CardTitle>Security & Authentication</CardTitle>
                    <CardDescription>
                      Secure access with flexible authentication options
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>Single sign-on (SSO)</li>
                      <li>LDAP/Active Directory integration</li>
                      <li>Two-factor authentication</li>
                      <li>Role-based security</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 bg-gradient-to-b from-muted to-background">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                  Ready to experience these features firsthand?
                </h2>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Join the growing number of educational institutions using
                  LabBook to streamline their lab management.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/dashboard">
                  <Button size="lg" className="h-12 px-8">
                    Try LabBook Now
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="outline" className="h-12 px-8">
                    Request a Demo
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
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Product</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/features"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    href="/pricing"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    href="/demo"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Demo
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Resources</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/docs"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link
                    href="/guides"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Guides
                  </Link>
                </li>
                <li>
                  <Link
                    href="/support"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Support
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Company</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/about"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
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
