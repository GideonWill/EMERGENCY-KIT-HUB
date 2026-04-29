import { Router } from 'express'
import { rateLimit } from 'express-rate-limit'
import { protect, adminOnly } from '../middleware/auth.js'
import { listMyOrders, listAllOrders, getOrder, simulateOrder, updateOrderStatus, trackOrder } from '../controllers/orderController.js'

const router = Router()

router.post('/simulate', protect, simulateOrder)
router.get('/my', protect, listMyOrders)
router.get('/all', protect, adminOnly, listAllOrders)

const trackLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10,
  message: { success: false, message: 'Too many tracking requests, please try again later.' }
})
router.get('/track/:id', trackLimiter, trackOrder) // Public route
router.get('/:id', protect, getOrder)
router.put('/:id/status', protect, adminOnly, updateOrderStatus)

export default router
