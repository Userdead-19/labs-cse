"use server"

import { revalidatePath } from "next/cache"
import { connectToDatabase } from "@/lib/mongodb"
import ExamPeriod from "@/models/ExamPeriod"
import Lab from "@/models/Lab"
import mongoose from "mongoose"

export async function createExamPeriod(formData: FormData) {
  try {
    await connectToDatabase()

    // Extract form data
    const name = formData.get("name") as string
    const startDate = formData.get("startDate") as string
    const endDate = formData.get("endDate") as string
    const yearGroup = Number(formData.get("yearGroup"))

    // Parse the affected labs from the form data
    const affectedLabsString = formData.get("affectedLabs") as string
    const affectedLabs = affectedLabsString ? affectedLabsString.split(",") : []

    // Validate the data
    if (!name || !startDate || !endDate || !yearGroup || affectedLabs.length === 0) {
      return {
        success: false,
        message: "Please fill in all required fields",
      }
    }

    // Validate lab IDs
    for (const labId of affectedLabs) {
      if (!mongoose.Types.ObjectId.isValid(labId)) {
        return {
          success: false,
          message: `Invalid lab ID: ${labId}`,
        }
      }

      const lab = await Lab.findById(labId)
      if (!lab) {
        return {
          success: false,
          message: `Lab not found: ${labId}`,
        }
      }
    }

    // Create new exam period
    const newExamPeriod = new ExamPeriod({
      name,
      startDate,
      endDate,
      yearGroup,
      affectedLabs,
      isActive: false,
    })

    await newExamPeriod.save()

    // Revalidate the dashboard page to show the new exam period
    revalidatePath("/dashboard/admin")

    return {
      success: true,
      message: "Exam period created successfully",
    }
  } catch (error) {
    console.error("Error creating exam period:", error)
    return {
      success: false,
      message: "An unexpected error occurred",
    }
  }
}

export async function toggleExamPeriodStatus(id: string, isActive: boolean) {
  try {
    await connectToDatabase()

    // Validate exam period ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return {
        success: false,
        message: "Invalid exam period ID",
      }
    }

    // Update exam period status
    const examPeriod = await ExamPeriod.findByIdAndUpdate(id, { $set: { isActive } }, { new: true })

    if (!examPeriod) {
      return {
        success: false,
        message: "Exam period not found",
      }
    }

    // Revalidate the dashboard page to show the updated exam period
    revalidatePath("/dashboard/admin")

    return {
      success: true,
      message: `Exam period ${isActive ? "activated" : "deactivated"} successfully`,
    }
  } catch (error) {
    console.error("Error updating exam period status:", error)
    return {
      success: false,
      message: "An unexpected error occurred",
    }
  }
}

export async function deleteExamPeriod(id: string) {
  try {
    await connectToDatabase()

    // Validate exam period ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return {
        success: false,
        message: "Invalid exam period ID",
      }
    }

    // Delete exam period
    const examPeriod = await ExamPeriod.findByIdAndDelete(id)

    if (!examPeriod) {
      return {
        success: false,
        message: "Exam period not found",
      }
    }

    // Revalidate the dashboard page to show the updated exam periods
    revalidatePath("/dashboard/admin")

    return {
      success: true,
      message: "Exam period deleted successfully",
    }
  } catch (error) {
    console.error("Error deleting exam period:", error)
    return {
      success: false,
      message: "An unexpected error occurred",
    }
  }
}

