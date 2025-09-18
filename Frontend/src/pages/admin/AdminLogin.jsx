import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'

export function AdminLogin() {
  const { adminLoggedIn, loginAdmin } = useAuth()
  const navigate = useNavigate()
  function submit(e){ e.preventDefault(); loginAdmin(); navigate('/admin/dashboard') }
  return (
    <form className="card" onSubmit={submit} style={{maxWidth:520, margin:'0 auto'}}>
      <h2>Admin Login</h2>
      <label>Username</label>
      <input required placeholder="admin" />
      <label>Password</label>
      <input type="password" required placeholder="••••••••" />
      <button className="btn primary" style={{marginTop:12}}>Sign in</button>
      <p style={{marginTop:10}}>Status: {adminLoggedIn? 'Logged In':'Logged Out'}</p>
    </form>
  )
}


