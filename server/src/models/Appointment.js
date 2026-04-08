import mongoose from 'mongoose'

const appointmentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    scheduledAt: { type: Date, required: true },
    timeSlot: { type: String, trim: true, maxlength: 40 },
    notes: { type: String, maxlength: 2000 },
    category: {
      type: String,
      enum: ['medical', 'spiritual'],
      default: 'medical',
    },
    status: {
      type: String,
      enum: ['requested', 'confirmed', 'cancelled', 'completed'],
      default: 'requested',
    },
  },
  { timestamps: true }
)

export default mongoose.model('Appointment', appointmentSchema)
