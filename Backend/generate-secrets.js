#!/usr/bin/env node

// JWT Secret Generator Script
// Run this script to generate secure JWT secrets for your application

import crypto from 'crypto'

console.log('🔐 JWT Secret Generator')
console.log('=' .repeat(50))

// Generate JWT_SECRET
const jwtSecret = crypto.randomBytes(64).toString('hex')
console.log('JWT_SECRET=')
console.log(jwtSecret)
console.log()

// Generate JWT_REFRESH_SECRET
const refreshSecret = crypto.randomBytes(64).toString('hex')
console.log('JWT_REFRESH_SECRET=')
console.log(refreshSecret)
console.log()

// Generate base64 versions (alternative)
console.log('Base64 versions (alternative):')
console.log('JWT_SECRET_BASE64=')
console.log(crypto.randomBytes(64).toString('base64'))
console.log()

console.log('JWT_REFRESH_SECRET_BASE64=')
console.log(crypto.randomBytes(64).toString('base64'))
console.log()

console.log('📝 Instructions:')
console.log('1. Copy the secrets above')
console.log('2. Create a .env file in your Backend directory')
console.log('3. Paste the secrets into the .env file')
console.log('4. Never commit the .env file to git!')
console.log()

console.log('Example .env file content:')
console.log('JWT_SECRET=' + jwtSecret)
console.log('JWT_REFRESH_SECRET=' + refreshSecret)
console.log('MONGO_URI=mongodb://127.0.0.1:27017/hopeline')
console.log('PORT=4000')
console.log('NODE_ENV=development')
