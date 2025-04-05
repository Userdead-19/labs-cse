"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, User } from "lucide-react"
import { format } from "date-fns"
import { toast } from "@/components/ui/use-toast"
import { updateBookingStatus } from "@/app/actions/booking-actions"

export function BookingRequests() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState<{ id: number; action: string } | null>(null)

  useEffect(() => {
    async function fetchRequests() {
      try {
        setLoading(true)
        const response = await fetch("/api/bookings?status=pending")

        if (response.ok) {
          const data = await response.json()
          setRequests(data)
        }
      } catch (error) {
        console.error("Error fetching booking requests:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchRequests()
  }, [])

  const handleApprove = async (id: number) => {
    try {
      setProcessing({ id, action: "approve" })
      const result = await updateBookingStatus(id, "approved")

      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        })
        // Remove the request from the state
        setRequests(requests.filter((request: any) => request.id !== id))
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error approving booking:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setProcessing(null)
    }
  }

  const handleReject = async (id: number) => {
    try {
      setProcessing({ id, action: "reject" })
      const result = await updateBookingStatus(id, "rejected")

      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        })
        // Remove the request from the state
        setRequests(requests.filter((request: any) => request.id !== id))
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error rejecting booking:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setProcessing(null)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-32">Loading booking requests...</div>
  }

  if (requests.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">No pending booking requests.</div>
  }

  return (
    <div className="space-y-4">
      {requests.map((request: any) => (
        <div key={request.id} className="rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h3 className="font-medium">{request.title}</h3>
              <Badge variant="outline">{request.labId.replace("lab-", "Lab ")}</Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleReject(request.id)}
                disabled={processing !== null}
              >
                {processing?.id === request.id && processing?.action === "reject" ? "Rejecting..." : "Reject"}
              </Button>
              <Button size="sm" onClick={() => handleApprove(request.id)} disabled={processing !== null}>
                {processing?.id === request.id && processing?.action === "approve" ? "Approving..." : "Approve"}
              </Button>
            </div>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center text-muted-foreground">
              <Calendar className="mr-1 h-3 w-3" />
              {format(new Date(request.date), "MMMM d, yyyy")}
            </div>
            <div className="flex items-center text-muted-foreground">
              <Clock className="mr-1 h-3 w-3" />
              {request.startTime} - {request.endTime}
            </div>
            <div className="flex items-center text-muted-foreground">
              <User className="mr-1 h-3 w-3" />
              {request.user}
            </div>
            <div className="text-muted-foreground">Students: {request.studentCount}</div>
          </div>
          {request.purpose && (
            <div className="mt-2 text-sm">
              <p className="font-medium">Purpose:</p>
              <p className="text-muted-foreground">{request.purpose}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

