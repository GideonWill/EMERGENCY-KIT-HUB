import mongoose from 'mongoose'

const subscriptionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    planName: { type: String, required: true, trim: true, maxlength: 120 },
    status: {
      type: String,
      enum: ['incomplete', 'active', 'past_due', 'canceled', 'unpaid'],
      default: 'incomplete',
    },
    stripeSubscriptionId: { type: String },
    stripePriceId: { type: String },
    currentPeriodEnd: { type: Date },
  },
  { timestamps: true }
)

export default mongoose.model('Subscription', subscriptionSchema)
