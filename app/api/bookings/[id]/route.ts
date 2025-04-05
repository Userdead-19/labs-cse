import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import Booking from "@/models/Booking"
import mongoose from "mongoose"

export const dynamic = "force-dynamic"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: "Invalid booking ID" }, { status: 400 })
    }

    await connectToDatabase()
    const booking = await Booking.findById(params.id).populate("labId", "name building")

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    return NextResponse.json(booking)
  } catch (error) {
    console.error("Error fetching booking:", error)
    return NextResponse.json({ error: "Failed to fetch booking" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: "Invalid booking ID" }, { status: 400 })
    }

    const body = await request.json()

    await connectToDatabase()

    // If changing time or lab, check for conflicts
    if ((body.labId || body.date || body.startTime || body.endTime) && body.status !== "rejected") {
      const existingBooking = await Booking.findById(params.id)

      if (!existingBooking) {
        return NextResponse.json({ error: "Booking not found" }, { status: 404 })
      }

      const labId = body.labId || existingBooking.labId
      const date = body.date || existingBooking.date
      const startTime = body.startTime || existingBooking.startTime
      const endTime = body.endTime || existingBooking.endTime

      const conflictingBooking = await Booking.findOne({
        _id: { $ne: params.id },
        labId,
        date,
        status: "approved",
        $or: [
          { startTime: { $lte: startTime }, endTime: { $gt: startTime } },
          { startTime: { $lt: endTime }, endTime: { $gte: endTime } },
          { startTime: { $gte: startTime }, endTime: { $lte: endTime } },
        ],
      })

      if (conflictingBooking) {
        return NextResponse.json({ error: "This time slot is already booked" }, { status: 409 })
      }
    }

    // Update booking
    const booking = await Booking.findByIdAndUpdate(params.id, { $set: body }, { new: true, runValidators: true })

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    return NextResponse.json(booking)
  } catch (error) {
    console.error("Error updating booking:", error)
    return NextResponse.json({ error: "Failed to update booking" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: "Invalid booking ID" }, { status: 400 })
    }

    await connectToDatabase()
    const booking = await Booking.findByIdAndDelete(params.id)

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    return NextResponse.json(booking)
  } catch (error) {
    console.error("Error deleting booking:", error)
    return NextResponse.json({ error: "Failed to delete booking" }, { status: 500 })
  }
}

