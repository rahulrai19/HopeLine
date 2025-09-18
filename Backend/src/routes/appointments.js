import { Router } from 'express'
import Appointment from '../models/Appointment.js'
import { protectRoute } from '../middleware/protectRoute.js'

const router = Router()

router.post('/book', protectRoute, async (req, res) => {
  const { studentId, counselorId, startsAt } = req.body
  const appt = await Appointment.create({ studentId, counselorId, startsAt })
  res.status(201).json(appt)
})

export default router


