"use server"

import { revalidatePath } from "next/cache"
import { connectToDatabase } from "@/lib/mongodb"
import User from "@/models/User"
import mongoose from "mongoose"

export async function createUser(formData: FormData) {
  try {
    await connectToDatabase()

    // Extract form data
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const department = formData.get("department") as string
    const role = formData.get("role") as string
    const yearGroup = formData.get("yearGroup") ? Number(formData.get("yearGroup")) : undefined

    // Validate the data
    if (!name || !email || !password || !department || !role) {
      return {
        success: false,
        message: "Please fill in all required fields",
      }
    }

    // Validate yearGroup for Student and YearCoordinator roles
    if ((role === "Student" || role === "YearCoordinator") && !yearGroup) {
      return {
        success: false,
        message: "Year group is required for students and year coordinators",
      }
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return {
        success: false,
        message: "Email already in use",
      }
    }

    // Create new user
    const newUser = new User({
      name,
      email,
      password,
      department,
      role,
      yearGroup,
    })

    await newUser.save()

    // Revalidate the users page
    revalidatePath("/dashboard/admin")

    return {
      success: true,
      message: "User created successfully",
    }
  } catch (error) {
    console.error("Error creating user:", error)
    return {
      success: false,
      message: "An unexpected error occurred",
    }
  }
}

export async function updateUser(id: string, formData: FormData) {
  try {
    await connectToDatabase()

    // Validate user ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return {
        success: false,
        message: "Invalid user ID",
      }
    }

    // Extract form data
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const department = formData.get("department") as string
    const role = formData.get("role") as string
    const yearGroup = formData.get("yearGroup") ? Number(formData.get("yearGroup")) : undefined
    const password = formData.get("password") as string

    // Validate the data
    if (!name || !email || !department || !role) {
      return {
        success: false,
        message: "Please fill in all required fields",
      }
    }

    // Validate yearGroup for Student and YearCoordinator roles
    if ((role === "Student" || role === "YearCoordinator") && !yearGroup) {
      return {
        success: false,
        message: "Year group is required for students and year coordinators",
      }
    }

    // Check if email already exists
    const existingUser = await User.findOne({
      email,
      _id: { $ne: id },
    })

    if (existingUser) {
      return {
        success: false,
        message: "Email already in use",
      }
    }

    // Update user
    const updateData: any = {
      name,
      email,
      department,
      role,
      yearGroup,
    }

    // If password is provided, update it
    if (password) {
      const user = await User.findById(id)
      if (!user) {
        return {
          success: false,
          message: "User not found",
        }
      }

      user.password = password
      await user.save()
    }

    const user = await User.findByIdAndUpdate(id, { $set: updateData }, { new: true, runValidators: true })

    if (!user) {
      return {
        success: false,
        message: "User not found",
      }
    }

    // Revalidate the dashboard page to show the updated user
    revalidatePath("/dashboard/admin")

    return {
      success: true,
      message: "User updated successfully",
    }
  } catch (error) {
    console.error("Error updating user:", error)
    return {
      success: false,
      message: "An unexpected error occurred",
    }
  }
}

export async function deleteUser(id: string) {
  try {
    await connectToDatabase()

    // Validate user ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return {
        success: false,
        message: "Invalid user ID",
      }
    }

    // Delete user
    const user = await User.findByIdAndDelete(id)

    if (!user) {
      return {
        success: false,
        message: "User not found",
      }
    }

    // Revalidate the dashboard page to show the updated users
    revalidatePath("/dashboard/admin")

    return {
      success: true,
      message: "User deleted successfully",
    }
  } catch (error) {
    console.error("Error deleting user:", error)
    return {
      success: false,
      message: "An unexpected error occurred",
    }
  }
}

