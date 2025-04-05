"use client"

export const dynamic = "force-dynamic"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { BookingRequests } from "@/components/booking-requests"
import { ExamPeriodManager } from "@/components/exam-period-manager"
import { UserManagement } from "@/components/user-management"

export default function AdminPage() {
  const [examMode, setExamMode] = useState(false)

  const toggleExamMode = () => {
    setExamMode(!examMode)
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Admin Dashboard" text="Manage bookings, users, and system settings" />
      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
            <CardDescription>Control system-wide settings and modes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <Switch id="exam-mode" checked={examMode} onCheckedChange={toggleExamMode} />
              <Label htmlFor="exam-mode">Examination Period Mode</Label>
              <span
                className={`ml-auto px-2 py-1 text-xs font-medium rounded-full ${
                  examMode ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"
                }`}
              >
                {examMode ? "Active" : "Inactive"}
              </span>
            </div>
            {examMode && (
              <p className="mt-2 text-sm text-muted-foreground">
                Examination mode is active. Regular bookings are suspended and labs are available for exam scheduling.
              </p>
            )}
          </CardContent>
        </Card>
        <Tabs defaultValue="requests" className="space-y-4">
          <TabsList>
            <TabsTrigger value="requests">Booking Requests</TabsTrigger>
            <TabsTrigger value="exam-periods">Exam Periods</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="settings">System Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="requests" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Pending Booking Requests</CardTitle>
                <CardDescription>Review and approve lab booking requests</CardDescription>
              </CardHeader>
              <CardContent>
                <BookingRequests />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="exam-periods" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Examination Period Management</CardTitle>
                <CardDescription>Schedule and manage examination periods</CardDescription>
              </CardHeader>
              <CardContent>
                <ExamPeriodManager />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage user accounts and permissions</CardDescription>
              </CardHeader>
              <CardContent>
                <UserManagement />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
                <CardDescription>Configure system-wide settings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Automatic Booking Approval</Label>
                      <p className="text-sm text-muted-foreground">Automatically approve booking requests from staff</p>
                    </div>
                    <Switch defaultChecked={false} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Send email notifications for booking events</p>
                    </div>
                    <Switch defaultChecked={true} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Allow Weekend Bookings</Label>
                      <p className="text-sm text-muted-foreground">Enable lab bookings on weekends</p>
                    </div>
                    <Switch defaultChecked={false} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardShell>
  )
}

