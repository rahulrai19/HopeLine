import { Router } from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const router = Router()

router.post('/login', async (req, res) => {
  const { email, username, password } = req.body
  const query = email ? { email } : { username }
  const user = await User.findOne(query)

  if (user) {
    const ok = await user.comparePassword(password)
    if (!ok) return res.status(400).json({ message: 'Invalid credentials' })
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'dev_secret', { expiresIn: '1d' })
    return res.json({ token, user: { id: user._id, role: user.role, name: user.name, email: user.email } })
  }

  // Fallback default accounts (for demo/dev without seeding DB)
  if (username === 'admin' && password === 'admin123') {
    const token = jwt.sign({ id: 'admin-demo', role: 'admin' }, process.env.JWT_SECRET || 'dev_secret', { expiresIn: '1d' })
    return res.json({ token, user: { id: 'admin-demo', role: 'admin', name: 'Admin Demo', email: 'admin@demo.local' } })
  }
  if (email === 'student@university.edu' && password === 'admin123') {
    const token = jwt.sign({ id: 'student-demo', role: 'student' }, process.env.JWT_SECRET || 'dev_secret', { expiresIn: '1d' })
    return res.json({ token, user: { id: 'student-demo', role: 'student', name: 'Student Demo', email } })
  }

  return res.status(400).json({ message: 'Invalid credentials' })
})

router.post('/register', async (req, res) => {
  const { name, email, username, password, role } = req.body
  const user = await User.create({ name, email, username, password, role })
  res.status(201).json({ id: user._id })
})

export default router


