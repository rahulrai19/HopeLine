import { useEffect, useState } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import styles from './Auth.module.scss'

export function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const { search } = useLocation()
  const params = new URLSearchParams(search)
  const initialRole = params.get('role') === 'admin' ? 'admin' : 'student'
  const [role, setRole] = useState(initialRole)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  function submit(e) {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    const form = new FormData(e.currentTarget)
    const identity = form.get('identity')
    const password = form.get('password')

    login(role === 'admin' || role === 'counselor' ? { username: identity, password } : { email: identity, password })
      .then(() => navigate(role === 'admin' ? '/admin/dashboard' : '/'))
      .catch((err) => {
        try {
          const errorData = JSON.parse(err.message)
          setError(errorData.message || 'Login failed')
        } catch {
          setError('Login failed. Please check your credentials.')
        }
      })
      .finally(() => setIsLoading(false))
  }

  return (
    <div className={styles.authPage}>
      {/* Left branding panel */}
      <div className={styles.brandPanel}>
        <div className={styles.brandContent}>
          <img src="/logo.png" alt="HopeLine" className={styles.brandLogo} />
          <div className={styles.brandName}>HopeLine</div>
          <p className={styles.brandTagline}>
            Your comprehensive digital mental health companion — always here to listen, support, and guide you.
          </p>
          <div className={styles.brandFeatures}>
            <div className={styles.brandFeature}>
              <div className={styles.brandFeatureIcon}>🤖</div>
              <span>AI-powered 24/7 support</span>
            </div>
            <div className={styles.brandFeature}>
              <div className={styles.brandFeatureIcon}>👥</div>
              <span>Anonymous peer community</span>
            </div>
            <div className={styles.brandFeature}>
              <div className={styles.brandFeatureIcon}>👨‍⚕️</div>
              <span>Licensed counselors on demand</span>
            </div>
            <div className={styles.brandFeature}>
              <div className={styles.brandFeatureIcon}>🔒</div>
              <span>Private &amp; secure by design</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className={styles.formPanel}>
        <div className={styles.authCard}>
          <div className={styles.authHeader}>
            <Link to="/" className={styles.backLink}>← Back to Home</Link>
            <h1>Welcome Back</h1>
            <p>Sign in to continue your mental health journey</p>
          </div>

          <form onSubmit={submit}>
            {error && <div className={styles.generalError}>⚠ {error}</div>}

            <div className={styles.roleToggle}>
              <label className={role === 'student' ? styles.active : ''}>
                <input type="radio" name="role" checked={role === 'student'} onChange={() => setRole('student')} />
                🎓 Student
              </label>
              <label className={role === 'admin' ? styles.active : ''}>
                <input type="radio" name="role" checked={role === 'admin'} onChange={() => setRole('admin')} />
                🛡️ Admin
              </label>
              <label className={role === 'counselor' ? styles.active : ''}>
                <input type="radio" name="role" checked={role === 'counselor'} onChange={() => setRole('counselor')} />
                👨‍⚕️ Counselor
              </label>
            </div>

            <div className={styles.formGroup}>
              <label>{role === 'admin' || role === 'counselor' ? 'Username' : 'Email Address'}</label>
              <input
                name="identity"
                required
                defaultValue={role === 'student' ? 'student@university.edu' : role}
                placeholder={role === 'student' ? 'you@university.edu' : `Enter ${role} username`}
                autoComplete={role === 'student' ? 'email' : 'username'}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Password</label>
              <input
                name="password"
                type="password"
                required
                defaultValue="admin123"
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>

            <button type="submit" className={styles.submitBtn} disabled={isLoading}>
              {isLoading ? 'Signing In...' : 'Sign In →'}
            </button>
          </form>

          {role === 'student' && (
            <div className={styles.authFooter}>
              <p>
                Don't have an account?
                <Link to="/signup" className={styles.switchLink}>Create Account</Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
