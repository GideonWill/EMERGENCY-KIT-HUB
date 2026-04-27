import { validationResult } from 'express-validator'
import Product from '../models/Product.js'
import { asyncHandler } from '../utils/asyncHandler.js'

export const listProducts = asyncHandler(async (req, res) => {
  const activeOnly = req.query.active !== 'false'
  const products = await Product.findAll(activeOnly)
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
      status: p.status,
    })),
  })
})

export const getProduct = asyncHandler(async (req, res) => {
  const { id } = req.params
  let product
  // Try numeric id first, then slug
  if (/^\d+$/.test(id)) {
    product = await Product.findById(Number(id))
  }
  if (!product) {
    product = await Product.findBySlug(id)
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
      status: product.status,
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
    status: body.status || 'In Stock',
  })
  res.status(201).json({ success: true, data: { id: product._id } })
})

export const updateProduct = asyncHandler(async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() })
  }
  const existing = await Product.findById(req.params.id)
  if (!existing) {
    return res.status(404).json({ success: false, message: 'Product not found' })
  }
  const b = req.body
  const fields = {}
  if (b.name !== undefined) fields.name = b.name.trim()
  if (b.slug !== undefined) fields.slug = b.slug.trim().toLowerCase()
  if (b.description !== undefined) fields.description = b.description
  if (b.priceCents !== undefined) fields.priceCents = Math.round(Number(b.priceCents))
  if (b.image !== undefined) fields.image = b.image
  if (b.sku !== undefined) fields.sku = b.sku
  if (b.active !== undefined) fields.active = Boolean(b.active)
  if (b.status !== undefined) fields.status = b.status.trim()
  const product = await Product.update(req.params.id, fields)
  res.json({ success: true, data: { id: product._id } })
})

export const deleteProduct = asyncHandler(async (req, res) => {
  const deleted = await Product.delete(req.params.id)
  if (!deleted) {
    return res.status(404).json({ success: false, message: 'Product not found' })
  }
  res.json({ success: true, message: 'Deleted' })
})
