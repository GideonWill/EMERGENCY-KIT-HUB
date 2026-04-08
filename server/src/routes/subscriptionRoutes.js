import { Router } from 'express'
import { protect } from '../middleware/auth.js'
import { createSubscriptionCheckout, listMySubscriptions } from '../controllers/subscriptionController.js'

const router = Router()

router.get('/my', protect, listMySubscriptions)
router.post('/create-checkout-session', protect, createSubscriptionCheckout)

export default router
