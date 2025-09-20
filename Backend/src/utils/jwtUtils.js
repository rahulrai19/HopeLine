import jwt from 'jsonwebtoken'

// JWT utility functions for token creation and verification

/**
 * Create a JWT token with user data
 * @param {Object} payload - User data to encode in token
 * @param {string} secret - JWT secret key
 * @param {string|number} expiresIn - Token expiration time
 * @returns {string} JWT token
 */
export function createToken(payload, secret = process.env.JWT_SECRET, expiresIn = '1d') {
  if (!secret) {
    throw new Error('JWT_SECRET is required')
  }
  
  return jwt.sign(payload, secret, { expiresIn })
}

/**
 * Verify a JWT token
 * @param {string} token - JWT token to verify
 * @param {string} secret - JWT secret key
 * @returns {Object} Decoded token payload
 */
export function verifyToken(token, secret = process.env.JWT_SECRET) {
  if (!secret) {
    throw new Error('JWT_SECRET is required')
  }
  
  return jwt.verify(token, secret)
}

/**
 * Create access token (short-lived)
 * @param {Object} user - User object
 * @returns {string} Access token
 */
export function createAccessToken(user) {
  const payload = {
    id: user._id || user.id,
    role: user.role,
    email: user.email,
    name: user.name
  }
  
  return createToken(payload, process.env.JWT_SECRET, '15m') // 15 minutes
}

/**
 * Create refresh token (long-lived)
 * @param {Object} user - User object
 * @returns {string} Refresh token
 */
export function createRefreshToken(user) {
  const payload = {
    id: user._id || user.id,
    type: 'refresh'
  }
  
  return createToken(payload, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET, '7d') // 7 days
}

/**
 * Create token pair (access + refresh)
 * @param {Object} user - User object
 * @returns {Object} Token pair
 */
export function createTokenPair(user) {
  return {
    accessToken: createAccessToken(user),
    refreshToken: createRefreshToken(user)
  }
}

/**
 * Decode token without verification (for debugging)
 * @param {string} token - JWT token
 * @returns {Object} Decoded payload
 */
export function decodeToken(token) {
  return jwt.decode(token)
}

/**
 * Check if token is expired
 * @param {string} token - JWT token
 * @returns {boolean} True if expired
 */
export function isTokenExpired(token) {
  try {
    const decoded = decodeToken(token)
    if (!decoded || !decoded.exp) return true
    
    const currentTime = Math.floor(Date.now() / 1000)
    return decoded.exp < currentTime
  } catch (error) {
    return true
  }
}
