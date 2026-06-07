import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import styles from './ProfileDropdown.module.scss'

export function ProfileDropdown() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (!user) return null

  const name = user.fullName || user.name || user.username || 'User'
  const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()

  const handleLogout = () => {
    setIsOpen(false)
    logout()
    navigate('/login')
  }

  return (
    <div className={styles.dropdownContainer} ref={dropdownRef}>
      <button className={styles.trigger} onClick={() => setIsOpen(!isOpen)}>
        <div className={styles.avatar}>{initials}</div>
        <div className={styles.userInfo}>
          <span className={styles.userName}>{name}</span>
          <span className={styles.userRole}>{user.role || 'Student'}</span>
        </div>
      </button>

      {isOpen && (
        <div className={styles.dropdownMenu}>
          <div className={styles.menuHeader}>
            <div className={styles.fullName}>{name}</div>
            <div className={styles.email}>{user.email || 'No email provided'}</div>
          </div>
          <div className={styles.menuBody}>
            <button className={`${styles.menuItem} ${styles.logoutItem}`} onClick={handleLogout}>
              <span>🚪</span> Logout
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
