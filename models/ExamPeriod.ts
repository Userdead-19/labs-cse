import mongoose, { Schema, type Document } from "mongoose"

export interface IExamPeriod extends Document {
  name: string
  startDate: string
  endDate: string
  yearGroup: number
  affectedLabs: mongoose.Types.ObjectId[]
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const ExamPeriodSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    yearGroup: {
      type: Number,
      enum: [1, 2, 3, 4],
      required: true,
    },
    affectedLabs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lab",
        required: true,
      },
    ],
    isActive: { type: Boolean, default: false },
  },
  { timestamps: true },
)

export default mongoose.models.ExamPeriod || mongoose.model<IExamPeriod>("ExamPeriod", ExamPeriodSchema)

