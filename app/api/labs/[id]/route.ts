import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import Lab from "@/models/Lab"
import mongoose from "mongoose"

export const dynamic = "force-dynamic"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: "Invalid lab ID" }, { status: 400 })
    }

    await connectToDatabase()
    const lab = await Lab.findById(params.id)

    if (!lab) {
      return NextResponse.json({ error: "Lab not found" }, { status: 404 })
    }

    return NextResponse.json(lab)
  } catch (error) {
    console.error("Error fetching lab:", error)
    return NextResponse.json({ error: "Failed to fetch lab" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: "Invalid lab ID" }, { status: 400 })
    }

    const body = await request.json()

    await connectToDatabase()
    const lab = await Lab.findByIdAndUpdate(params.id, { $set: body }, { new: true, runValidators: true })

    if (!lab) {
      return NextResponse.json({ error: "Lab not found" }, { status: 404 })
    }

    return NextResponse.json(lab)
  } catch (error) {
    console.error("Error updating lab:", error)
    return NextResponse.json({ error: "Failed to update lab" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: "Invalid lab ID" }, { status: 400 })
    }

    await connectToDatabase()
    const lab = await Lab.findByIdAndDelete(params.id)

    if (!lab) {
      return NextResponse.json({ error: "Lab not found" }, { status: 404 })
    }

    return NextResponse.json(lab)
  } catch (error) {
    console.error("Error deleting lab:", error)
    return NextResponse.json({ error: "Failed to delete lab" }, { status: 500 })
  }
}

