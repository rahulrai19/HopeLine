# JWT Secret Key Generation Guide

## Where JWT Keys Come From

JWT secrets are **NOT automatically generated** - you must create them yourself. Here's how:

## Method 1: Generate Using Node.js

```bash
# Generate a random 64-character secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Generate a base64 secret
node -e "console.log(require('crypto').randomBytes(64).toString('base64'))"
```

## Method 2: Online Generators

- [JWT.io Secret Generator](https://jwt.io/)
- [RandomKeygen](https://randomkeygen.com/)
- [Strong Password Generator](https://strongpasswordgenerator.com/)

## Method 3: Command Line Tools

```bash
# Using OpenSSL
openssl rand -hex 64

# Using PowerShell (Windows)
[System.Web.Security.Membership]::GeneratePassword(64, 0)
```

## Method 4: Manual Creation

Create a long, random string with:
- Letters (a-z, A-Z)
- Numbers (0-9)
- Special characters (!@#$%^&*)
- At least 32 characters long

## Setting Up Your Project

### 1. Create .env File

Create a `.env` file in your `HopeLine/Backend/` directory:

```env
# JWT Configuration
JWT_SECRET=your-generated-secret-here
JWT_REFRESH_SECRET=your-refresh-secret-here

# Database
MONGO_URI=mongodb://127.0.0.1:27017/hopeline

# API Keys
GEMINI_API_KEY=your-gemini-key

# Server
PORT=4000
NODE_ENV=development
```

### 2. Generate Secrets

Run this command to generate secrets:

```bash
cd HopeLine/Backend
node -e "console.log('JWT_SECRET=' + require('crypto').randomBytes(64).toString('hex'))"
node -e "console.log('JWT_REFRESH_SECRET=' + require('crypto').randomBytes(64).toString('hex'))"
```

### 3. Security Best Practices

- **Never commit .env files to git**
- Use different secrets for different environments
- Rotate secrets regularly
- Use strong, random secrets (64+ characters)
- Keep secrets secure and private

## Current Project Status

Your project currently uses:
- `process.env.JWT_SECRET || 'dev_secret'` (fallback to 'dev_secret')
- This is **NOT secure for production**

## Quick Setup

1. Create `.env` file in `HopeLine/Backend/`
2. Add your generated secrets
3. Restart your server
4. Your JWT tokens will now use the secure secrets
