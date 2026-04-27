import express from 'express'
import PaystackAdmin from '../controllers/paystackAdminController.js'
import { protect, adminOnly } from '../middleware/auth.js'

const router = express.Router()

// All these routes are protected and admin only
router.get('/transactions', protect, adminOnly, PaystackAdmin.listTransactions)
router.get('/customers', protect, adminOnly, PaystackAdmin.listCustomers)

export default router
