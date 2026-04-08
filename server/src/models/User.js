import mongoose from 'mongoose'

const profileSchema = new mongoose.Schema(
  {
    firstName: { type: String, trim: true, maxlength: 80 },
    lastName: { type: String, trim: true, maxlength: 80 },
    phone: { type: String, trim: true, maxlength: 40 },
    /** Non-sensitive placeholder only — never store real PHI here */
    healthPlaceholder: { type: String, maxlength: 500 },
  },
  { _id: false }
)

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 254,
    },
    passwordHash: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    profile: profileSchema,
    stripeCustomerId: { type: String },
  },
  { timestamps: true }
)

export default mongoose.model('User', userSchema)
