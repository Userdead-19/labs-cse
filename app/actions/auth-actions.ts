"use server"

import { revalidatePath } from "next/cache"
import { connectToDatabase } from "@/lib/mongodb"
import User from "@/models/User"

export async function loginUser(formData: FormData) {
  try {
    await connectToDatabase()

    const email = formData.get("email") as string
    const password = formData.get("password") as string

    // Validate required fields
    if (!email || !password) {
      return {
        success: false,
        message: "Email and password are required",
      }
    }

    // Find user by email
    const user = await User.findOne({ email })

    if (!user) {
      return {
        success: false,
        message: "Invalid email or password",
      }
    }

    // Compare password
    const isPasswordValid = await user.comparePassword(password)

    if (!isPasswordValid) {
      return {
        success: false,
        message: "Invalid email or password",
      }
    }

    // In a real app, you would create a session or JWT token here
    // For now, we'll just return success

    return {
      success: true,
      message: "Login successful",
      // Don't return the password
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        yearGroup: user.yearGroup,
      },
    }
  } catch (error) {
    console.error("Login error:", error)
    return {
      success: false,
      message: "An unexpected error occurred",
    }
  }
}

export async function registerUser(formData: FormData) {
  try {
    await connectToDatabase()

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
      message: "Registration successful",
    }
  } catch (error) {
    console.error("Registration error:", error)
    return {
      success: false,
      message: "An unexpected error occurred",
    }
  }
}

export async function forgotPassword(formData: FormData) {
  try {
    await connectToDatabase()

    const email = formData.get("email") as string

    // Validate required fields
    if (!email) {
      return {
        success: false,
        message: "Email is required",
      }
    }

    // Check if user exists
    const user = await User.findOne({ email })

    // For security reasons, always return success even if the email doesn't exist
    // This prevents email enumeration attacks

    // In a real application, you would:
    // 1. Generate a password reset token
    // 2. Store it in the database with an expiration time
    // 3. Send an email with a link containing the token

    return {
      success: true,
      message: "If an account with that email exists, a password reset link has been sent.",
    }
  } catch (error) {
    console.error("Forgot password error:", error)
    return {
      success: false,
      message: "An unexpected error occurred",
    }
  }
}

