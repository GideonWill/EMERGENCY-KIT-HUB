import { validationResult } from 'express-validator'
import User from '../models/User.js'
import { asyncHandler } from '../utils/asyncHandler.js'

export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-passwordHash')
  res.json({
    success: true,
    data: {
      id: user._id,
      email: user.email,
      role: user.role,
      profile: user.profile || {},
      stripeCustomerId: user.stripeCustomerId,
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
  const user = await User.findById(req.user._id)
  user.profile = user.profile || {}
  if (firstName !== undefined) user.profile.firstName = firstName?.trim() || undefined
  if (lastName !== undefined) user.profile.lastName = lastName?.trim() || undefined
  if (phone !== undefined) user.profile.phone = phone?.trim() || undefined
  if (healthPlaceholder !== undefined) user.profile.healthPlaceholder = healthPlaceholder?.trim() || ''
  await user.save()
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
