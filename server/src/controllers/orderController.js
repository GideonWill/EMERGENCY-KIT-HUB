import Order from '../models/Order.js'
import { asyncHandler } from '../utils/asyncHandler.js'

export const listMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.findByUser(req.user._id)
  res.json({ success: true, data: orders })
})

export const listAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.findAllWithUser()
  res.json({ success: true, data: orders })
})

export const getOrder = asyncHandler(async (req, res) => {
  const id = Number(req.params.id)
  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ success: false, message: 'Invalid order id' })
  }
  const order = await Order.findById(id)
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' })
  }
  if (order.user !== req.user._id && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Forbidden' })
  }
  res.json({ success: true, data: order })
})

import Product from '../models/Product.js'

export const simulateOrder = asyncHandler(async (req, res) => {
  const { items, method } = req.body
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ success: false, message: 'items[] required' })
  }

  const productIds = [...new Set(items.map((i) => Number(i.productId)))]
  const products = await Product.findByIds(productIds)
  if (products.length !== productIds.length) {
    return res.status(400).json({ success: false, message: 'One or more products are invalid or inactive' })
  }

  const orderItems = []
  let totalCents = 0

  for (const line of items) {
    const p = products.find((x) => x._id === Number(line.productId))
    const qty = Math.min(99, Math.max(1, parseInt(line.quantity, 10) || 1))
    const subtotal = p.priceCents * qty
    totalCents += subtotal
    orderItems.push({
      productId: p._id,
      name: p.name,
      unitPriceCents: p.priceCents,
      quantity: qty,
      image: p.image,
    })
  }

  const order = await Order.create({
    userId: req.user._id,
    items: orderItems,
    totalCents,
    status: 'pending',
    shippingSnapshot: { method },
  })

  // To simulate the entire flow of checkout, we mark it paid if needed or just leave it pending
  res.status(201).json({ success: true, data: order })
})

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const id = Number(req.params.id)
  const { status } = req.body
  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ success: false, message: 'Invalid order id' })
  }
  if (!status) {
    return res.status(400).json({ success: false, message: 'status required' })
  }
  const order = await Order.updateStatus(id, status)
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' })
  }
  res.json({ success: true, data: order })
})
