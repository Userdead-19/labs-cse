import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { connectToDatabase } from "@/lib/mongodb"
import User from "@/models/User"
import { verifyToken } from "@/lib/jwt" // should use `jose`

export async function GET() {
  try {
    // ✅ Correct way to get cookie in app directory
    const token = (await cookies()).get("token")?.value

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Authentication required",
        },
        { status: 401 }
      )
    }

    const payload = await verifyToken(token)

    if (!payload) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid or expired token",
        },
        { status: 401 }
      )
    }

    await connectToDatabase()

    const user = await User.findById(payload.userId).select("-password")

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      user,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while retrieving user information",
        error: (error as Error).message,
      },
      { status: 500 }
    )
  }
}
