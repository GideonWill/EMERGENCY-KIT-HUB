import mongoose from 'mongoose'
import { validationResult } from 'express-validator'
import Product from '../models/Product.js'
import { asyncHandler } from '../utils/asyncHandler.js'

export const listProducts = asyncHandler(async (req, res) => {
  const activeOnly = req.query.active !== 'false'
  const q = activeOnly ? { active: true } : {}
  const products = await Product.find(q).sort({ createdAt: -1 }).lean()
  res.json({
    success: true,
    data: products.map((p) => ({
      id: p._id,
      name: p.name,
      slug: p.slug,
      description: p.description,
      priceCents: p.priceCents,
      price: p.priceCents / 100,
      image: p.image,
      sku: p.sku,
      active: p.active,
    })),
  })
})

export const getProduct = asyncHandler(async (req, res) => {
  const { id } = req.params
  let product
  if (mongoose.Types.ObjectId.isValid(id) && String(new mongoose.Types.ObjectId(id)) === id) {
    product = await Product.findById(id).lean()
  }
  if (!product) {
    product = await Product.findOne({ slug: id }).lean()
  }
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' })
  }
  res.json({
    success: true,
    data: {
      id: product._id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      priceCents: product.priceCents,
      price: product.priceCents / 100,
      image: product.image,
      sku: product.sku,
      active: product.active,
    },
  })
})

export const createProduct = asyncHandler(async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() })
  }
  const body = req.body
  const product = await Product.create({
    name: body.name.trim(),
    slug: body.slug.trim().toLowerCase(),
    description: body.description?.trim(),
    priceCents: Math.round(Number(body.priceCents)),
    image: body.image?.trim(),
    sku: body.sku?.trim(),
    active: body.active !== false,
  })
  res.status(201).json({ success: true, data: { id: product._id } })
})

export const updateProduct = asyncHandler(async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() })
  }
  const product = await Product.findById(req.params.id)
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' })
  }
  const b = req.body
  if (b.name !== undefined) product.name = b.name.trim()
  if (b.slug !== undefined) product.slug = b.slug.trim().toLowerCase()
  if (b.description !== undefined) product.description = b.description
  if (b.priceCents !== undefined) product.priceCents = Math.round(Number(b.priceCents))
  if (b.image !== undefined) product.image = b.image
  if (b.sku !== undefined) product.sku = b.sku
  if (b.active !== undefined) product.active = Boolean(b.active)
  await product.save()
  res.json({ success: true, data: { id: product._id } })
})

export const deleteProduct = asyncHandler(async (req, res) => {
  const deleted = await Product.findByIdAndDelete(req.params.id)
  if (!deleted) {
    return res.status(404).json({ success: false, message: 'Product not found' })
  }
  res.json({ success: true, message: 'Deleted' })
})
