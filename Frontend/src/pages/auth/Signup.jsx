import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { AuthAPI } from '../../services/api.js'
import styles from './Auth.module.scss'

function getPasswordStrength(pw) {
  if (!pw) return { score: 0, label: '' }
  let s = 0
  if (pw.length >= 6) s++
  if (pw.length >= 8) s++
  if (/[A-Z]/.test(pw)) s++
  if (/[0-9]/.test(pw)) s++
  if (/[^A-Za-z0-9]/.test(pw)) s++
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong']
  return { score: s, label: labels[s] || '' }
}

export default function Signup() {
  const { signup } = useAuth()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '', email: '', username: '', password: '', confirmPassword: ''
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [validation, setValidation] = useState({
    username: { checking: false, available: null },
    email: { checking: false, available: null }
  })

  const strength = getPasswordStrength(formData.password)

  // Real-time username validation
  useEffect(() => {
    if (formData.username.length >= 3) {
      setValidation(prev => ({ ...prev, username: { checking: true, available: null } }))
      const t = setTimeout(async () => {
        try {
          const result = await AuthAPI.checkUsername(formData.username)
          setValidation(prev => ({ ...prev, username: { checking: false, available: result.available } }))
        } catch {
          setValidation(prev => ({ ...prev, username: { checking: false, available: null } }))
        }
      }, 500)
      return () => clearTimeout(t)
    } else {
      setValidation(prev => ({ ...prev, username: { checking: false, available: null } }))
    }
  }, [formData.username])

  // Real-time email validation
  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (emailRegex.test(formData.email)) {
      setValidation(prev => ({ ...prev, email: { checking: true, available: null } }))
      const t = setTimeout(async () => {
        try {
          const result = await AuthAPI.checkEmail(formData.email)
          setValidation(prev => ({ ...prev, email: { checking: false, available: result.available } }))
        } catch {
          setValidation(prev => ({ ...prev, email: { checking: false, available: null } }))
        }
      }, 500)
      return () => clearTimeout(t)
    } else {
      setValidation(prev => ({ ...prev, email: { checking: false, available: null } }))
    }
  }, [formData.email])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const validateForm = () => {
    const ne = {}
    if (!formData.name.trim()) ne.name = 'Full name is required'
    if (!formData.email.trim()) ne.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) ne.email = 'Please enter a valid email'
    if (!formData.username.trim()) ne.username = 'Username is required'
    else if (formData.username.length < 3) ne.username = 'Min 3 characters'
    if (!formData.password) ne.password = 'Password is required'
    else if (formData.password.length < 6) ne.password = 'Min 6 characters'
    if (!formData.confirmPassword) ne.confirmPassword = 'Please confirm your password'
    else if (formData.password !== formData.confirmPassword) ne.confirmPassword = 'Passwords do not match'
    setErrors(ne)
    return Object.keys(ne).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    if (validation.username.available === false) { setErrors(p => ({ ...p, username: 'Username taken' })); return }
    if (validation.email.available === false) { setErrors(p => ({ ...p, email: 'Email already registered' })); return }
    setIsLoading(true)
    setErrors({})
    try {
      await signup(formData)
      navigate('/')
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
    <div className={styles.authPage}>
      {/* Left branding panel */}
      <div className={styles.brandPanel}>
        <div className={styles.brandContent}>
          <img src="/logo.png" alt="HopeLine" className={styles.brandLogo} />
          <div className={styles.brandName}>HopeLine</div>
          <p className={styles.brandTagline}>
            Join thousands of students who have found peace of mind through our comprehensive mental health platform.
          </p>
          <div className={styles.brandFeatures}>
            <div className={styles.brandFeature}>
              <div className={styles.brandFeatureIcon}>📊</div>
              <span>PHQ-9 &amp; GAD-7 assessments</span>
            </div>
            <div className={styles.brandFeature}>
              <div className={styles.brandFeatureIcon}>🧘</div>
              <span>Guided exercises &amp; meditation</span>
            </div>
            <div className={styles.brandFeature}>
              <div className={styles.brandFeatureIcon}>💬</div>
              <span>Real-time counselor chat</span>
            </div>
            <div className={styles.brandFeature}>
              <div className={styles.brandFeatureIcon}>🔒</div>
              <span>Your data stays confidential</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className={styles.formPanel}>
        <div className={styles.authCard}>
          <div className={styles.authHeader}>
            <Link to="/" className={styles.backLink}>← Back to Home</Link>
            <h1>Create Account</h1>
            <p>Join HopeLine and start your wellness journey</p>
          </div>

          <form onSubmit={handleSubmit}>
            {errors.general && <div className={styles.generalError}>⚠ {errors.general}</div>}

            <div className={styles.formGroup}>
              <label htmlFor="name">Full Name</label>
              <input
                type="text" id="name" name="name"
                value={formData.name} onChange={handleChange}
                className={errors.name ? 'error' : ''}
                placeholder="Your full name"
                required
              />
              {errors.name && <span className={styles.errorText}>{errors.name}</span>}
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="email">Email</label>
                <div className={styles.inputWithValidation}>
                  <input
                    type="email" id="email" name="email"
                    value={formData.email} onChange={handleChange}
                    className={`${errors.email ? 'error' : ''} ${validation.email.available === true ? 'success' : ''}`}
                    placeholder="you@university.edu"
                    required
                  />
                  {validation.email.checking && <span className={`${styles.validationIcon} ${styles.checking}`}>...</span>}
                  {validation.email.available === true && <span className={`${styles.validationIcon} ${styles.successIcon}`}>✓</span>}
                  {validation.email.available === false && <span className={`${styles.validationIcon} ${styles.errorIcon}`}>✗</span>}
                </div>
                {errors.email && <span className={styles.errorText}>{errors.email}</span>}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="username">Username</label>
                <div className={styles.inputWithValidation}>
                  <input
                    type="text" id="username" name="username"
                    value={formData.username} onChange={handleChange}
                    className={`${errors.username ? 'error' : ''} ${validation.username.available === true ? 'success' : ''}`}
                    placeholder="Choose a username"
                    required
                  />
                  {validation.username.checking && <span className={`${styles.validationIcon} ${styles.checking}`}>...</span>}
                  {validation.username.available === true && <span className={`${styles.validationIcon} ${styles.successIcon}`}>✓</span>}
                  {validation.username.available === false && <span className={`${styles.validationIcon} ${styles.errorIcon}`}>✗</span>}
                </div>
                {errors.username && <span className={styles.errorText}>{errors.username}</span>}
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="password">Password</label>
              <input
                type="password" id="password" name="password"
                value={formData.password} onChange={handleChange}
                className={errors.password ? 'error' : ''}
                placeholder="Create a password (min 6 characters)"
                required
              />
              {formData.password && (
                <>
                  <div className={styles.strengthBar}>
                    {[1, 2, 3, 4, 5].map(i => (
                      <div key={i} className={`${styles.strengthSeg} ${i <= strength.score ? (strength.score <= 2 ? styles.danger : strength.score <= 3 ? styles.warn : styles.filled) : ''}`} />
                    ))}
                  </div>
                  <div className={styles.strengthLabel}>{strength.label}</div>
                </>
              )}
              {errors.password && <span className={styles.errorText}>{errors.password}</span>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password" id="confirmPassword" name="confirmPassword"
                value={formData.confirmPassword} onChange={handleChange}
                className={errors.confirmPassword ? 'error' : ''}
                placeholder="Confirm your password"
                required
              />
              {errors.confirmPassword && <span className={styles.errorText}>{errors.confirmPassword}</span>}
            </div>

            <button
              type="submit" className={styles.submitBtn}
              disabled={isLoading || validation.username.checking || validation.email.checking}
            >
              {isLoading ? 'Creating Account...' : 'Create Account →'}
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
    </div>
  )
}
