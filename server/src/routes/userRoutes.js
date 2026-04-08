import { Router } from 'express'
import { body } from 'express-validator'
import { protect } from '../middleware/auth.js'
import { getMe, updateMe } from '../controllers/userController.js'

const router = Router()

router.use(protect)

router.get('/me', getMe)
router.patch(
  '/me',
  [
    body('firstName').optional().trim().isLength({ max: 80 }),
    body('lastName').optional().trim().isLength({ max: 80 }),
    body('phone').optional().trim().isLength({ max: 40 }),
    body('healthPlaceholder').optional().trim().isLength({ max: 500 }),
  ],
  updateMe
)

export default router
