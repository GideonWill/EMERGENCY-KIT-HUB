import { Router } from 'express'
import { body } from 'express-validator'
import { protect, adminOnly } from '../middleware/auth.js'
import {
  createAppointment,
  listMyAppointments,
  listAllAppointments,
  updateAppointmentStatus,
} from '../controllers/appointmentController.js'

const router = Router()

router.post(
  '/',
  protect,
  [
    body('scheduledAt').isISO8601(),
    body('timeSlot').optional().trim().isLength({ max: 40 }),
    body('notes').optional().trim().isLength({ max: 2000 }),
    body('category').optional().isIn(['medical', 'spiritual']),
  ],
  createAppointment
)

router.get('/my', protect, listMyAppointments)
router.get('/', protect, adminOnly, listAllAppointments)
router.patch('/:id/status', protect, adminOnly, [body('status').isIn(['requested', 'confirmed', 'cancelled', 'completed'])], updateAppointmentStatus)

export default router
