import { validationResult } from 'express-validator'
import User from '../models/User.js'
import Subscription from '../models/Subscription.js'
import { asyncHandler } from '../utils/asyncHandler.js'

export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
  const subscriptions = await Subscription.findByUser(req.user._id)
  const isSubscriber = subscriptions.some(s => s.status === 'active')

  res.json({
    success: true,
    data: {
      id: user._id,
      email: user.email,
      role: user.role,
      profile: user.profile || {},
      stripeCustomerId: user.stripeCustomerId,
      isSubscriber,
      createdAt: user.createdAt,
    },
  })
})

export const updateMe = asyncHandler(async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() })
  }
  const { firstName, lastName, phone, healthPlaceholder } = req.body
  const user = await User.updateProfile(req.user._id, {
    firstName: firstName !== undefined ? (firstName?.trim() || null) : undefined,
    lastName: lastName !== undefined ? (lastName?.trim() || null) : undefined,
    phone: phone !== undefined ? (phone?.trim() || null) : undefined,
    healthPlaceholder: healthPlaceholder !== undefined ? (healthPlaceholder?.trim() || '') : undefined,
  })
  res.json({
    success: true,
    data: {
      id: user._id,
      email: user.email,
      role: user.role,
      profile: user.profile,
    },
  })
})
