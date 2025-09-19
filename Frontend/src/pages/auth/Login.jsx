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
      background: 'radial-gradient(ellipse at center, #1a1a1a 0%, #0a0a0a 70%)'
    }}>
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
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            marginBottom: '16px'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              background: 'linear-gradient(135deg, #66b2b2, #4a9d9d)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px'
            }}>💚</div>
            <h1 style={{
              fontSize: '28px',
              fontWeight: '700',
              color: '#ffffff',
              margin: '0'
            }}>HopeLine</h1>
          </div>
          <p style={{
            color: '#cccccc',
            fontSize: '16px',
            margin: '0'
          }}>Your mental health companion</p>
        </div>

        <form onSubmit={submit}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '600',
            color: '#ffffff',
            marginBottom: '24px',
            textAlign: 'center'
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
                padding: '12px 16px',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                background: 'rgba(255, 255, 255, 0.05)',
                color: '#ffffff',
                fontSize: '16px',
                transition: 'all 0.2s ease'
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
                padding: '12px 16px',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                background: 'rgba(255, 255, 255, 0.05)',
                color: '#ffffff',
                fontSize: '16px',
                transition: 'all 0.2s ease'
              }}
            />
          </div>

          <button 
            type="submit"
            style={{
              width: '100%',
              padding: '14px 24px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #66b2b2, #4a9d9d)',
              color: '#ffffff',
              border: 'none',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-2px)'
              e.target.style.boxShadow = '0 8px 25px rgba(102, 178, 178, 0.3)'
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)'
              e.target.style.boxShadow = 'none'
            }}
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  )
}


