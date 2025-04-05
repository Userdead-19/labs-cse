"use client"

import { useEffect, useState } from "react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "@/components/ui/chart"

export function BookingStats() {
  const [statsData, setStatsData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true)
        // In a real app, this would be an API call to get actual stats
        // For now, we'll use mock data
        const response = await fetch("/api/bookings")

        if (response.ok) {
          const bookings = await response.json()

          // Process bookings to get utilization by day of week
          const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
          const utilization = days.map((day) => {
            // In a real app, this would calculate actual utilization
            // For now, we'll use random values
            return {
              name: day,
              total: Math.floor(Math.random() * 50) + 50, // Random value between 50-100
            }
          })

          setStatsData(utilization)
        }
      } catch (error) {
        console.error("Error fetching stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading stats...</div>
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={statsData}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}%`}
        />
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div className="rounded-lg border bg-background p-2 shadow-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col">
                      <span className="text-[0.70rem] uppercase text-muted-foreground">Day</span>
                      <span className="font-bold text-muted-foreground">{payload[0].payload.name}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[0.70rem] uppercase text-muted-foreground">Utilization</span>
                      <span className="font-bold">{payload[0].value}%</span>
                    </div>
                  </div>
                </div>
              )
            }
            return null
          }}
        />
        <Bar dataKey="total" fill="currentColor" radius={[4, 4, 0, 0]} className="fill-primary" />
      </BarChart>
    </ResponsiveContainer>
  )
}

