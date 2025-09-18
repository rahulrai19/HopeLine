import React from 'react'
import { Link } from 'react-router-dom'
import styles from './AdminDashboard.module.scss'

export function Sidebar() {
  return (
    <nav className={styles.sidebar}>
      <ul className={styles.sidebarMenu}>
        <li className={styles.sidebarItem}>
          <Link to="/" className={styles.sidebarLink}>Dashboard</Link>
        </li>
        <li className={styles.sidebarItem}>
          <Link to="/user-management" className={styles.sidebarLink}>User Management</Link>
        </li>
        <li className={styles.sidebarItem}>
          <Link to="/reports" className={styles.sidebarLink}>Reports & Analytics</Link>
        </li>
        <li className={styles.sidebarItem}>
          <Link to="/case-monitoring" className={styles.sidebarLink}>Case Monitoring</Link>
        </li>
        <li className={styles.sidebarItem}>
          <Link to="/counselor-support" className={styles.sidebarLink}>Counselor Support</Link>
        </li>
        <li className={styles.sidebarItem}>
          <Link to="/notifications" className={styles.sidebarLink}>Notifications</Link>
        </li>
      </ul>
    </nav>
  )
}