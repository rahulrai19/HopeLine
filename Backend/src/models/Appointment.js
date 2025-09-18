import mongoose from 'mongoose'

const appointmentSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  counselorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  startsAt: { type: Date, required: true },
  status: { type: String, enum: ['booked','completed','cancelled'], default: 'booked' }
}, { timestamps: true })

export default mongoose.model('Appointment', appointmentSchema)


