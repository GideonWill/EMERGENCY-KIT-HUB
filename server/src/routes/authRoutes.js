import { Router } from 'express'
import { body } from 'express-validator'
import { register, login } from '../controllers/authController.js'

const router = Router()

const emailCheck = body('email').isEmail().normalizeEmail().withMessage('Valid email required')
const passwordCheck = body('password')
  .isLength({ min: 8, max: 128 })
  .withMessage('Password must be 8–128 characters')

router.post('/register', [emailCheck, passwordCheck], register)
router.post('/login', [emailCheck, body('password').notEmpty()], login)

export default router
