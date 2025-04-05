import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import ExamPeriod from "@/models/ExamPeriod"
import Lab from "@/models/Lab"
import mongoose from "mongoose"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  try {
    // Get URL parameters
    const { searchParams } = new URL(request.url)
    const yearGroup = searchParams.get("yearGroup")
    const isActive = searchParams.get("isActive")

    // Build query
    const query: any = {}

    if (yearGroup) {
      query.yearGroup = Number.parseInt(yearGroup)
    }

    if (isActive) {
      query.isActive = isActive === "true"
    }

    await connectToDatabase()
    const examPeriods = await ExamPeriod.find(query).populate("affectedLabs", "name building").sort({ startDate: 1 })

    return NextResponse.json(examPeriods)
  } catch (error) {
    console.error("Error fetching exam periods:", error)
    return NextResponse.json({ error: "Failed to fetch exam periods" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.name || !body.startDate || !body.endDate || !body.yearGroup || !body.affectedLabs) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    await connectToDatabase()

    // Validate lab IDs
    for (const labId of body.affectedLabs) {
      if (!mongoose.Types.ObjectId.isValid(labId)) {
        return NextResponse.json({ error: `Invalid lab ID: ${labId}` }, { status: 400 })
      }

      const lab = await Lab.findById(labId)
      if (!lab) {
        return NextResponse.json({ error: `Lab not found: ${labId}` }, { status: 404 })
      }
    }

    // Create new exam period
    const newExamPeriod = new ExamPeriod(body)
    await newExamPeriod.save()

    return NextResponse.json(newExamPeriod, { status: 201 })
  } catch (error) {
    console.error("Error creating exam period:", error)
    return NextResponse.json({ error: "Failed to create exam period" }, { status: 500 })
  }
}

