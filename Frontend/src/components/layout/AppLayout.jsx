import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import styles from './AppLayout.module.scss'
import { useAuth } from '../../context/AuthContext.jsx'

export function AppLayout() {
  const { adminLoggedIn } = useAuth()
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  function goAdmin(){ navigate(adminLoggedIn ? '/admin/dashboard' : '/login?role=admin') }
  return (
    <div className={styles.shell}>
      <header className="header">
        <nav className="nav container">
          <div className={styles.left}>
            <button className={styles.burger} aria-label="Menu" onClick={()=>setOpen(v=>!v)}>☰</button>
            <Link to="/" className="brand">HopeLine</Link>
          </div>
          <div className={`${styles.links} ${open? styles.open:''}`} onClick={()=>setOpen(false)}>
            <NavLink to="/student">Student</NavLink>
            <NavLink to="/student/dashboard">Dashboard</NavLink>
            <NavLink to="/student/support">Support</NavLink>
          </div>
          <div className={styles.status}>
            <button className="btn primary" onClick={goAdmin}>{adminLoggedIn? 'Admin Panel' : 'Login'}</button>
          </div>
        </nav>
      </header>
      <main className="container">
        <Outlet />
      </main>
      <footer className="footer">© {new Date().getFullYear()} HopeLine • Digital Mental Health for Students</footer>
    </div>
  )
}


