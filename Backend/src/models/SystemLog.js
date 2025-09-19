import mongoose from 'mongoose'

const systemLogSchema = new mongoose.Schema({
  level: { type: String, enum: ['info', 'warning', 'error', 'critical'], required: true },
  category: { type: String, enum: ['auth', 'chat', 'assessment', 'appointment', 'system'], required: true },
  message: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  metadata: {
    ip: String,
    userAgent: String,
    endpoint: String,
    responseTime: Number,
    errorCode: String
  },
  timestamp: { type: Date, default: Date.now }
}, { timestamps: true })

export default mongoose.model('SystemLog', systemLogSchema)
