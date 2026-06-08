import { useState, useEffect } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { NavbarChat } from '../chatbot/NavbarChat.jsx'
import { ProfileDropdown } from './ProfileDropdown.jsx'
import styles from './AppShell.module.scss'

const studentNav = [
  { to: '/', label: 'Dashboard', icon: '🏠', exact: true },
  { to: '/student/support', label: 'Support Hub', icon: '🤝' },
  { to: '/student/assessment', label: 'Assessment', icon: '📊' },
  { to: '/student/peer', label: 'Community Chat', icon: '💬' },
  { to: '/student/counselor', label: 'Counselor', icon: '👨‍⚕️' },
  { to: '/student/self-help', label: 'Self-Help', icon: '📚' },
]

const adminNav = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: '🏠' },
  { to: '/admin/cases', label: 'Case Monitoring', icon: '💬' },
  { to: '/admin/users', label: 'User Management', icon: '👥' },
  { to: '/admin/reports', label: 'Reports', icon: '📈' },
  { to: '/admin/updates', label: 'Notifications', icon: '🔔' },
]

export function AppShell() {
  const { user, adminLoggedIn } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light')
  const location = useLocation()
  const navigate = useNavigate()

  const navItems = adminLoggedIn ? adminNav : studentNav

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') root.setAttribute('data-theme', 'dark')
    else root.removeAttribute('data-theme')
    localStorage.setItem('theme', theme)
  }, [theme])

  // Close sidebar on navigation (mobile)
  useEffect(() => { setSidebarOpen(false) }, [location])

  const pageTitle = [...studentNav, ...adminNav].find(n => {
    if (n.exact) return location.pathname === n.to
    return location.pathname.startsWith(n.to) && n.to !== '/'
  })?.label || 'HopeLine'

  return (
    <div className={styles.shell}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className={styles.mobileOverlay} onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.open : ''}`}>
        <div className={styles.sidebarTop}>
          <a href="/" className={styles.brand}>
            <img src="/logo.png" alt="HopeLine" className={styles.brandLogo} />
            <span className={styles.brandText}>HopeLine</span>
          </a>
        </div>

        <nav className={styles.nav}>
          <div className={styles.navSection}>Menu</div>
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.exact}
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.active : ''}`
              }
            >
              <span className={styles.navIcon}>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}

          {!adminLoggedIn && (
            <>
              <div className={styles.navSection} style={{ marginTop: 12 }}>Emergency</div>
              <NavLink
                to="/student/crisis"
                className={({ isActive }) =>
                  `${styles.navItem} ${styles.crisisNav} ${isActive ? styles.active : ''}`
                }
              >
                <span className={styles.navIcon}>🚨</span>
                Crisis Alert
              </NavLink>
            </>
          )}
        </nav>

        <div className={styles.sidebarBottom}>
          <button
            className={styles.themeToggle}
            onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}
          >
            <span>{theme === 'dark' ? '🌙' : '☀️'}</span>
            {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className={styles.main}>
        {/* Top bar */}
        <header className={styles.topBar}>
          <div className={styles.topBarLeft}>
            <button className={styles.burger} onClick={() => setSidebarOpen(v => !v)}>
              ☰
            </button>
            <span className={styles.topBarTitle}>{pageTitle}</span>
          </div>
          <div className={styles.topBarRight}>
            {!adminLoggedIn && <NavbarChat />}
            {user && <ProfileDropdown />}
          </div>
        </header>

        {/* Page content */}
        <div className={styles.content}>
          <Outlet />
        </div>
      </div>
    </div>
  )
}
