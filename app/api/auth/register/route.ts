import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import User from "@/models/User"
import { generateToken } from "@/lib/jwt"
import { logger } from "@/lib/logger"

export async function POST(request: Request) {
  try {
    const { name, email, password, department, role = "Student", yearGroup } = await request.json()

    await connectToDatabase()

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      logger.warn("Registration attempt with existing email", { email })
      return NextResponse.json({ success: false, message: "Email already registered" }, { status: 400 })
    }

    // Create new user
    const newUser = new User({
      name,
      email,
      password, // Will be hashed by the pre-save hook
      department,
      role,
      yearGroup,
    })

    await newUser.save()

    // Generate JWT token
    const token = generateToken({
      userId: newUser._id.toString(),
      email,
      role,
    })

    // Log successful registration
    logger.info("New user registered", { userId: newUser._id.toString(), email })

    const response = NextResponse.json({
      success: true,
      message: "Registration successful",
      userId: newUser._id,
      token,
    })

    // Set cookie with token
    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    })

    return response
  } catch (error) {
    logger.error("Registration error", { error: (error as Error).message })
    return NextResponse.json({ success: false, message: "An error occurred during registration" }, { status: 500 })
  }
}

