import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import User from "@/models/User"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  try {
    // Get URL parameters
    const { searchParams } = new URL(request.url)
    const role = searchParams.get("role")
    const department = searchParams.get("department")
    const yearGroup = searchParams.get("yearGroup")

    // Build query
    const query: any = {}

    if (role) {
      query.role = role
    }

    if (department) {
      query.department = department
    }

    if (yearGroup) {
      query.yearGroup = Number.parseInt(yearGroup)
    }

    await connectToDatabase()
    const users = await User.find(query)
      .select("-password") // Exclude password
      .sort({ name: 1 })

    return NextResponse.json(users)
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.name || !body.email || !body.password || !body.department || !body.role) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Validate yearGroup for Student and YearCoordinator roles
    if ((body.role === "Student" || body.role === "YearCoordinator") && !body.yearGroup) {
      return NextResponse.json({ error: "Year group is required for students and year coordinators" }, { status: 400 })
    }

    await connectToDatabase()

    // Check if email already exists
    const existingUser = await User.findOne({ email: body.email })
    if (existingUser) {
      return NextResponse.json({ error: "Email already in use" }, { status: 409 })
    }

    // Create new user
    const newUser = new User(body)
    await newUser.save()

    // Exclude password from response
    const userResponse = newUser.toObject()
    delete userResponse.password

    return NextResponse.json(userResponse, { status: 201 })
  } catch (error) {
    console.error("Error creating user:", error)
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
  }
}

