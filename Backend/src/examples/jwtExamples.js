// JWT Token Creation Examples
// This file demonstrates various ways to create and use JWT tokens

import jwt from 'jsonwebtoken'
import { createToken, createTokenPair, verifyToken, isTokenExpired } from '../utils/jwtUtils.js'

// Example 1: Basic JWT Token Creation
export function basicTokenExample() {
  const payload = {
    userId: '12345',
    username: 'john_doe',
    role: 'admin',
    email: 'john@example.com'
  }
  
  const secret = 'your-secret-key'
  const options = {
    expiresIn: '1h', // Token expires in 1 hour
    issuer: 'your-app', // Who issued the token
    audience: 'your-users' // Who the token is for
  }
  
  const token = jwt.sign(payload, secret, options)
  console.log('Basic token:', token)
  return token
}

// Example 2: Different Expiration Times
export function expirationExamples() {
  const payload = { userId: '12345', role: 'user' }
  const secret = 'your-secret-key'
  
  // Different expiration formats
  const tokens = {
    '1 hour': jwt.sign(payload, secret, { expiresIn: '1h' }),
    '1 day': jwt.sign(payload, secret, { expiresIn: '1d' }),
    '1 week': jwt.sign(payload, secret, { expiresIn: '7d' }),
    '1 month': jwt.sign(payload, secret, { expiresIn: '30d' }),
    '1 year': jwt.sign(payload, secret, { expiresIn: '365d' }),
    'Never expires': jwt.sign(payload, secret) // No expiration
  }
  
  return tokens
}

// Example 3: Using Utility Functions
export function utilityFunctionExamples() {
  const user = {
    _id: '507f1f77bcf86cd799439011',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'admin'
  }
  
  // Create single token
  const singleToken = createToken(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    '1d'
  )
  
  // Create token pair (access + refresh)
  const tokenPair = createTokenPair(user)
  
  return {
    singleToken,
    tokenPair
  }
}

// Example 4: Token Verification
export function verificationExamples(token) {
  try {
    // Verify token
    const decoded = verifyToken(token, process.env.JWT_SECRET)
    console.log('Decoded token:', decoded)
    
    // Check if expired
    const expired = isTokenExpired(token)
    console.log('Token expired:', expired)
    
    return { decoded, expired }
  } catch (error) {
    console.error('Token verification failed:', error.message)
    return { error: error.message }
  }
}

// Example 5: Custom Claims
export function customClaimsExample() {
  const payload = {
    // Standard claims (recommended)
    sub: 'user123', // Subject (user ID)
    iat: Math.floor(Date.now() / 1000), // Issued at
    exp: Math.floor(Date.now() / 1000) + (60 * 60), // Expires in 1 hour
    iss: 'your-app', // Issuer
    aud: 'your-users', // Audience
    
    // Custom claims
    userId: '12345',
    role: 'admin',
    permissions: ['read', 'write', 'delete'],
    department: 'IT',
    lastLogin: new Date().toISOString()
  }
  
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    algorithm: 'HS256' // Specify algorithm
  })
  
  return token
}

// Example 6: Different Algorithms
export function algorithmExamples() {
  const payload = { userId: '12345' }
  const secret = 'your-secret-key'
  
  const tokens = {
    'HS256': jwt.sign(payload, secret, { algorithm: 'HS256' }),
    'HS384': jwt.sign(payload, secret, { algorithm: 'HS384' }),
    'HS512': jwt.sign(payload, secret, { algorithm: 'HS512' })
  }
  
  return tokens
}

// Example 7: Token Refresh Pattern
export function refreshTokenExample() {
  const user = { _id: '12345', role: 'user' }
  
  // Create access token (short-lived)
  const accessToken = createToken(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    '15m' // 15 minutes
  )
  
  // Create refresh token (long-lived)
  const refreshToken = createToken(
    { id: user._id, type: 'refresh' },
    process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
    '7d' // 7 days
  )
  
  return { accessToken, refreshToken }
}

// Example 8: Error Handling
export function errorHandlingExample() {
  try {
    // Invalid token
    const invalidToken = 'invalid.token.here'
    const decoded = verifyToken(invalidToken)
    return { success: true, decoded }
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return { error: 'Invalid token format' }
    } else if (error.name === 'TokenExpiredError') {
      return { error: 'Token has expired' }
    } else if (error.name === 'NotBeforeError') {
      return { error: 'Token not active yet' }
    } else {
      return { error: 'Token verification failed' }
    }
  }
}

// Example usage in a route
export function routeExample(req, res) {
  try {
    const { username, password } = req.body
    
    // Authenticate user (check credentials)
    // ... authentication logic ...
    
    // Create token after successful authentication
    const token = createToken(
      { 
        id: 'user123', 
        role: 'user',
        username: username 
      },
      process.env.JWT_SECRET,
      '1d'
    )
    
    res.json({
      success: true,
      token,
      user: {
        id: 'user123',
        username,
        role: 'user'
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Token creation failed',
      error: error.message
    })
  }
}
