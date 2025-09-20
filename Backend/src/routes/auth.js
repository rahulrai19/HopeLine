import { Router } from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import { createToken, createTokenPair } from '../utils/jwtUtils.js'

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
        // Using utility function for better token management
        const token = createToken({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'dev_secret', '1d')
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

// Student signup endpoint
router.post('/signup', async (req, res) => {
  try {
    const { name, email, username, password, confirmPassword } = req.body
    
    // Validation
    if (!name || !email || !username || !password) {
      return res.status(400).json({ 
        message: 'All fields are required',
        required: ['name', 'email', 'username', 'password']
      })
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ 
        message: 'Passwords do not match' 
      })
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        message: 'Password must be at least 6 characters long' 
      })
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        message: 'Please enter a valid email address' 
      })
    }

    // Username validation
    if (username.length < 3) {
      return res.status(400).json({ 
        message: 'Username must be at least 3 characters long' 
      })
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    })

    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).json({ 
          message: 'An account with this email already exists' 
        })
      }
      if (existingUser.username === username) {
        return res.status(400).json({ 
          message: 'Username is already taken' 
        })
      }
    }

    // Create new student user
    const user = await User.create({
      name,
      email,
      username,
      password,
      role: 'student' // Force role to student for signup
    })

    // Generate JWT token for immediate login
    const token = createToken(
      { id: user._id, role: user.role }, 
      process.env.JWT_SECRET || 'dev_secret', 
      '1d'
    )

    console.log('New student registered:', { name, email, username })

    res.status(201).json({
      message: 'Account created successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        role: user.role
      }
    })

  } catch (error) {
    console.error('Signup error:', error)
    
    if (error.code === 11000) {
      // MongoDB duplicate key error
      const field = Object.keys(error.keyPattern)[0]
      return res.status(400).json({ 
        message: `${field} already exists` 
      })
    }
    
    res.status(500).json({ 
      message: 'Internal server error during registration' 
    })
  }
})

// Admin/Staff registration endpoint (for internal use)
router.post('/register', async (req, res) => {
  try {
    const { name, email, username, password, role } = req.body
    
    // Validation
    if (!name || !email || !username || !password || !role) {
      return res.status(400).json({ 
        message: 'All fields are required',
        required: ['name', 'email', 'username', 'password', 'role']
      })
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    })

    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).json({ 
          message: 'An account with this email already exists' 
        })
      }
      if (existingUser.username === username) {
        return res.status(400).json({ 
          message: 'Username is already taken' 
        })
      }
    }

    // Create user
    const user = await User.create({ name, email, username, password, role })
    
    console.log('New user registered:', { name, email, username, role })

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        role: user.role
      }
    })

  } catch (error) {
    console.error('Registration error:', error)
    
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0]
      return res.status(400).json({ 
        message: `${field} already exists` 
      })
    }
    
    res.status(500).json({ 
      message: 'Internal server error during registration' 
    })
  }
})

// Check if username is available
router.get('/check-username/:username', async (req, res) => {
  try {
    const { username } = req.params
    
    if (!username || username.length < 3) {
      return res.status(400).json({ 
        message: 'Username must be at least 3 characters long' 
      })
    }

    const existingUser = await User.findOne({ username })
    
    res.json({
      available: !existingUser,
      message: existingUser ? 'Username is already taken' : 'Username is available'
    })
  } catch (error) {
    console.error('Username check error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

// Check if email is available
router.get('/check-email/:email', async (req, res) => {
  try {
    const { email } = req.params
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        message: 'Please enter a valid email address' 
      })
    }

    const existingUser = await User.findOne({ email })
    
    res.json({
      available: !existingUser,
      message: existingUser ? 'Email is already registered' : 'Email is available'
    })
  } catch (error) {
    console.error('Email check error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

// Get user profile (protected route)
router.get('/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret')
    const user = await User.findById(decoded.id).select('-password')
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        role: user.role,
        createdAt: user.createdAt
      }
    })
  } catch (error) {
    console.error('Profile fetch error:', error)
    res.status(401).json({ message: 'Invalid token' })
  }
})

export default router


