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
    <form className="card" onSubmit={submit} style={{maxWidth:520, margin:'0 auto'}}>
      <h2>Login</h2>
      <div style={{display:'flex', gap:12, marginTop:8}}>
        <label className="pill"><input type="radio" name="role" checked={role==='student'} onChange={()=>setRole('student')} /> Student</label>
        <label className="pill"><input type="radio" name="role" checked={role==='admin'} onChange={()=>setRole('admin')} /> Admin</label>
      </div>
      <label style={{marginTop:12}}>Email / Username</label>
      <input name="identity" required defaultValue={role==='admin'? 'admin' : 'student@university.edu'} placeholder={role==='admin'? 'admin':'you@university.edu'} autoComplete={role==='admin' ? 'username' : 'email'} />
      <label>Password</label>
      <input name="password" type="password" required defaultValue="admin123" placeholder="••••••••" autoComplete="current-password" />
      <button className="btn primary" style={{marginTop:12}}>Sign in</button>
    </form>
  )
}


