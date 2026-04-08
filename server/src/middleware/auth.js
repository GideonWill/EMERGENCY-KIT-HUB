import jwt from 'jsonwebtoken'
import User from '../models/User.js'

export async function protect(req, res, next) {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Not authorized — no token' })
  }
  const token = header.slice(7)
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.userId).select('-passwordHash')
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' })
    }
    req.user = user
    req.tokenPayload = decoded
    next()
  } catch {
    return res.status(401).json({ success: false, message: 'Not authorized — invalid token' })
  }
}

export function adminOnly(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Admin access required' })
  }
  next()
}
