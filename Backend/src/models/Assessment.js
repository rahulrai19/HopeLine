import mongoose from 'mongoose'

const assessmentSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['PHQ-9', 'GAD-7', 'combined'], required: true },
  responses: [{
    questionId: { type: String, required: true },
    question: { type: String, required: true },
    answer: { type: Number, min: 0, max: 3, required: true }
  }],
  totalScore: { type: Number, required: true },
  severity: { type: String, enum: ['minimal', 'mild', 'moderate', 'moderately_severe', 'severe'], required: true },
  recommendations: [String],
  completedAt: { type: Date, default: Date.now }
}, { timestamps: true })

export default mongoose.model('Assessment', assessmentSchema)
