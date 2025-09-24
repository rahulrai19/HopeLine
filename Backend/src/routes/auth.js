import { Router } from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import { createTokenPair } from '../utils/jwtUtils.js'
import { protectRoute } from '../middleware/protectRoute.js'

const router = Router()

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    console.log('Login attempt:', { email, passwordLength: password?.length })

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' })
    }

    // Find user by email or username
    const user = await User.findOne({
      $or: [{ email }, { username: email }]
    })

    console.log('User found:', user ? { id: user._id, email: user.email, username: user.username } : 'No user found')

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    // Check password
    const isValidPassword = await user.comparePassword(password)
    console.log('Password valid:', isValidPassword)
    
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    // Create tokens
    const tokens = createTokenPair(user)

    res.json({
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        role: user.role
      },
      ...tokens
    })

  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, username, password, role = 'student' } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' })
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username: username || email }]
    })

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' })
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      username: username || email,
      password,
      role
    })

    // Create tokens
    const tokens = createTokenPair(user)

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        role: user.role
      },
      ...tokens
    })

  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

// GET /api/auth/me
router.get('/me', protectRoute, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password')
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        role: user.role
      }
    })

  } catch (error) {
    console.error('Get user error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

// POST /api/auth/refresh
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body

    if (!refreshToken) {
      return res.status(400).json({ message: 'Refresh token is required' })
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET)
    
    if (decoded.type !== 'refresh') {
      return res.status(401).json({ message: 'Invalid token type' })
    }

    // Get user
    const user = await User.findById(decoded.id)
    if (!user) {
      return res.status(401).json({ message: 'User not found' })
    }

    // Create new tokens
    const tokens = createTokenPair(user)

    res.json({
      message: 'Tokens refreshed successfully',
      ...tokens
    })

  } catch (error) {
    console.error('Token refresh error:', error)
    res.status(401).json({ message: 'Invalid refresh token' })
  }
})

export default router
