import { Router } from 'express'
import { body } from 'express-validator'
import { protect } from '../middleware/auth.js'
import { createCheckoutSession } from '../controllers/paymentController.js'

const router = Router()

router.post(
  '/create-checkout-session',
  protect,
  [
    body('items').isArray({ min: 1 }),
    body('items.*.productId').exists(),
    body('items.*.quantity').isInt({ min: 1, max: 99 }),
    body('shippingSnapshot').optional(),
  ],
  createCheckoutSession
)

export default router
