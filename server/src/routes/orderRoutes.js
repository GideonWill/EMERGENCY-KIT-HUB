import { Router } from 'express'
import { protect, adminOnly } from '../middleware/auth.js'
import { listMyOrders, listAllOrders, getOrder } from '../controllers/orderController.js'

const router = Router()

router.get('/my', protect, listMyOrders)
router.get('/all', protect, adminOnly, listAllOrders)
router.get('/:id', protect, getOrder)

export default router
