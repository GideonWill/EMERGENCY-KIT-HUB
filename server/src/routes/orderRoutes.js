import { Router } from 'express'
import { protect, adminOnly } from '../middleware/auth.js'
import { listMyOrders, listAllOrders, getOrder, simulateOrder, updateOrderStatus, trackOrder } from '../controllers/orderController.js'

const router = Router()

router.post('/simulate', protect, simulateOrder)
router.get('/my', protect, listMyOrders)
router.get('/all', protect, adminOnly, listAllOrders)
router.get('/track/:id', trackOrder) // Public route
router.get('/:id', protect, getOrder)
router.put('/:id/status', protect, adminOnly, updateOrderStatus)

export default router
