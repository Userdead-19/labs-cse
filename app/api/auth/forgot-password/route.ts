import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import User from "@/models/User"

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email } = body

    // Validate required fields
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    await connectToDatabase()

    // Check if user exists
    const user = await User.findOne({ email })

    // For security reasons, always return success even if the email doesn't exist
    // This prevents email enumeration attacks

    // In a real application, you would:
    // 1. Generate a password reset token
    // 2. Store it in the database with an expiration time
    // 3. Send an email with a link containing the token

    return NextResponse.json({
      success: true,
      message: "If an account with that email exists, a password reset link has been sent.",
    })
  } catch (error) {
    console.error("Forgot password error:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}

