import { Router } from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const router = Router()

router.post('/login', async (req, res) => {
  try {
    const { email, username, password } = req.body
    console.log('Login attempt:', { email, username, hasPassword: !!password })
    
    if (!password) {
      return res.status(400).json({ message: 'Password is required' })
    }

    // First, try to find user in database
    const query = email ? { email } : { username }
    const user = await User.findOne(query)

    if (user) {
      const ok = await user.comparePassword(password)
      if (ok) {
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'dev_secret', { expiresIn: '1d' })
        return res.json({ token, user: { id: user._id, role: user.role, name: user.name, email: user.email } })
      }
    }

    // Fallback demo accounts (for testing without database)
    if (username === 'admin' && password === 'admin123') {
      const token = jwt.sign({ id: 'admin-demo', role: 'admin' }, process.env.JWT_SECRET || 'dev_secret', { expiresIn: '1d' })
      return res.json({ token, user: { id: 'admin-demo', role: 'admin', name: 'Admin Demo', email: 'admin@demo.local' } })
    }
    
    if (email === 'student@university.edu' && password === 'admin123') {
      const token = jwt.sign({ id: 'student-demo', role: 'student' }, process.env.JWT_SECRET || 'dev_secret', { expiresIn: '1d' })
      return res.json({ token, user: { id: 'student-demo', role: 'student', name: 'Student Demo', email } })
    }

    // Additional fallback for common test credentials
    if (username === 'admin' && password === 'password123') {
      const token = jwt.sign({ id: 'admin-test', role: 'admin' }, process.env.JWT_SECRET || 'dev_secret', { expiresIn: '1d' })
      return res.json({ token, user: { id: 'admin-test', role: 'admin', name: 'Admin Test', email: 'admin@test.local' } })
    }

    if (email === 'admin' && password === 'admin123') {
      const token = jwt.sign({ id: 'admin-email', role: 'admin' }, process.env.JWT_SECRET || 'dev_secret', { expiresIn: '1d' })
      return res.json({ token, user: { id: 'admin-email', role: 'admin', name: 'Admin Email', email: 'admin@demo.local' } })
    }

    console.log('No matching credentials found')
    return res.status(400).json({ message: 'Invalid credentials' })
  } catch (error) {
    console.error('Login error:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
})

router.post('/register', async (req, res) => {
  const { name, email, username, password, role } = req.body
  const user = await User.create({ name, email, username, password, role })
  res.status(201).json({ id: user._id })
})

export default router


