import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { validationResult } from 'express-validator'
import User from '../models/User.js'
import { asyncHandler } from '../utils/asyncHandler.js'

function signToken(user) {
  return jwt.sign(
    { userId: String(user._id), role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  )
}

export const register = asyncHandler(async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() })
  }
  const { email, password, firstName, lastName, phone } = req.body
  const existing = await User.findByEmail(email)
  if (existing) {
    return res.status(409).json({ success: false, message: 'Email already registered' })
  }
  const passwordHash = await bcrypt.hash(password, 12)
  const user = await User.create({
    email: email.toLowerCase().trim(),
    passwordHash,
    firstName,
    lastName,
    phone,
    role: 'user',
  })
  const token = signToken(user)
  res.status(201).json({
    success: true,
    data: {
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        profile: user.profile,
      },
    },
  })
})

export const login = asyncHandler(async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() })
  }
  const { email, password } = req.body
  const user = await User.findByEmailWithPassword(email)
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(401).json({ success: false, message: 'Invalid email or password' })
  }
  const token = signToken(user)
  res.json({
    success: true,
    data: {
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        profile: user.profile,
      },
    },
  })
})
