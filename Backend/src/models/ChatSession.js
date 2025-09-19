import mongoose from 'mongoose'

const chatSessionSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sessionType: { type: String, enum: ['ai', 'peer', 'counselor'], required: true },
  messages: [{
    sender: { type: String, enum: ['student', 'ai', 'peer', 'counselor'], required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    language: { type: String, default: 'en' }
  }],
  duration: { type: Number, default: 0 }, // in minutes
  satisfaction: { type: Number, min: 1, max: 5 },
  status: { type: String, enum: ['active', 'completed', 'abandoned'], default: 'active' },
  mood: { type: String, enum: ['down', 'content', 'peaceful', 'happy', 'excited'] },
  tags: [String] // for categorizing sessions
}, { timestamps: true })

export default mongoose.model('ChatSession', chatSessionSchema)
