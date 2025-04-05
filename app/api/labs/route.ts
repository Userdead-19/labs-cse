import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import Lab from "@/models/Lab"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    await connectToDatabase()
    const labs = await Lab.find({}).sort({ name: 1 })
    return NextResponse.json(labs)
  } catch (error) {
    console.error("Error fetching labs:", error)
    return NextResponse.json({ error: "Failed to fetch labs" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.name || !body.building || !body.capacity) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    await connectToDatabase()
    const newLab = new Lab(body)
    await newLab.save()

    return NextResponse.json(newLab, { status: 201 })
  } catch (error) {
    console.error("Error creating lab:", error)
    return NextResponse.json({ error: "Failed to create lab" }, { status: 500 })
  }
}

