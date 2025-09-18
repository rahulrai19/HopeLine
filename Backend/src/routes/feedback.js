import { Router } from 'express'
import Feedback from '../models/Feedback.js'
import Appointment from '../models/Appointment.js'

const router = Router()

router.post('/submit', async (req, res) => {
  const { studentId, counselorId, appointmentId, rating, comment } = req.body
  const feedback = await Feedback.create({ studentId, counselorId, appointmentId, rating, comment })
  await Appointment.findByIdAndUpdate(appointmentId, { status: 'completed' })
  res.status(201).json(feedback)
})

export default router


