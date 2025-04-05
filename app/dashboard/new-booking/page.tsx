"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "@/components/ui/use-toast"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { createBooking } from "@/app/actions/booking-actions"

const bookingFormSchema = z.object({
  labId: z.string({
    required_error: "Please select a lab.",
  }),
  date: z.date({
    required_error: "Please select a date.",
  }),
  startTime: z.string({
    required_error: "Please select a start time.",
  }),
  endTime: z.string({
    required_error: "Please select an end time.",
  }),
  purpose: z.string().min(5, {
    message: "Purpose must be at least 5 characters.",
  }),
  studentCount: z.string().min(1, {
    message: "Please enter the number of students.",
  }),
  equipment: z.string().optional(),
  title: z.string().min(3, {
    message: "Title must be at least 3 characters.",
  }),
  yearGroup: z.string({
    required_error: "Please select a year group.",
  }),
  isExam: z.boolean().default(false),
})

type BookingFormValues = z.infer<typeof bookingFormSchema>

// Time slots for selection
const timeSlots = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"]

// Year groups
const yearGroups = [
  { value: "1", label: "1st Year" },
  { value: "2", label: "2nd Year" },
  { value: "3", label: "3rd Year" },
  { value: "4", label: "4th Year" },
]

export default function NewBookingPage() {
  const router = useRouter()
  const [labs, setLabs] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      purpose: "",
      studentCount: "",
      equipment: "",
      title: "",
      isExam: false,
    },
  })

  // Fetch labs data
  useEffect(() => {
    async function fetchLabs() {
      try {
        const response = await fetch("/api/labs")
        if (response.ok) {
          const data = await response.json()
          setLabs(data)
        }
      } catch (error) {
        console.error("Error fetching labs:", error)
        toast({
          title: "Error",
          description: "Failed to load labs data. Please try again.",
          variant: "destructive",
        })
      }
    }

    fetchLabs()
  }, [])

  async function onSubmit(data: BookingFormValues) {
    setIsSubmitting(true)

    try {
      // Convert form data to FormData for server action
      const formData = new FormData()
      formData.append("labId", data.labId)
      formData.append("date", format(data.date, "yyyy-MM-dd"))
      formData.append("startTime", data.startTime)
      formData.append("endTime", data.endTime)
      formData.append("purpose", data.purpose)
      formData.append("studentCount", data.studentCount)
      formData.append("title", data.title)
      formData.append("yearGroup", data.yearGroup)
      formData.append("isExam", data.isExam.toString())

      if (data.equipment) {
        formData.append("equipment", data.equipment)
      }

      // Call server action
      const result = await createBooking(formData)

      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        })

        // Redirect to dashboard after submission
        setTimeout(() => {
          router.push("/dashboard")
        }, 1500)
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error submitting booking:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="New Booking" text="Request a new lab booking" />
      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Booking Details</CardTitle>
            <CardDescription>Fill out the form below to request a lab booking</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Booking Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter a title for this booking" {...field} />
                      </FormControl>
                      <FormDescription>A short title for your booking</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="labId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Lab</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a lab" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {labs.map((lab: any) => (
                              <SelectItem key={lab._id} value={lab._id}>
                                {lab.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>Select the lab you want to book</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="yearGroup"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Year Group</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select year group" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {yearGroups.map((year) => (
                              <SelectItem key={year.value} value={year.value}>
                                {year.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>Select the year group for this booking</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground",
                                )}
                              >
                                {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => {
                                // Disable dates in the past
                                const today = new Date()
                                today.setHours(0, 0, 0, 0)

                                // Disable dates more than a year in the future
                                const oneYearFromNow = new Date()
                                oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1)

                                return date < today || date > oneYearFromNow
                              }}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormDescription>The date you want to book the lab (up to 1 year in advance)</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="startTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Start Time</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select start time" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {timeSlots.map((time) => (
                                <SelectItem key={time} value={time}>
                                  {time}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>When your booking starts</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="endTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>End Time</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select end time" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {timeSlots.map((time) => (
                                <SelectItem key={time} value={time}>
                                  {time}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>When your booking ends</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <FormField
                  control={form.control}
                  name="purpose"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Purpose</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe the purpose of your booking"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>Briefly describe why you need the lab</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="studentCount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number of Students</FormLabel>
                        <FormControl>
                          <Input type="number" min="1" {...field} />
                        </FormControl>
                        <FormDescription>How many students will be using the lab</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="equipment"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Special Equipment</FormLabel>
                        <FormControl>
                          <Input placeholder="Any special equipment needed" {...field} />
                        </FormControl>
                        <FormDescription>List any special equipment you need</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="isExam"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>This is an examination booking</FormLabel>
                        <FormDescription>Check this box if this booking is for an examination</FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit Booking Request"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
}

