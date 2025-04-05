import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import User from "@/models/User"
import { generateToken } from "@/lib/jwt"
import { logger } from "@/lib/logger"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    await connectToDatabase()

    // Find user by email
    const user = await User.findOne({ email })

    // If user not found or password doesn't match
    if (!user || !(await user.comparePassword(password))) {
      logger.warn("Failed login attempt", { email })
      return NextResponse.json({ success: false, message: "Invalid email or password" }, { status: 401 })
    }

    // Generate JWT token
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    })

    // Log successful login
    logger.info("User logged in successfully", { userId: user._id.toString(), email: user.email })

    // Remove sensitive data from user
    const userResponse = user.toObject()
    delete userResponse.password

    const response = NextResponse.json({
      success: true,
      message: "Login successful",
      user: userResponse,
      token,
    })

    // Set cookie with token (for browser access)
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
    logger.error("Login error", { error: (error as Error).message })
    return NextResponse.json({ success: false, message: "An error occurred during login" }, { status: 500 })
  }
}

