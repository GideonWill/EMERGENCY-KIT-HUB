import { validationResult } from 'express-validator'
import Appointment from '../models/Appointment.js'
import { asyncHandler } from '../utils/asyncHandler.js'

export const createAppointment = asyncHandler(async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() })
  }
  const { scheduledAt, timeSlot, notes, category } = req.body
  const appt = await Appointment.create({
    user: req.user._id,
    scheduledAt: new Date(scheduledAt),
    timeSlot: timeSlot?.trim(),
    notes: notes?.trim(),
    category: category === 'spiritual' ? 'spiritual' : 'medical',
    status: 'requested',
  })
  res.status(201).json({ success: true, data: appt })
})

export const listMyAppointments = asyncHandler(async (req, res) => {
  const list = await Appointment.find({ user: req.user._id }).sort({ scheduledAt: 1 }).lean()
  res.json({ success: true, data: list })
})

export const listAllAppointments = asyncHandler(async (req, res) => {
  const list = await Appointment.find({})
    .populate('user', 'email profile.firstName profile.lastName')
    .sort({ scheduledAt: 1 })
    .lean()
  res.json({ success: true, data: list })
})

export const updateAppointmentStatus = asyncHandler(async (req, res) => {
  const { status } = req.body
  const allowed = ['requested', 'confirmed', 'cancelled', 'completed']
  if (!allowed.includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid status' })
  }
  const appt = await Appointment.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  ).lean()
  if (!appt) {
    return res.status(404).json({ success: false, message: 'Not found' })
  }
  res.json({ success: true, data: appt })
})
