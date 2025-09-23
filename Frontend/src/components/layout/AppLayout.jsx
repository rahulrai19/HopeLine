import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import styles from './AppLayout.module.scss'
import { useAuth } from '../../context/AuthContext.jsx'
import { MoodIndicator } from '../mood/MoodIndicator.jsx'
import { NavbarChat } from '../chatbot/NavbarChat.jsx'

export function AppLayout() {
  const { adminLoggedIn } = useAuth()
  const [open, setOpen] = useState(false)
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'system')
  const navigate = useNavigate()
  function goAdmin(){ navigate(adminLoggedIn ? '/admin/dashboard' : '/login?role=admin') }

  // Determine effective theme when using system preference
  function getSystemTheme(){
    if (typeof window === 'undefined') return 'light'
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }

  useEffect(() => {
    const root = document.documentElement
    const apply = (mode) => {
      const effective = mode === 'system' ? getSystemTheme() : mode
      if (effective === 'dark') root.setAttribute('data-theme', 'dark')
      else root.removeAttribute('data-theme')
    }

    apply(theme)
    localStorage.setItem('theme', theme)

    // Listen to OS changes when in system mode
    const mql = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null
    const handler = () => { if (theme === 'system') apply('system') }
    if (mql) mql.addEventListener ? mql.addEventListener('change', handler) : mql.addListener(handler)
    return () => { if (mql) mql.removeEventListener ? mql.removeEventListener('change', handler) : mql.removeListener(handler) }
  }, [theme])

  function toggleTheme(){
    setTheme(t => t === 'light' ? 'dark' : t === 'dark' ? 'system' : 'light')
  }
  const effectiveTheme = theme === 'system' ? (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : theme
  const themeIcon = theme === 'system' ? '🖥️' : effectiveTheme === 'dark' ? '🌙' : '☀️'
  const themeTitle = `Theme: ${theme} (click to switch)`
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
            <MoodIndicator compact={true} />
            <button className="btn ghost" onClick={toggleTheme} aria-label="Toggle theme" title={themeTitle}>
              <span style={{fontSize:'18px', lineHeight:1}}>{themeIcon}</span>
            </button>
            <NavbarChat />
            <button className="btn primary" onClick={goAdmin}>{adminLoggedIn? 'Admin Panel' : 'Login'}</button>
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


