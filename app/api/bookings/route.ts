import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import Booking from "@/models/Booking"
import Lab from "@/models/Lab"
import mongoose from "mongoose"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  try {
    // Get URL parameters
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const labId = searchParams.get("labId")
    const date = searchParams.get("date")
    const status = searchParams.get("status")
    const yearGroup = searchParams.get("yearGroup")
    const isExam = searchParams.get("isExam")

    // Build query
    const query: any = {}

    if (userId) {
      query.userId = new mongoose.Types.ObjectId(userId)
    }

    if (labId) {
      query.labId = labId
    }

    if (date) {
      query.date = date
    }

    if (status) {
      query.status = status
    }

    if (yearGroup) {
      query.yearGroup = Number.parseInt(yearGroup)
    }

    if (isExam) {
      query.isExam = isExam === "true"
    }
    console.log("Query:", query)
    await connectToDatabase()
    const bookings = await Booking.find(query).populate("labId", "name building").sort({ date: 1, startTime: 1 })

    return NextResponse.json(bookings)
  } catch (error) {
    console.error("Error fetching bookings:", error)
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate required fields
    if (
      !body.labId ||
      !body.date ||
      !body.startTime ||
      !body.endTime ||
      !body.title ||
      !body.userId ||
      !body.yearGroup
    ) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    await connectToDatabase()

    // Check if lab exists
    if (!mongoose.Types.ObjectId.isValid(body.labId)) {
      return NextResponse.json({ error: "Invalid lab ID" }, { status: 400 })
    }

    const lab = await Lab.findById(body.labId)
    if (!lab) {
      return NextResponse.json({ error: "Lab not found" }, { status: 404 })
    }

    // Validate booking date
    const bookingDate = new Date(body.date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const oneYearFromNow = new Date()
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1)

    if (bookingDate < today) {
      return NextResponse.json({ error: "Cannot book dates in the past" }, { status: 400 })
    }

    if (bookingDate > oneYearFromNow) {
      return NextResponse.json({ error: "Cannot book more than a year in advance" }, { status: 400 })
    }

    // Check for booking conflicts
    const conflictingBooking = await Booking.findOne({
      labId: body.labId,
      date: body.date,
      status: "approved",
      $or: [
        { startTime: { $lte: body.startTime }, endTime: { $gt: body.startTime } },
        { startTime: { $lt: body.endTime }, endTime: { $gte: body.endTime } },
        { startTime: { $gte: body.startTime }, endTime: { $lte: body.endTime } },
      ],
    })

    if (conflictingBooking) {
      return NextResponse.json({ error: "This time slot is already booked" }, { status: 409 })
    }

    // Create new booking
    const newBooking = new Booking(body)
    await newBooking.save()

    return NextResponse.json(newBooking, { status: 201 })
  } catch (error) {
    console.error("Error creating booking:", error)
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 })
  }
}

