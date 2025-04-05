"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { CalendarIcon, Plus, Trash } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import { createExamPeriod, deleteExamPeriod, toggleExamPeriodStatus } from "@/app/actions/exam-period-actions"

// Year groups
const yearGroups = [
  { value: "1", label: "1st Year" },
  { value: "2", label: "2nd Year" },
  { value: "3", label: "3rd Year" },
  { value: "4", label: "4th Year" },
]

export function ExamPeriodManager() {
  const [examPeriods, setExamPeriods] = useState([])
  const [labs, setLabs] = useState([])
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [name, setName] = useState("")
  const [selectedLabs, setSelectedLabs] = useState<string[]>([])
  const [selectedYearGroup, setSelectedYearGroup] = useState("")
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [isToggling, setIsToggling] = useState<string | null>(null)

  // Fetch exam periods and labs
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const [examPeriodsRes, labsRes] = await Promise.all([fetch("/api/exam-periods"), fetch("/api/labs")])

        if (examPeriodsRes.ok && labsRes.ok) {
          const [examPeriodsData, labsData] = await Promise.all([examPeriodsRes.json(), labsRes.json()])

          setExamPeriods(examPeriodsData)
          setLabs(labsData)
        }
      } catch (error) {
        console.error("Error fetching exam period data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleAddExamPeriod = async () => {
    if (name && startDate && endDate && selectedLabs.length > 0 && selectedYearGroup) {
      try {
        setIsSubmitting(true)

        // Create FormData for server action
        const formData = new FormData()
        formData.append("name", name)
        formData.append("startDate", format(startDate, "yyyy-MM-dd"))
        formData.append("endDate", format(endDate, "yyyy-MM-dd"))
        formData.append("affectedLabs", selectedLabs.join(","))
        formData.append("yearGroup", selectedYearGroup)

        const result = await createExamPeriod(formData)

        if (result.success) {
          toast({
            title: "Success",
            description: result.message,
          })

          // Refresh the exam periods
          const response = await fetch("/api/exam-periods")
          if (response.ok) {
            const data = await response.json()
            setExamPeriods(data)
          }

          // Reset form
          setName("")
          setStartDate(undefined)
          setEndDate(undefined)
          setSelectedLabs([])
          setSelectedYearGroup("")
        } else {
          toast({
            title: "Error",
            description: result.message,
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Error adding exam period:", error)
        toast({
          title: "Error",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsSubmitting(false)
      }
    } else {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
    }
  }

  const handleDeleteExamPeriod = async (id: string) => {
    try {
      setIsDeleting(id)
      const result = await deleteExamPeriod(id)

      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        })
        // Remove the exam period from the state
        setExamPeriods(examPeriods.filter((period: any) => period._id !== id))
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting exam period:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(null)
    }
  }

  const handleToggleExamPeriod = async (id: string, isActive: boolean) => {
    try {
      setIsToggling(id)
      const result = await toggleExamPeriodStatus(id, !isActive)

      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        })
        // Update the exam period in the state
        setExamPeriods(
          examPeriods.map((period: any) => (period._id === id ? { ...period, isActive: !isActive } : period)),
        )
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error toggling exam period:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsToggling(null)
    }
  }

  const toggleLabSelection = (labId: string) => {
    if (selectedLabs.includes(labId)) {
      setSelectedLabs(selectedLabs.filter((id) => id !== labId))
    } else {
      setSelectedLabs([...selectedLabs, labId])
    }
  }

  // Get color for year group
  const getYearGroupColor = (yearGroup: number) => {
    switch (yearGroup) {
      case 1:
        return "bg-blue-100 text-blue-800"
      case 2:
        return "bg-green-100 text-green-800"
      case 3:
        return "bg-purple-100 text-purple-800"
      case 4:
        return "bg-amber-100 text-amber-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-32">Loading exam period data...</div>
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Add New Exam Period</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="exam-name">Exam Period Name</Label>
            <Input
              id="exam-name"
              placeholder="e.g., Midterm Exams"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label>Year Group</Label>
            <Select value={selectedYearGroup} onValueChange={setSelectedYearGroup}>
              <SelectTrigger>
                <SelectValue placeholder="Select year group" />
              </SelectTrigger>
              <SelectContent>
                {yearGroups.map((year) => (
                  <SelectItem key={year.value} value={year.value}>
                    {year.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Affected Labs</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder={`${selectedLabs.length} labs selected`} />
              </SelectTrigger>
              <SelectContent>
                {labs.map((lab: any) => (
                  <SelectItem
                    key={lab._id}
                    value={lab._id}
                    onClick={() => toggleLabSelection(lab._id)}
                    className={selectedLabs.includes(lab._id) ? "bg-primary/10" : ""}
                  >
                    {lab.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Start Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn("w-full justify-start text-left font-normal", !startDate && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
              </PopoverContent>
            </Popover>
          </div>
          <div className="grid gap-2">
            <Label>End Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn("w-full justify-start text-left font-normal", !endDate && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <Button onClick={handleAddExamPeriod} className="mt-2" disabled={isSubmitting}>
          <Plus className="mr-2 h-4 w-4" />
          {isSubmitting ? "Adding..." : "Add Exam Period"}
        </Button>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Scheduled Exam Periods</h3>
        <div className="grid gap-4">
          {examPeriods.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No exam periods scheduled.</div>
          ) : (
            examPeriods.map(
              (period: any) =>
                (
                  <Card key={period._id}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium">{period.name}</h4>
                        <Badge variant={period.isActive ? "default" : "outline"}>
                          {period.isActive ? "Active" : "Inactive"}
                        </Badge>
                        <Badge variant="outline" className={getYearGroupColor(period.yearGroup)}>
                          Year {period.yearGroup}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(period.startDate), "MMMM d, yyyy")} - {format(new Date(period.endDate), "MMMM d, yyyy")}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        variant={period.isActive ? "outline" : "default"} 
                        size="sm"
                        onClick={() => handleToggleExamPeriod(period._id, period.isActive)}\
                        disabled={isToggling ===  period.isActive)}
                        disabled={isToggling === period._id || isDeleting !== null}
                      >
                        {isToggling === period._id ? "Updating..." : period.isActive ? "Deactivate" : "Activate"}
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleDeleteExamPeriod(period._id)}
                        disabled={isDeleting === period._id || isToggling !== null}
                      >
                        {isDeleting === period._id ? (
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                        ) : (
                          <Trash className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm font-medium">Affected Labs:</p>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {period.affectedLabs.map((labId: string) => {
                        const lab = labs.find((l: any) => l._id === labId);
                        return (
                          <Badge key={labId} variant="outline" className="bg-muted">
                            {lab ? lab.name : labId}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
                ),
            )
          )}
        </div>
      </div>
    </div>
  )
}

