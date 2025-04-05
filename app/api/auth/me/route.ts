import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import User from "@/models/User"
import { verifyToken } from "@/lib/jwt"
import { logger } from "@/lib/logger"

export async function GET(request: Request) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get("Authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        {
          success: false,
          message: "Authentication required",
        },
        { status: 401 },
      )
    }

    const token = authHeader.split(" ")[1]
    const payload = verifyToken(token)

    if (!payload) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid or expired token",
        },
        { status: 401 },
      )
    }

    await connectToDatabase()

    // Find user by ID
    const user = await User.findById(payload.userId).select("-password") // Exclude password

    if (!user) {
      logger.warn("User not found for authenticated token", { userId: payload.userId })
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 },
      )
    }

    logger.info("User data retrieved", { userId: payload.userId })

    return NextResponse.json({
      success: true,
      user,
    })
  } catch (error) {
    logger.error("Get user error", { error: (error as Error).message })
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while retrieving user information",
        error: (error as Error).message,
      },
      { status: 500 },
    )
  }
}

