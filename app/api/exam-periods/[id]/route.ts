import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import ExamPeriod from "@/models/ExamPeriod"
import mongoose from "mongoose"

export const dynamic = "force-dynamic"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: "Invalid exam period ID" }, { status: 400 })
    }

    await connectToDatabase()
    const examPeriod = await ExamPeriod.findById(params.id).populate("affectedLabs", "name building")

    if (!examPeriod) {
      return NextResponse.json({ error: "Exam period not found" }, { status: 404 })
    }

    return NextResponse.json(examPeriod)
  } catch (error) {
    console.error("Error fetching exam period:", error)
    return NextResponse.json({ error: "Failed to fetch exam period" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: "Invalid exam period ID" }, { status: 400 })
    }

    const body = await request.json()

    await connectToDatabase()
    const examPeriod = await ExamPeriod.findByIdAndUpdate(params.id, { $set: body }, { new: true, runValidators: true })

    if (!examPeriod) {
      return NextResponse.json({ error: "Exam period not found" }, { status: 404 })
    }

    return NextResponse.json(examPeriod)
  } catch (error) {
    console.error("Error updating exam period:", error)
    return NextResponse.json({ error: "Failed to update exam period" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: "Invalid exam period ID" }, { status: 400 })
    }

    await connectToDatabase()
    const examPeriod = await ExamPeriod.findByIdAndDelete(params.id)

    if (!examPeriod) {
      return NextResponse.json({ error: "Exam period not found" }, { status: 404 })
    }

    return NextResponse.json(examPeriod)
  } catch (error) {
    console.error("Error deleting exam period:", error)
    return NextResponse.json({ error: "Failed to delete exam period" }, { status: 500 })
  }
}

