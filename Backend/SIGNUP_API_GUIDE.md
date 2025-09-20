# Student Signup API Guide

## Overview
This guide covers the new student signup functionality added to the HopeLine API. Students can now create accounts with proper validation and immediate login.

## API Endpoints

### 1. Student Signup
**POST** `/api/auth/signup`

Creates a new student account with automatic login.

#### Request Body
```json
{
  "name": "John Doe",
  "email": "john@university.edu",
  "username": "johndoe",
  "password": "password123",
  "confirmPassword": "password123"
}
```

#### Validation Rules
- **Name**: Required, any string
- **Email**: Required, valid email format, must be unique
- **Username**: Required, minimum 3 characters, must be unique
- **Password**: Required, minimum 6 characters
- **Confirm Password**: Must match password

#### Success Response (201)
```json
{
  "message": "Account created successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "68cee0d6bf65284134fb49ae",
    "name": "John Doe",
    "email": "john@university.edu",
    "username": "johndoe",
    "role": "student"
  }
}
```

#### Error Responses (400)
```json
// Missing fields
{
  "message": "All fields are required",
  "required": ["name", "email", "username", "password"]
}

// Password mismatch
{
  "message": "Passwords do not match"
}

// Password too short
{
  "message": "Password must be at least 6 characters long"
}

// Invalid email
{
  "message": "Please enter a valid email address"
}

// Username too short
{
  "message": "Username must be at least 3 characters long"
}

// Email already exists
{
  "message": "An account with this email already exists"
}

// Username already taken
{
  "message": "Username is already taken"
}
```

### 2. Check Username Availability
**GET** `/api/auth/check-username/:username`

Checks if a username is available for registration.

#### Example
```bash
GET /api/auth/check-username/johndoe
```

#### Response
```json
{
  "available": false,
  "message": "Username is already taken"
}
```

### 3. Check Email Availability
**GET** `/api/auth/check-email/:email`

Checks if an email is available for registration.

#### Example
```bash
GET /api/auth/check-email/john@university.edu
```

#### Response
```json
{
  "available": false,
  "message": "Email is already registered"
}
```

### 4. Get User Profile
**GET** `/api/auth/profile`

Gets the current user's profile information.

#### Headers
```
Authorization: Bearer <jwt_token>
```

#### Response
```json
{
  "user": {
    "id": "68cee0d6bf65284134fb49ae",
    "name": "John Doe",
    "email": "john@university.edu",
    "username": "johndoe",
    "role": "student",
    "createdAt": "2024-01-20T10:30:00.000Z"
  }
}
```

## Frontend Integration Examples

### React Signup Form
```jsx
import { useState } from 'react'

function SignupForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState({})

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      
      const data = await response.json()
      
      if (response.ok) {
        // Store token and redirect
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        // Redirect to dashboard
      } else {
        setErrors({ general: data.message })
      }
    } catch (error) {
      setErrors({ general: 'Network error' })
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Full Name"
        value={formData.name}
        onChange={(e) => setFormData({...formData, name: e.target.value})}
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({...formData, email: e.target.value})}
        required
      />
      <input
        type="text"
        placeholder="Username"
        value={formData.username}
        onChange={(e) => setFormData({...formData, username: e.target.value})}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={formData.password}
        onChange={(e) => setFormData({...formData, password: e.target.value})}
        required
      />
      <input
        type="password"
        placeholder="Confirm Password"
        value={formData.confirmPassword}
        onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
        required
      />
      <button type="submit">Sign Up</button>
      {errors.general && <p className="error">{errors.general}</p>}
    </form>
  )
}
```

### Real-time Username Validation
```jsx
import { useState, useEffect } from 'react'

function UsernameInput({ username, onUsernameChange }) {
  const [isChecking, setIsChecking] = useState(false)
  const [isAvailable, setIsAvailable] = useState(null)

  useEffect(() => {
    if (username.length >= 3) {
      setIsChecking(true)
      
      fetch(`/api/auth/check-username/${username}`)
        .then(res => res.json())
        .then(data => {
          setIsAvailable(data.available)
          setIsChecking(false)
        })
        .catch(() => {
          setIsChecking(false)
        })
    }
  }, [username])

  return (
    <div>
      <input
        type="text"
        value={username}
        onChange={(e) => onUsernameChange(e.target.value)}
        placeholder="Username"
      />
      {isChecking && <span>Checking...</span>}
      {isAvailable === true && <span className="success">✓ Available</span>}
      {isAvailable === false && <span className="error">✗ Taken</span>}
    </div>
  )
}
```

## Testing with cURL

### Test Student Signup
```bash
curl -X POST http://localhost:4000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Smith",
    "email": "jane@university.edu",
    "username": "janesmith",
    "password": "password123",
    "confirmPassword": "password123"
  }'
```

### Test Username Check
```bash
curl -X GET http://localhost:4000/api/auth/check-username/janesmith
```

### Test Email Check
```bash
curl -X GET http://localhost:4000/api/auth/check-email/jane@university.edu
```

### Test Profile (with token)
```bash
curl -X GET http://localhost:4000/api/auth/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

## Security Features

1. **Password Hashing**: All passwords are automatically hashed using bcrypt
2. **Input Validation**: Comprehensive validation on all inputs
3. **Duplicate Prevention**: Checks for existing email/username before creation
4. **JWT Authentication**: Automatic token generation for immediate login
5. **Role Enforcement**: Signup always creates student accounts
6. **Error Handling**: Detailed error messages for better UX

## Database Schema

The User model includes:
- `name`: String
- `email`: String (unique, sparse)
- `username`: String (unique, sparse)
- `password`: String (hashed)
- `role`: String (enum: 'student', 'admin', 'counselor')
- `createdAt`: Date
- `updatedAt`: Date

## Error Codes

- **400**: Bad Request (validation errors)
- **401**: Unauthorized (invalid token)
- **404**: Not Found (user not found)
- **500**: Internal Server Error

## Next Steps

1. **Frontend Integration**: Update your React components to use these endpoints
2. **Email Verification**: Consider adding email verification for production
3. **Password Reset**: Implement password reset functionality
4. **Profile Management**: Add profile update endpoints
5. **Admin Panel**: Use the `/register` endpoint for admin-created accounts
