import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import User from "@/models/User"
import mongoose from "mongoose"

export const dynamic = "force-dynamic"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 })
    }

    await connectToDatabase()
    const user = await User.findById(params.id).select("-password")

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error("Error fetching user:", error)
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 })
    }

    const body = await request.json()

    await connectToDatabase()

    // Check if email already exists (if changing email)
    if (body.email) {
      const existingUser = await User.findOne({
        email: body.email,
        _id: { $ne: params.id },
      })

      if (existingUser) {
        return NextResponse.json({ error: "Email already in use" }, { status: 409 })
      }
    }

    // If updating password, hash it
    if (body.password) {
      const user = await User.findById(params.id)
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 })
      }

      user.password = body.password
      await user.save()

      // Remove password from body to avoid double hashing
      delete body.password

      // If there are no other fields to update, return the user
      if (Object.keys(body).length === 0) {
        const userResponse = user.toObject()
        delete userResponse.password
        return NextResponse.json(userResponse)
      }
    }

    // Update user
    const user = await User.findByIdAndUpdate(params.id, { $set: body }, { new: true, runValidators: true }).select(
      "-password",
    )

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 })
    }

    await connectToDatabase()
    const user = await User.findByIdAndDelete(params.id)

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Exclude password from response
    const userResponse = user.toObject()
    delete userResponse.password

    return NextResponse.json(userResponse)
  } catch (error) {
    console.error("Error deleting user:", error)
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 })
  }
}

