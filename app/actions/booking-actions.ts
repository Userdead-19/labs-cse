"use server"

import { revalidatePath } from "next/cache"
import { connectToDatabase } from "@/lib/mongodb"
import Booking from "@/models/Booking"
import Lab from "@/models/Lab"
import mongoose from "mongoose"

export async function createBooking(formData: FormData) {
  try {
    await connectToDatabase()

    // Extract form data
    const labId = formData.get("labId") as string
    const date = formData.get("date") as string
    const startTime = formData.get("startTime") as string
    const endTime = formData.get("endTime") as string
    const title = formData.get("title") as string
    const purpose = formData.get("purpose") as string
    const studentCount = Number(formData.get("studentCount"))
    const equipment = formData.get("equipment") as string
    const yearGroup = Number(formData.get("yearGroup"))
    const isExam = formData.get("isExam") === "true"

    // In a real app, this would be the current user's ID from the session
    const userId = "65f8a7b1e2c63a5e98765432" // Example MongoDB ObjectId
    const user = "Prof. John Doe" // Example user name

    // Validate the data
    if (!labId || !date || !startTime || !endTime || !purpose || !yearGroup) {
      return {
        success: false,
        message: "Please fill in all required fields",
      }
    }

    // Validate booking date
    const bookingDate = new Date(date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const oneYearFromNow = new Date()
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1)

    if (bookingDate < today) {
      return {
        success: false,
        message: "Cannot book dates in the past",
      }
    }

    if (bookingDate > oneYearFromNow) {
      return {
        success: false,
        message: "Cannot book more than a year in advance",
      }
    }

    // Check if lab exists
    if (!mongoose.Types.ObjectId.isValid(labId)) {
      return {
        success: false,
        message: "Invalid lab ID",
      }
    }

    const lab = await Lab.findById(labId)
    if (!lab) {
      return {
        success: false,
        message: "Lab not found",
      }
    }

    // Check for booking conflicts
    const conflictingBooking = await Booking.findOne({
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
      return {
        success: false,
        message: "This time slot is already booked",
      }
    }

    // Create new booking
    const newBooking = new Booking({
      labId,
      date,
      startTime,
      endTime,
      title: title || purpose,
      purpose,
      userId,
      user,
      studentCount,
      equipment,
      yearGroup,
      isExam,
      status: "pending",
    })

    await newBooking.save()

    // Revalidate the dashboard page to show the new booking
    revalidatePath("/dashboard")
    revalidatePath("/dashboard/my-bookings")

    return {
      success: true,
      message: "Booking request submitted successfully",
    }
  } catch (error) {
    console.error("Error creating booking:", error)
    return {
      success: false,
      message: "An unexpected error occurred",
    }
  }
}

export async function updateBookingStatus(id: string, status: string) {
  try {
    await connectToDatabase()

    // Validate booking ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return {
        success: false,
        message: "Invalid booking ID",
      }
    }

    // Update booking status
    const booking = await Booking.findByIdAndUpdate(id, { $set: { status } }, { new: true })

    if (!booking) {
      return {
        success: false,
        message: "Booking not found",
      }
    }

    // Revalidate the dashboard page to show the updated booking
    revalidatePath("/dashboard")
    revalidatePath("/dashboard/admin")

    return {
      success: true,
      message: `Booking ${status} successfully`,
    }
  } catch (error) {
    console.error("Error updating booking status:", error)
    return {
      success: false,
      message: "An unexpected error occurred",
    }
  }
}

export async function deleteBooking(id: string) {
  try {
    await connectToDatabase()

    // Validate booking ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return {
        success: false,
        message: "Invalid booking ID",
      }
    }

    // Delete booking
    const booking = await Booking.findByIdAndDelete(id)

    if (!booking) {
      return {
        success: false,
        message: "Booking not found",
      }
    }

    // Revalidate the dashboard page to show the updated bookings
    revalidatePath("/dashboard")
    revalidatePath("/dashboard/my-bookings")

    return {
      success: true,
      message: "Booking deleted successfully",
    }
  } catch (error) {
    console.error("Error deleting booking:", error)
    return {
      success: false,
      message: "An unexpected error occurred",
    }
  }
}

