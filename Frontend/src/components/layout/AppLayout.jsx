import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import styles from './AppLayout.module.scss'
import { useAuth } from '../../context/AuthContext.jsx'
import { MoodIndicator } from '../mood/MoodIndicator.jsx'
import { NavbarChat } from '../chatbot/NavbarChat.jsx'
import { ProfileDropdown } from './ProfileDropdown.jsx'

export function AppLayout() {
  const { adminLoggedIn, user } = useAuth()
  const [open, setOpen] = useState(false)
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light')
  const navigate = useNavigate()
  function goAdmin(){ navigate(adminLoggedIn ? '/admin/dashboard' : '/login?role=admin') }

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') root.setAttribute('data-theme', 'dark')
    else root.removeAttribute('data-theme')
    localStorage.setItem('theme', theme)
  }, [theme])

  function toggleTheme(){
    setTheme(t => t === 'light' ? 'dark' : 'light')
  }
  
  const themeIcon = theme === 'dark' ? '🌙' : '☀️'
  const themeTitle = `Theme: ${theme} (click to switch)`
  return (
    <div className={styles.shell}>
      <header className="header">
        <nav className="nav container">
          <div className={styles.left}>
            <button className={styles.burger} aria-label="Menu" onClick={()=>setOpen(v=>!v)}>☰</button>
            <Link to="/" className={styles.brandLogo}>
              <img src="/logo.png" alt="HopeLine Logo" className={styles.logoImage} />
              <span className={styles.brandText}>HopeLine</span>
            </Link>
          </div>
          <div className={`${styles.links} ${open? styles.open:''}`} onClick={()=>setOpen(false)}>
            <NavLink to="/student">Student</NavLink>
            <NavLink to="/student/dashboard">Dashboard</NavLink>
            <NavLink to="/student/support">Support</NavLink>
          </div>
          <div className={styles.status}>
            <MoodIndicator compact={true} />
            <button className={styles.iconBtn} onClick={toggleTheme} aria-label="Toggle theme" title={themeTitle}>
              <span style={{fontSize:'18px', lineHeight:1}}>{themeIcon}</span>
            </button>
            <NavbarChat />
            {user ? (
              <ProfileDropdown />
            ) : (
              <button className="btn primary" onClick={goAdmin}>{adminLoggedIn ? 'Admin Panel' : 'Login'}</button>
            )}
          </div>
        </nav>
      </header>
      <main className="container">
        <div className={styles.mainContent}>
          <div className={styles.contentArea}>
            <Outlet />
          </div>
          <div className={styles.sidebar}>
            <MoodIndicator showHistory={true} />
          </div>
        </div>
      </main>
      <footer className="footer">© {new Date().getFullYear()} HopeLine • Digital Mental Health for Students</footer>
    </div>
  )
}


