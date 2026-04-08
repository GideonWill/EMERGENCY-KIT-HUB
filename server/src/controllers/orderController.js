import mongoose from 'mongoose'
import Order from '../models/Order.js'
import { asyncHandler } from '../utils/asyncHandler.js'

export const listMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 }).lean()
  res.json({ success: true, data: orders })
})

export const listAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({})
    .populate('user', 'email profile.firstName profile.lastName')
    .sort({ createdAt: -1 })
    .lean()
  res.json({ success: true, data: orders })
})

export const getOrder = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ success: false, message: 'Invalid order id' })
  }
  const order = await Order.findById(req.params.id).lean()
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' })
  }
  if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Forbidden' })
  }
  res.json({ success: true, data: order })
})
