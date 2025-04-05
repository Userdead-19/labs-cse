import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { LabAnalytics } from "@/components/lab-analytics"
import { LabUsageChart } from "@/components/lab-usage-chart"

export const dynamic = "force-dynamic"

export default function AnalyticsPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Analytics & Reports" text="Insights and statistics on lab usage" />
      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Lab Utilization Analytics</CardTitle>
            <CardDescription>Comprehensive analytics on lab usage patterns</CardDescription>
          </CardHeader>
          <CardContent>
            <LabAnalytics />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Lab Usage Statistics</CardTitle>
            <CardDescription>Detailed breakdown of lab availability and utilization</CardDescription>
          </CardHeader>
          <CardContent>
            <LabUsageChart />
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
}

