import mongoose, { Schema, type Document } from "mongoose"

export interface ILab extends Document {
  name: string
  location: string
  building: string
  capacity: number
  description: string
  equipment: string[]
  openingHours: {
    monday: { open: string; close: string }
    tuesday: { open: string; close: string }
    wednesday: { open: string; close: string }
    thursday: { open: string; close: string }
    friday: { open: string; close: string }
    saturday: { open: string; close: string }
    sunday: { open: string; close: string }
  }
  status: string
  createdAt: Date
  updatedAt: Date
}

const OpeningHoursSchema = new Schema(
  {
    open: { type: String },
    close: { type: String },
  },
  { _id: false },
)

const LabSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    location: { type: String, required: true },
    building: { type: String, required: true },
    capacity: { type: Number, required: true },
    description: { type: String, required: true },
    equipment: [{ type: String }],
    openingHours: {
      monday: { type: OpeningHoursSchema, required: true },
      tuesday: { type: OpeningHoursSchema, required: true },
      wednesday: { type: OpeningHoursSchema, required: true },
      thursday: { type: OpeningHoursSchema, required: true },
      friday: { type: OpeningHoursSchema, required: true },
      saturday: { type: OpeningHoursSchema, required: true },
      sunday: { type: OpeningHoursSchema, required: true },
    },
    status: {
      type: String,
      enum: ["operational", "maintenance", "closed"],
      default: "operational",
    },
  },
  { timestamps: true },
)

export default mongoose.models.Lab || mongoose.model<ILab>("Lab", LabSchema)

