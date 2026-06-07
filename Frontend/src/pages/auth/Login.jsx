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

  useEffect(()=>{ 
    if (role !== initialRole) { 
      // User changed role manually
    } 
  }, [role, initialRole])

  function submit(e){
    e.preventDefault()
    setError('')
    setIsLoading(true)
    const form = new FormData(e.currentTarget)
    const identity = form.get('identity')
    const password = form.get('password')
    
    login(role === 'admin' || role === 'counselor' ? { username: identity, password } : { email: identity, password })
      .then(() => navigate(role === 'admin' ? '/admin/dashboard' : role === 'counselor' ? '/counselor/dashboard' : '/student/dashboard'))
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
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <div className={styles.authHeader}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <div className={styles.logoSection}>
              <img src="/logo.png" alt="HopeLine Logo" className={styles.logoImage} />
              <div className={styles.logoText}>HopeLine</div>
            </div>
          </Link>
          <h1>Welcome Back</h1>
          <p>Your mental health companion</p>
        </div>

        <form onSubmit={submit}>
          {error && <div className={styles.generalError}>{error}</div>}
          
          <div className={styles.roleToggle}>
            <label className={role === 'student' ? styles.active : ''}>
              <input 
                type="radio" 
                name="role" 
                checked={role === 'student'} 
                onChange={() => setRole('student')}
              />
              Student
            </label>
            <label className={role === 'admin' ? styles.active : ''}>
              <input 
                type="radio" 
                name="role" 
                checked={role === 'admin'} 
                onChange={() => setRole('admin')}
              />
              Admin
            </label>
            <label className={role === 'counselor' ? styles.active : ''}>
              <input 
                type="radio" 
                name="role" 
                checked={role === 'counselor'} 
                onChange={() => setRole('counselor')}
              />
              Counselor
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
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        {role === 'student' && (
          <div className={styles.authFooter}>
            <p>
              Don't have an account? 
              <Link to="/signup" className={styles.switchLink}>Create Student Account</Link>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
