import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import User from "@/models/User"
import { generateToken } from "@/lib/jwt"
// import { logger } from "@/lib/logger"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    await connectToDatabase()

    // Find user by email
    const user = await User.findOne({ email })

    // If user not found or password doesn't match
    if (!user) {
      // logger.warn("Failed login attempt - user not found", { email })
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password",
        },
        { status: 401 },
      )
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password)
    if (!isPasswordValid) {
      // logger.warn("Failed login attempt - invalid password", { email })
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password",
        },
        { status: 401 },
      )
    }

    // Generate JWT token
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    })

    // Log successful login
    // logger.info("User logged in successfully", { userId: user._id.toString(), email: user.email })

    // Remove sensitive data from user
    const userResponse = user.toObject()
    delete userResponse.password

    // Create response
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
      maxAge: 60 * 60 * 24 * 7, // 7 days in seconds
      path: "/",
      sameSite: "lax", // Changed from strict to lax for better compatibility
      secure: process.env.NODE_ENV === "production",
    })

    return response
  } catch (error) {
    // logger.error("Login error", { error: (error as Error).message })
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred during login",
      },
      { status: 500 },
    )
  }
}

