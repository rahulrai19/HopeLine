import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { AuthAPI } from '../../services/api'
import styles from './Auth.module.scss'

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
      }, 500)

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
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = 'Full name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Please enter a valid email address'
    if (!formData.username.trim()) newErrors.username = 'Username is required'
    else if (formData.username.length < 3) newErrors.username = 'Username must be at least 3 characters long'
    if (!formData.password) newErrors.password = 'Password is required'
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters long'
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password'
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
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
      await signup(formData)
      navigate('/student/dashboard')
    } catch (error) {
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
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <div className={styles.authHeader}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <div className={styles.logoSection}>
              <img src="/logo.png" alt="HopeLine Logo" className={styles.logoImage} />
              <div className={styles.logoText}>HopeLine</div>
            </div>
          </Link>
          <h1>Create Account</h1>
          <p>Join HopeLine for mental health support</p>
        </div>

        <form onSubmit={handleSubmit}>
          {errors.general && (
            <div className={styles.generalError}>{errors.general}</div>
          )}

          <div className={styles.formGroup}>
            <label htmlFor="name">Full Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? styles.error : ''}
              placeholder="Enter your full name"
              required
            />
            {errors.name && <span className={styles.errorText}>{errors.name}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email">Email Address *</label>
            <div className={styles.inputWithValidation}>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`${errors.email ? styles.error : ''} ${validation.email.available === true ? styles.success : ''}`}
                placeholder="Enter your email address"
                required
              />
              {validation.email.checking && <span className={`${styles.validationIcon} ${styles.checking}`}>...</span>}
              {validation.email.available === true && <span className={`${styles.validationIcon} ${styles.successIcon}`}>✓</span>}
              {validation.email.available === false && <span className={`${styles.validationIcon} ${styles.errorIcon}`}>✗</span>}
            </div>
            {errors.email && <span className={styles.errorText}>{errors.email}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="username">Username *</label>
            <div className={styles.inputWithValidation}>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className={`${errors.username ? styles.error : ''} ${validation.username.available === true ? styles.success : ''}`}
                placeholder="Choose a username"
                required
              />
              {validation.username.checking && <span className={`${styles.validationIcon} ${styles.checking}`}>...</span>}
              {validation.username.available === true && <span className={`${styles.validationIcon} ${styles.successIcon}`}>✓</span>}
              {validation.username.available === false && <span className={`${styles.validationIcon} ${styles.errorIcon}`}>✗</span>}
            </div>
            {errors.username && <span className={styles.errorText}>{errors.username}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password">Password *</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? styles.error : ''}
              placeholder="Create a password (min 6 characters)"
              required
            />
            {errors.password && <span className={styles.errorText}>{errors.password}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword">Confirm Password *</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={errors.confirmPassword ? styles.error : ''}
              placeholder="Confirm your password"
              required
            />
            {errors.confirmPassword && <span className={styles.errorText}>{errors.confirmPassword}</span>}
          </div>

          <button 
            type="submit" 
            className={styles.submitBtn}
            disabled={isLoading || validation.username.checking || validation.email.checking}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className={styles.authFooter}>
          <p>
            Already have an account? 
            <Link to="/login" className={styles.switchLink}>Sign in here</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
