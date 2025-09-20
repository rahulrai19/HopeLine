import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { AuthAPI } from '../../services/api'
import './Signup.module.scss'

export default function Signup() {
  const { signup } = useAuth()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [validation, setValidation] = useState({
    username: { checking: false, available: null },
    email: { checking: false, available: null }
  })

  // Real-time username validation
  useEffect(() => {
    if (formData.username.length >= 3) {
      setValidation(prev => ({ ...prev, username: { checking: true, available: null } }))
      
      const timeoutId = setTimeout(async () => {
        try {
          const result = await AuthAPI.checkUsername(formData.username)
          setValidation(prev => ({ 
            ...prev, 
            username: { checking: false, available: result.available } 
          }))
        } catch (error) {
          setValidation(prev => ({ 
            ...prev, 
            username: { checking: false, available: null } 
          }))
        }
      }, 500) // Debounce for 500ms

      return () => clearTimeout(timeoutId)
    } else {
      setValidation(prev => ({ 
        ...prev, 
        username: { checking: false, available: null } 
      }))
    }
  }, [formData.username])

  // Real-time email validation
  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (emailRegex.test(formData.email)) {
      setValidation(prev => ({ ...prev, email: { checking: true, available: null } }))
      
      const timeoutId = setTimeout(async () => {
        try {
          const result = await AuthAPI.checkEmail(formData.email)
          setValidation(prev => ({ 
            ...prev, 
            email: { checking: false, available: result.available } 
          }))
        } catch (error) {
          setValidation(prev => ({ 
            ...prev, 
            email: { checking: false, available: null } 
          }))
        }
      }, 500)

      return () => clearTimeout(timeoutId)
    } else {
      setValidation(prev => ({ 
        ...prev, 
        email: { checking: false, available: null } 
      }))
    }
  }, [formData.email])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear specific error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required'
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required'
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters long'
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long'
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    // Check if username and email are available
    if (validation.username.available === false) {
      setErrors(prev => ({ ...prev, username: 'Username is already taken' }))
      return
    }

    if (validation.email.available === false) {
      setErrors(prev => ({ ...prev, email: 'Email is already registered' }))
      return
    }

    setIsLoading(true)
    setErrors({})

    try {
      const result = await signup(formData)
      console.log('Signup successful:', result)
      // User is automatically logged in after successful signup
      // Redirect to student dashboard
      navigate('/student/dashboard')
    } catch (error) {
      console.error('Signup error:', error)
      
      try {
        const errorData = JSON.parse(error.message)
        setErrors({ general: errorData.message })
      } catch {
        setErrors({ general: 'Signup failed. Please try again.' })
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="signup-container">
      <div className="signup-card">
        <div className="signup-header">
          <div className="logo-section">
            <div className="logo-icon">💚</div>
            <div className="logo-text">HopeLine</div>
          </div>
          <h1>Create Student Account</h1>
          <p>Join HopeLine to access mental health support and resources</p>
        </div>

        <form onSubmit={handleSubmit} className="signup-form">
          {errors.general && (
            <div className="error-message general-error">
              {errors.general}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="name">Full Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? 'error' : ''}
              placeholder="Enter your full name"
              required
            />
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
            <div className="input-with-validation">
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`${errors.email ? 'error' : ''} ${validation.email.available === true ? 'success' : ''}`}
                placeholder="Enter your email address"
                required
              />
              {validation.email.checking && <span className="checking">Checking...</span>}
              {validation.email.available === true && <span className="success-icon">✓</span>}
              {validation.email.available === false && <span className="error-icon">✗</span>}
            </div>
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="username">Username *</label>
            <div className="input-with-validation">
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className={`${errors.username ? 'error' : ''} ${validation.username.available === true ? 'success' : ''}`}
                placeholder="Choose a username"
                required
              />
              {validation.username.checking && <span className="checking">Checking...</span>}
              {validation.username.available === true && <span className="success-icon">✓</span>}
              {validation.username.available === false && <span className="error-icon">✗</span>}
            </div>
            {errors.username && <span className="error-text">{errors.username}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password *</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? 'error' : ''}
              placeholder="Create a password (min 6 characters)"
              required
            />
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password *</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={errors.confirmPassword ? 'error' : ''}
              placeholder="Confirm your password"
              required
            />
            {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
          </div>

          <button 
            type="submit" 
            className="signup-button"
            disabled={isLoading || validation.username.checking || validation.email.checking}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="signup-footer">
          <p>
            Already have an account? 
            <a href="/login" className="login-link"> Sign in here</a>
          </p>
        </div>
      </div>
    </div>
  )
}
