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
import { errorHandler } from './utils/errorHandler.js'

dotenv.config()

const app = express()
app.use(cors())
app.use(helmet())
app.use(express.json())
app.use(morgan('dev'))

app.get('/', (req, res) => res.json({ status: 'ok', service: 'HopeLine API' }))

app.use('/api/auth', authRoutes)
app.use('/api/appointments', appointmentRoutes)
app.use('/api/feedback', feedbackRoutes)
app.use('/api/ai', aiRoutes)

app.use(errorHandler)

const PORT = process.env.PORT || 4000
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hopeline'

mongoose.connect(MONGO_URI).then(()=>{
  app.listen(PORT, ()=> console.log(`API running on http://localhost:${PORT}`))
}).catch(err=>{
  console.error('Mongo connection error', err)
  process.exit(1)
})


