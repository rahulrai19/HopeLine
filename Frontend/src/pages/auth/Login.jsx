import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'

export function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const { search } = useLocation()
  const params = new URLSearchParams(search)
  const initialRole = params.get('role') === 'admin' ? 'admin' : 'student'
  const [role, setRole] = useState(initialRole)

  useEffect(()=>{ if (role !== initialRole) { /* allow change */ } }, [role])

  function submit(e){
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const identity = form.get('identity')
    const password = form.get('password')
    login(role==='admin' ? { username: identity, password } : { email: identity, password })
      .then(()=> navigate(role==='admin'? '/admin/dashboard' : '/student/dashboard'))
      .catch(()=> alert('Login failed'))
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      background: 'radial-gradient(ellipse at center, #1a1a1a 0%, #0a0a0a 70%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <style>{`
        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>
      <div style={{
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '20px',
        padding: '40px',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        maxWidth: '480px',
        width: '100%'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            marginBottom: '24px'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              background: 'linear-gradient(135deg, #66b2b2, #4a9d9d)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              animation: 'heartbeat 2s ease-in-out infinite'
            }}>💚</div>
            <h1 style={{
              fontSize: '32px',
              fontWeight: '700',
              color: '#ffffff',
              margin: '0'
            }}>HopeLine</h1>
          </div>
          <p style={{
            color: '#e0e0e0',
            fontSize: '18px',
            margin: '0',
            lineHeight: '1.6'
          }}>Your mental health companion</p>
        </div>

        <form onSubmit={submit}>
          <h2 style={{
            fontSize: '28px',
            fontWeight: '700',
            color: '#ffffff',
            marginBottom: '32px',
            textAlign: 'center',
            background: 'linear-gradient(135deg, #66b2b2, #4a9d9d)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>Welcome Back</h2>
          
          <div style={{
            display: 'flex',
            gap: '12px',
            marginBottom: '24px',
            justifyContent: 'center'
          }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: '20px',
              background: role === 'student' ? 'linear-gradient(135deg, #66b2b2, #4a9d9d)' : 'transparent',
              border: '1px solid ' + (role === 'student' ? '#66b2b2' : 'rgba(255, 255, 255, 0.2)'),
              color: role === 'student' ? '#ffffff' : '#cccccc',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}>
              <input 
                type="radio" 
                name="role" 
                checked={role==='student'} 
                onChange={()=>setRole('student')}
                style={{ display: 'none' }}
              />
              Student
            </label>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: '20px',
              background: role === 'admin' ? 'linear-gradient(135deg, #66b2b2, #4a9d9d)' : 'transparent',
              border: '1px solid ' + (role === 'admin' ? '#66b2b2' : 'rgba(255, 255, 255, 0.2)'),
              color: role === 'admin' ? '#ffffff' : '#cccccc',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}>
              <input 
                type="radio" 
                name="role" 
                checked={role==='admin'} 
                onChange={()=>setRole('admin')}
                style={{ display: 'none' }}
              />
              Admin
            </label>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#e0e0e0',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              {role === 'admin' ? 'Username' : 'Email Address'}
            </label>
            <input 
              name="identity" 
              required 
              defaultValue={role==='admin'? 'admin' : 'student@university.edu'} 
              placeholder={role==='admin'? 'admin':'you@university.edu'} 
              autoComplete={role==='admin' ? 'username' : 'email'}
              style={{
                width: '100%',
                padding: '16px 20px',
                borderRadius: '12px',
                border: '2px solid rgba(255, 255, 255, 0.1)',
                background: 'rgba(255, 255, 255, 0.05)',
                color: '#ffffff',
                fontSize: '16px',
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(10px)'
              }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#e0e0e0',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              Password
            </label>
            <input 
              name="password" 
              type="password" 
              required 
              defaultValue="admin123" 
              placeholder="••••••••" 
              autoComplete="current-password"
              style={{
                width: '100%',
                padding: '16px 20px',
                borderRadius: '12px',
                border: '2px solid rgba(255, 255, 255, 0.1)',
                background: 'rgba(255, 255, 255, 0.05)',
                color: '#ffffff',
                fontSize: '16px',
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(10px)'
              }}
            />
          </div>

          <button 
            type="submit"
            style={{
              width: '100%',
              padding: '18px 24px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #66b2b2, #4a9d9d)',
              color: '#ffffff',
              border: 'none',
              fontSize: '18px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-3px)'
              e.target.style.boxShadow = '0 15px 30px rgba(102, 178, 178, 0.4)'
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)'
              e.target.style.boxShadow = 'none'
            }}
          >
            Sign In
          </button>
        </form>

        {role === 'student' && (
          <div style={{
            textAlign: 'center',
            marginTop: '24px',
            paddingTop: '24px',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <p style={{
              color: '#cccccc',
              fontSize: '14px',
              margin: '0 0 12px 0'
            }}>
              Don't have an account?
            </p>
            <a 
              href="/signup"
              style={{
                color: '#66b2b2',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: '600',
                padding: '8px 16px',
                border: '1px solid #66b2b2',
                borderRadius: '20px',
                display: 'inline-block',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.background = '#66b2b2'
                e.target.style.color = '#ffffff'
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'transparent'
                e.target.style.color = '#66b2b2'
              }}
            >
              Create Student Account
            </a>
          </div>
        )}
      </div>
    </div>
  )
}


