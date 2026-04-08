import mongoose from 'mongoose'

const paymentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
    stripeSessionId: { type: String },
    stripePaymentIntentId: { type: String },
    amountCents: { type: Number, required: true },
    currency: { type: String, default: 'usd' },
    status: {
      type: String,
      enum: ['pending', 'succeeded', 'failed'],
      default: 'pending',
    },
    metadata: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true }
)

export default mongoose.model('Payment', paymentSchema)
