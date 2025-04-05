import mongoose, { Schema, type Document } from "mongoose"

export interface IBooking extends Document {
  labId: mongoose.Types.ObjectId
  date: string
  startTime: string
  endTime: string
  title: string
  purpose: string
  userId: mongoose.Types.ObjectId
  user: string
  studentCount: number
  equipment: string
  status: "pending" | "approved" | "rejected"
  yearGroup: number
  isExam: boolean
  createdAt: Date
  updatedAt: Date
}

const BookingSchema: Schema = new Schema(
  {
    labId: { type: mongoose.Schema.Types.ObjectId, ref: "Lab", required: true },
    date: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    title: { type: String, required: true },
    purpose: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    user: { type: String, required: true },
    studentCount: { type: Number, required: true },
    equipment: { type: String },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    yearGroup: {
      type: Number,
      enum: [1, 2, 3, 4],
      required: true,
    },
    isExam: { type: Boolean, default: false },
  },
  { timestamps: true },
)

// Create compound index for checking conflicts
BookingSchema.index({
  labId: 1,
  date: 1,
  startTime: 1,
  endTime: 1,
  status: 1,
})

// Create index for year group queries
BookingSchema.index({ yearGroup: 1 })

export default mongoose.models.Booking || mongoose.model<IBooking>("Booking", BookingSchema)

