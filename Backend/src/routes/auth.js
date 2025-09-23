import { Router } from 'express'
import jwt from 'jsonwebtoken'

const router = Router()

router.post('/login', async (req, res) => {
  try {
    const { email, username, password } = req.body
    console.log('Login attempt:', { email, username, hasPassword: !!password })
    
    if (!password) {
      return res.status(400).json({ message: 'Password is required' })
    }

    // Simple demo accounts - no database required
    if (username === 'admin' && password === 'admin123') {
      const token = jwt.sign({ id: 'admin-demo', role: 'admin' }, process.env.JWT_SECRET || 'dev_secret', { expiresIn: '1d' })
      return res.json({ token, user: { id: 'admin-demo', role: 'admin', name: 'Admin Demo', email: 'admin@demo.local' } })
    }
    
    if (email === 'student@university.edu' && password === 'admin123') {
      const token = jwt.sign({ id: 'student-demo', role: 'student' }, process.env.JWT_SECRET || 'dev_secret', { expiresIn: '1d' })
      return res.json({ token, user: { id: 'student-demo', role: 'student', name: 'Student Demo', email } })
    }

    // Additional fallback for admin login with email
    if (email === 'admin' && password === 'admin123') {
      const token = jwt.sign({ id: 'admin-demo', role: 'admin' }, process.env.JWT_SECRET || 'dev_secret', { expiresIn: '1d' })
      return res.json({ token, user: { id: 'admin-demo', role: 'admin', name: 'Admin Demo', email: 'admin@demo.local' } })
    }

    console.log('No matching credentials found')
    return res.status(400).json({ message: 'Invalid credentials' })
  } catch (error) {
    console.error('Login error:', error)
    return res.status(500).json({ message: 'Internal server error', error: error.message })
  }
})

export default router