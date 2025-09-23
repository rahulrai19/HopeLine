import 'express-async-errors'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import dotenv from 'dotenv'
import mongoose from 'mongoose'

import authRoutes from './routes/auth.js'
import appointmentRoutes from './routes/appointments.js'
import feedbackRoutes from './routes/feedback.js'
import aiRoutes from './routes/ai.js'
import analyticsRoutes from './routes/analytics.js'
import { errorHandler } from './utils/errorHandler.js'

dotenv.config()

const app = express()

// Enhanced CORS configuration for separate deployments
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:5176',
  // Add your specific frontend Vercel URL
  'https://hope-line-dflp.vercel.app',
  // Add your frontend Vercel URL here
  process.env.FRONTEND_URL,
  // Allow any Vercel app domain (for flexibility)
  /^https:\/\/.*\.vercel\.app$/
]

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use(helmet())
app.use(express.json())
app.use(morgan('dev'))

app.get('/', (req, res) => res.json({ status: 'ok', service: 'HopeLine API' }))

app.use('/api/auth', authRoutes)
app.use('/api/appointments', appointmentRoutes)
app.use('/api/feedback', feedbackRoutes)
app.use('/api/ai', aiRoutes)
app.use('/api/analytics', analyticsRoutes)

app.use(errorHandler)

const PORT = process.env.PORT || 4000
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hopeline'

// Connect to MongoDB
mongoose.connect(MONGO_URI).then(() => {
  console.log('Connected to MongoDB')
}).catch(err => {
  console.error('Mongo connection error', err)
  // Don't exit in production, let Vercel handle it
  if (process.env.NODE_ENV !== 'production') {
    process.exit(1)
  }
})

// Start server only if not in Vercel environment
if (!process.env.VERCEL) {
  app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`))
}

// Export for Vercel
export default app


