import mongoose from 'mongoose'

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 200 },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, maxlength: 8000 },
    /** Integer cents — source of truth for checkout */
    priceCents: { type: Number, required: true, min: 0 },
    image: { type: String, maxlength: 2000 },
    sku: { type: String, trim: true, maxlength: 64 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
)

export default mongoose.model('Product', productSchema)
