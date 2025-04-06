import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Building2, GraduationCap, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about the LabBook system and our mission",
};

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <Link href="/" className="flex items-center space-x-2">
            <div className="relative h-8 w-8 overflow-hidden rounded-full bg-primary">
              <BookOpen className="h-5 w-5 absolute inset-0 m-auto text-primary-foreground" />
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
            <Link href="/about" className="text-sm font-medium text-foreground">
              About
            </Link>
            <Link
              href="/features"
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
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
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  About LabBook
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  LabBook is a comprehensive lab booking and management system
                  designed specifically for educational institutions.
                </p>
                <p className="max-w-[600px] text-muted-foreground">
                  Our mission is to simplify the process of managing laboratory
                  resources, making it easier for administrators, teachers, and
                  students to schedule and track lab usage efficiently.
                </p>
              </div>
              <div className="relative mx-auto aspect-video overflow-hidden rounded-xl border bg-background shadow-xl lg:order-last">
                <Image
                  src="/placeholder.svg?height=720&width=1280"
                  alt="University laboratory"
                  width={1280}
                  height={720}
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="container px-4 py-16 md:px-6 md:py-24">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
            <h2 className="text-3xl font-bold leading-[1.1] sm:text-3xl md:text-4xl">
              Our Story
            </h2>
            <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
              LabBook was founded in 2022 by a team of educators and software
              developers who recognized the challenges of managing laboratory
              resources in educational settings.
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-2">
            <Card className="overflow-hidden">
              <div className="aspect-video relative">
                <Image
                  src="/placeholder.svg?height=400&width=600"
                  alt="Team meeting"
                  width={600}
                  height={400}
                  className="object-cover w-full h-full"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2">The Problem</h3>
                <p className="text-muted-foreground">
                  Educational institutions often struggle with inefficient lab
                  booking processes, double bookings, and lack of visibility
                  into resource availability. Manual systems lead to confusion,
                  wasted time, and underutilized resources.
                </p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <div className="aspect-video relative">
                <Image
                  src="/placeholder.svg?height=400&width=600"
                  alt="Software development"
                  width={600}
                  height={400}
                  className="object-cover w-full h-full"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2">Our Solution</h3>
                <p className="text-muted-foreground">
                  We developed LabBook to provide a centralized, user-friendly
                  platform that streamlines the entire lab booking process. Our
                  system offers real-time availability, automated notifications,
                  and comprehensive reporting to optimize resource utilization.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Team Section */}
        <section className="w-full py-12 md:py-24 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center mb-12">
              <h2 className="text-3xl font-bold leading-[1.1] sm:text-3xl md:text-4xl">
                Our Team
              </h2>
              <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
                Meet the dedicated professionals behind LabBook
              </p>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  name: "Dr. Sarah Johnson",
                  role: "Founder & CEO",
                  bio: "Former university professor with 15 years of experience in educational technology",
                  icon: GraduationCap,
                },
                {
                  name: "Michael Chen",
                  role: "CTO",
                  bio: "Software architect with expertise in building scalable educational platforms",
                  icon: Building2,
                },
                {
                  name: "Emily Rodriguez",
                  role: "Head of Product",
                  bio: "Former lab administrator who understands the challenges of resource management",
                  icon: Users,
                },
                {
                  name: "David Kim",
                  role: "Lead Developer",
                  bio: "Full-stack developer passionate about creating intuitive user experiences",
                  icon: BookOpen,
                },
              ].map((member, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <member.icon className="h-10 w-10 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold">{member.name}</h3>
                    <p className="text-sm text-muted-foreground font-medium mb-2">
                      {member.role}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {member.bio}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="container px-4 py-16 md:px-6 md:py-24">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center mb-12">
            <h2 className="text-3xl font-bold leading-[1.1] sm:text-3xl md:text-4xl">
              Our Values
            </h2>
            <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
              The principles that guide our work and shape our product
            </p>
          </div>

          <Tabs defaultValue="efficiency" className="w-full max-w-4xl mx-auto">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="efficiency">Efficiency</TabsTrigger>
              <TabsTrigger value="innovation">Innovation</TabsTrigger>
              <TabsTrigger value="accessibility">Accessibility</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>
            <TabsContent
              value="efficiency"
              className="p-6 border rounded-lg mt-6"
            >
              <h3 className="text-xl font-bold mb-2">Efficiency</h3>
              <p className="text-muted-foreground mb-4">
                We believe in creating systems that save time and reduce
                administrative burden, allowing educators to focus on what
                matters most: teaching and research.
              </p>
              <ul className="space-y-2 list-disc pl-5">
                <li>Streamlined booking processes</li>
                <li>Automated notifications and reminders</li>
                <li>Intuitive interfaces that require minimal training</li>
                <li>
                  Comprehensive reporting to identify optimization opportunities
                </li>
              </ul>
            </TabsContent>
            <TabsContent
              value="innovation"
              className="p-6 border rounded-lg mt-6"
            >
              <h3 className="text-xl font-bold mb-2">Innovation</h3>
              <p className="text-muted-foreground mb-4">
                We continuously explore new technologies and approaches to
                improve the lab booking experience and solve emerging challenges
                in educational resource management.
              </p>
              <ul className="space-y-2 list-disc pl-5">
                <li>Regular feature updates based on user feedback</li>
                <li>Integration with emerging educational technologies</li>
                <li>Data-driven insights for resource planning</li>
                <li>Adaptive interfaces that evolve with user needs</li>
              </ul>
            </TabsContent>
            <TabsContent
              value="accessibility"
              className="p-6 border rounded-lg mt-6"
            >
              <h3 className="text-xl font-bold mb-2">Accessibility</h3>
              <p className="text-muted-foreground mb-4">
                We design our platform to be accessible to all users, regardless
                of technical expertise or physical abilities, ensuring equal
                access to educational resources.
              </p>
              <ul className="space-y-2 list-disc pl-5">
                <li>WCAG 2.1 AA compliant interfaces</li>
                <li>Multi-device support for access anywhere</li>
                <li>Simplified workflows for users of all technical levels</li>
                <li>
                  Multilingual support for diverse educational environments
                </li>
              </ul>
            </TabsContent>
            <TabsContent
              value="security"
              className="p-6 border rounded-lg mt-6"
            >
              <h3 className="text-xl font-bold mb-2">Security</h3>
              <p className="text-muted-foreground mb-4">
                We prioritize the security and privacy of institutional data,
                implementing robust measures to protect sensitive information
                and ensure compliance with regulations.
              </p>
              <ul className="space-y-2 list-disc pl-5">
                <li>End-to-end encryption for all data</li>
                <li>Role-based access controls</li>
                <li>Regular security audits and updates</li>
                <li>
                  Compliance with GDPR, FERPA, and other relevant regulations
                </li>
              </ul>
            </TabsContent>
          </Tabs>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 bg-gradient-to-b from-muted to-background">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                  Ready to transform your lab management?
                </h2>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Join the growing number of educational institutions using
                  LabBook to streamline their resource management.
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
                    Contact Us
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
                  <BookOpen className="h-5 w-5 absolute inset-0 m-auto text-primary-foreground" />
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
