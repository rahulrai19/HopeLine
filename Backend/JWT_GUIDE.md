# JWT Token Creation Guide

## Overview
JSON Web Tokens (JWT) are a compact, URL-safe means of representing claims to be transferred between two parties. This guide explains how to create and use JWT tokens in your HopeLine project.

## Table of Contents
1. [Basic JWT Structure](#basic-jwt-structure)
2. [Installation & Setup](#installation--setup)
3. [Creating JWT Tokens](#creating-jwt-tokens)
4. [Token Verification](#token-verification)
5. [Best Practices](#best-practices)
6. [Security Considerations](#security-considerations)
7. [Examples](#examples)

## Basic JWT Structure

A JWT consists of three parts separated by dots (`.`):
```
header.payload.signature
```

### Header
Contains metadata about the token:
```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

### Payload
Contains the claims (data):
```json
{
  "sub": "user123",
  "iat": 1516239022,
  "exp": 1516242622,
  "role": "admin"
}
```

### Signature
Used to verify the token hasn't been tampered with.

## Installation & Setup

Your project already has the `jsonwebtoken` package installed. If you need to install it:

```bash
npm install jsonwebtoken
```

## Creating JWT Tokens

### 1. Basic Token Creation

```javascript
import jwt from 'jsonwebtoken'

const payload = {
  userId: '12345',
  role: 'admin',
  email: 'user@example.com'
}

const secret = process.env.JWT_SECRET || 'your-secret-key'
const options = {
  expiresIn: '1d' // Token expires in 1 day
}

const token = jwt.sign(payload, secret, options)
```

### 2. Using Utility Functions

```javascript
import { createToken, createTokenPair } from './utils/jwtUtils.js'

// Single token
const token = createToken(
  { id: user._id, role: user.role },
  process.env.JWT_SECRET,
  '1d'
)

// Token pair (access + refresh)
const tokens = createTokenPair(user)
```

### 3. Different Expiration Times

```javascript
// Various expiration formats
const tokens = {
  '15 minutes': jwt.sign(payload, secret, { expiresIn: '15m' }),
  '1 hour': jwt.sign(payload, secret, { expiresIn: '1h' }),
  '1 day': jwt.sign(payload, secret, { expiresIn: '1d' }),
  '1 week': jwt.sign(payload, secret, { expiresIn: '7d' }),
  '1 month': jwt.sign(payload, secret, { expiresIn: '30d' }),
  'Never expires': jwt.sign(payload, secret) // No expiration
}
```

## Token Verification

### 1. Basic Verification

```javascript
import jwt from 'jsonwebtoken'

try {
  const decoded = jwt.verify(token, process.env.JWT_SECRET)
  console.log('Decoded token:', decoded)
} catch (error) {
  console.error('Token verification failed:', error.message)
}
```

### 2. Using Utility Functions

```javascript
import { verifyToken, isTokenExpired } from './utils/jwtUtils.js'

// Verify token
const decoded = verifyToken(token, process.env.JWT_SECRET)

// Check if expired
const expired = isTokenExpired(token)
```

### 3. Middleware Usage

```javascript
export function protectRoute(req, res, next) {
  const header = req.headers.authorization || ''
  const [, token] = header.split(' ')
  
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' })
  }
  
  try {
    const decoded = verifyToken(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized' })
  }
}
```

## Best Practices

### 1. Environment Variables
Always use environment variables for secrets:

```javascript
// .env file
JWT_SECRET=your-super-secret-key-here
JWT_REFRESH_SECRET=your-refresh-secret-key-here
```

### 2. Token Expiration
- Access tokens: 15 minutes to 1 hour
- Refresh tokens: 7 days to 30 days
- Never create tokens without expiration

### 3. Secure Payload
Only include necessary data in the token:

```javascript
// Good
const payload = {
  id: user._id,
  role: user.role,
  email: user.email
}

// Avoid
const payload = {
  id: user._id,
  role: user.role,
  password: user.password, // Never include sensitive data
  creditCard: user.creditCard // Never include sensitive data
}
```

### 4. Error Handling

```javascript
try {
  const decoded = jwt.verify(token, secret)
  // Use decoded token
} catch (error) {
  if (error.name === 'JsonWebTokenError') {
    // Invalid token
  } else if (error.name === 'TokenExpiredError') {
    // Token expired
  } else if (error.name === 'NotBeforeError') {
    // Token not active yet
  }
}
```

## Security Considerations

### 1. Secret Key
- Use a strong, random secret key
- Never hardcode secrets in your code
- Use different secrets for different environments
- Rotate secrets regularly

### 2. HTTPS Only
- Always use HTTPS in production
- Never send tokens over unencrypted connections

### 3. Token Storage
- Store tokens securely on the client side
- Consider using httpOnly cookies for web applications
- Implement proper token refresh mechanisms

### 4. Token Validation
- Always validate tokens on the server side
- Check token expiration
- Verify token signature
- Implement proper error handling

## Examples

### 1. Login Route

```javascript
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    
    // Authenticate user
    const user = await User.findOne({ email })
    if (!user || !await user.comparePassword(password)) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }
    
    // Create token
    const token = createToken(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      '1d'
    )
    
    res.json({
      token,
      user: {
        id: user._id,
        role: user.role,
        name: user.name,
        email: user.email
      }
    })
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' })
  }
})
```

### 2. Protected Route

```javascript
router.get('/profile', protectRoute, (req, res) => {
  // req.user contains the decoded token data
  res.json({ user: req.user })
})
```

### 3. Token Refresh

```javascript
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body
    
    // Verify refresh token
    const decoded = verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET)
    
    // Create new access token
    const user = await User.findById(decoded.id)
    const newAccessToken = createAccessToken(user)
    
    res.json({ accessToken: newAccessToken })
  } catch (error) {
    res.status(401).json({ message: 'Invalid refresh token' })
  }
})
```

## Common Issues & Solutions

### 1. "JsonWebTokenError: invalid signature"
- Check if the secret key matches
- Ensure you're using the same secret for signing and verifying

### 2. "TokenExpiredError: jwt expired"
- Token has expired, create a new one
- Implement token refresh mechanism

### 3. "JsonWebTokenError: jwt malformed"
- Token format is invalid
- Check if token is properly formatted

### 4. "NotBeforeError: jwt not active"
- Token is not yet active
- Check the `nbf` (not before) claim

## Testing JWT Tokens

### 1. Using jwt.io
Visit [jwt.io](https://jwt.io) to decode and inspect tokens.

### 2. Command Line
```bash
# Decode token (without verification)
node -e "console.log(JSON.stringify(require('jsonwebtoken').decode('your-token-here'), null, 2))"
```

### 3. Programmatic Testing
```javascript
import { createToken, verifyToken } from './utils/jwtUtils.js'

const token = createToken({ test: 'data' }, 'test-secret', '1h')
const decoded = verifyToken(token, 'test-secret')
console.log('Test passed:', decoded.test === 'data')
```

## Conclusion

JWT tokens are a powerful way to handle authentication and authorization in your applications. By following the best practices outlined in this guide, you can create secure, efficient token-based authentication systems.

Remember to:
- Always use environment variables for secrets
- Set appropriate expiration times
- Implement proper error handling
- Use HTTPS in production
- Regularly rotate secrets
- Only include necessary data in tokens
