#!/usr/bin/env node

// Environment Setup Script
// This script helps you create a .env file with JWT secrets

import crypto from 'crypto'
import fs from 'fs'
import path from 'path'

console.log('🚀 Setting up environment variables...')
console.log('=' .repeat(50))

// Generate secrets
const jwtSecret = crypto.randomBytes(64).toString('hex')
const refreshSecret = crypto.randomBytes(64).toString('hex')

// Environment variables content
const envContent = `# JWT Configuration
JWT_SECRET=${jwtSecret}
JWT_REFRESH_SECRET=${refreshSecret}

# Database Configuration
MONGO_URI=mongodb://127.0.0.1:27017/hopeline

# API Keys (Add your actual keys here)
GEMINI_API_KEY=your-gemini-api-key-here

# Server Configuration
PORT=4000
NODE_ENV=development
`

// Write .env file
const envPath = path.join(process.cwd(), '.env')

try {
  fs.writeFileSync(envPath, envContent)
  console.log('✅ .env file created successfully!')
  console.log('📍 Location:', envPath)
  console.log()
  console.log('🔐 Generated JWT secrets:')
  console.log('JWT_SECRET:', jwtSecret.substring(0, 20) + '...')
  console.log('JWT_REFRESH_SECRET:', refreshSecret.substring(0, 20) + '...')
  console.log()
  console.log('⚠️  Important:')
  console.log('- Never commit the .env file to git')
  console.log('- Keep your secrets secure')
  console.log('- Use different secrets for production')
  console.log()
  console.log('🎉 You can now start your server with: npm run dev')
} catch (error) {
  console.error('❌ Error creating .env file:', error.message)
  console.log()
  console.log('📝 Manual setup:')
  console.log('1. Create a .env file in the Backend directory')
  console.log('2. Add the following content:')
  console.log()
  console.log(envContent)
}
