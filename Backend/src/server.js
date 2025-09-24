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
  'https://hope-line.vercel.app',
  // Add your frontend Vercel URL here
  process.env.FRONTEND_URL
].filter(Boolean) // Remove undefined values

// CORS function to handle origin checking
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true)
    
    // Check if origin is in allowed list
    if (allowedOrigins.includes(origin)) {
      return callback(null, true)
    }
    
    // Check if origin matches Vercel pattern
    if (/^https:\/\/.*\.vercel\.app$/.test(origin)) {
      return callback(null, true)
    }
    
    callback(new Error('Not allowed by CORS'))
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200 // Some legacy browsers choke on 204
}

app.use(cors(corsOptions))

app.use(helmet())
app.use(express.json())
app.use(morgan('dev'))

app.get('/', (req, res) => res.json({ 
  status: 'ok', 
  service: 'HopeLine API',
  timestamp: new Date().toISOString(),
  version: '1.0.0'
}))

// Debug endpoint to check database connection and users
app.get('/debug/users', async (req, res) => {
  try {
    const User = (await import('./models/User.js')).default
    const users = await User.find({}).select('-password')
    res.json({ 
      message: 'Database connected successfully',
      userCount: users.length,
      users: users.map(u => ({ id: u._id, name: u.name, email: u.email, username: u.username, role: u.role }))
    })
  } catch (error) {
    res.status(500).json({ message: 'Database error', error: error.message })
  }
})

// Debug endpoint to seed database with demo users
app.post('/debug/seed', async (req, res) => {
  try {
    const User = (await import('./models/User.js')).default
    
    // Demo users with the exact credentials from your frontend
    const demoUsers = [
      { name: 'Student Demo', email: 'student@university.edu', username: 'student_demo', password: 'admin123', role: 'student' },
      { name: 'Admin User', email: 'admin@university.edu', username: 'admin', password: 'admin123', role: 'admin' },
      { name: 'John Doe', email: 'john@university.edu', username: 'john_doe', password: 'password123', role: 'student' },
      { name: 'Jane Smith', email: 'jane@university.edu', username: 'jane_smith', password: 'password123', role: 'student' }
    ]
    
    // Clear existing users
    await User.deleteMany({})
    
    // Create demo users
    const users = await User.insertMany(demoUsers)
    
    res.json({ 
      message: 'Database seeded successfully',
      userCount: users.length,
      users: users.map(u => ({ id: u._id, name: u.name, email: u.email, username: u.username, role: u.role }))
    })
  } catch (error) {
    res.status(500).json({ message: 'Seeding error', error: error.message })
  }
})

// Test endpoint to verify auth routes are working
app.get('/test/auth', (req, res) => {
  res.json({ 
    message: 'Auth routes are working',
    endpoints: [
      'POST /api/auth/login',
      'POST /api/auth/register', 
      'GET /api/auth/me',
      'POST /api/auth/refresh'
    ],
    timestamp: new Date().toISOString()
  })
})

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


