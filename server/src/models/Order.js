import mongoose from 'mongoose'

const orderItemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: { type: String, required: true },
    unitPriceCents: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    image: { type: String },
  },
  { _id: false }
)

const shippingSnapshotSchema = new mongoose.Schema(
  {
    line1: String,
    city: String,
    state: String,
    postalCode: String,
    country: { type: String, default: 'US' },
  },
  { _id: false }
)

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: { type: [orderItemSchema], required: true },
    totalCents: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ['pending', 'paid', 'processing', 'shipped', 'cancelled'],
      default: 'pending',
    },
    stripeCheckoutSessionId: { type: String },
    shippingSnapshot: shippingSnapshotSchema,
  },
  { timestamps: true }
)

export default mongoose.model('Order', orderSchema)
