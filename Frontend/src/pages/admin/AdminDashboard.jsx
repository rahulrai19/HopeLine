import { useAuth } from '../../context/AuthContext.jsx'
import { UserManagement } from './UserManagement.jsx'
import { ReportsAnalytics } from './ReportsAnalytics.jsx'
import { CaseMonitoring } from './CaseMonitoring.jsx'
import { OfflineCounselorSupport } from './OfflineCounselorSupport.jsx'
import { UpdatesNotification } from './UpdatesNotification.jsx'
import { AdminCharts } from './AdminCharts.jsx'
import { Sidebar } from './Sidebar.jsx'
import styles from './AdminDashboard.module.scss'
import { useNavigate } from 'react-router-dom'

export function AdminDashboard() {
  const { adminLoggedIn, logoutAdmin } = useAuth()
  const navigate = useNavigate()
  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.dashboardMain}>
        <div className={styles.dashboardRoot}>
          
          {/* Header */}
          <div className={styles.header}>
            <div className={styles.headerContent}>
              <div className={styles.headerLeft}>
                <div className={styles.logo}>
                  <div className={styles.logoIcon}>💚</div>
                  <span>HopeLine Admin</span>
                </div>
              </div>
              <div className={styles.headerRight}>
                <div className={styles.adminStatus}>
                  <span className={styles.statusDot}></span>
                  <span>Admin Online</span>
                </div>
                <button className={styles.logoutBtn} onClick={logoutAdmin}>
                  Logout
                </button>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <section className={styles.statsSection}>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>👥</div>
              <div className={styles.statContent}>
                <div className={styles.statValue}>128</div>
                <div className={styles.statLabel}>Active Users</div>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>📊</div>
              <div className={styles.statContent}>
                <div className={styles.statValue}>6</div>
                <div className={styles.statLabel}>Pending Cases</div>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>👨‍⚕️</div>
              <div className={styles.statContent}>
                <div className={styles.statValue}>4</div>
                <div className={styles.statLabel}>Online Counselors</div>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>💬</div>
              <div className={styles.statContent}>
                <div className={styles.statValue}>23</div>
                <div className={styles.statLabel}>Active Chats</div>
              </div>
            </div>
          </section>

          {/* Main Content Grid */}
          <div className={styles.contentGrid}>
            <div className={styles.mainContent}>
              <section className={styles.card}>
                <div className={styles.cardHeader}>
                  <h3>Analytics Overview</h3>
                  <div className={styles.cardIcon}>📈</div>
                </div>
                <div className={styles.cardContent}>
                  <AdminCharts />
                </div>
              </section>

              <section className={styles.card}>
                <div className={styles.cardHeader}>
                  <h3>Recent Activity</h3>
                  <div className={styles.cardIcon}>🕒</div>
                </div>
                <div className={styles.activityList}>
                  <div className={styles.activityItem}>
                    <div className={styles.activityIcon}>👤</div>
                    <div className={styles.activityContent}>
                      <div className={styles.activityTitle}>New user registered</div>
                      <div className={styles.activityTime}>2 minutes ago</div>
                    </div>
                  </div>
                  <div className={styles.activityItem}>
                    <div className={styles.activityIcon}>💬</div>
                    <div className={styles.activityContent}>
                      <div className={styles.activityTitle}>Chat session completed</div>
                      <div className={styles.activityTime}>5 minutes ago</div>
                    </div>
                  </div>
                  <div className={styles.activityItem}>
                    <div className={styles.activityIcon}>📊</div>
                    <div className={styles.activityContent}>
                      <div className={styles.activityTitle}>Assessment submitted</div>
                      <div className={styles.activityTime}>10 minutes ago</div>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            <div className={styles.sidebar}>
              <section className={styles.card}>
                <div className={styles.cardHeader}>
                  <h3>Quick Actions</h3>
                  <div className={styles.cardIcon}>⚡</div>
                </div>
                <div className={styles.actionList}>
                  <button className={styles.actionBtn} onClick={() => navigate('/admin/users')}>
                    <div className={styles.actionIcon}>👥</div>
                    <span>Manage Users</span>
                  </button>
                  <button className={styles.actionBtn} onClick={() => navigate('/admin/cases')}>
                    <div className={styles.actionIcon}>📋</div>
                    <span>View Cases</span>
                  </button>
                  <button className={styles.actionBtn} onClick={() => navigate('/admin/reports')}>
                    <div className={styles.actionIcon}>📊</div>
                    <span>Generate Reports</span>
                  </button>
                  <button className={styles.actionBtn}>
                    <div className={styles.actionIcon}>🔔</div>
                    <span>Send Notification</span>
                  </button>
                </div>
              </section>

              <section className={styles.card}>
                <div className={styles.cardHeader}>
                  <h3>System Status</h3>
                  <div className={styles.cardIcon}>🟢</div>
                </div>
                <div className={styles.statusList}>
                  <div className={styles.statusItem}>
                    <span className={styles.statusLabel}>API Server</span>
                    <span className={styles.statusValue}>Online</span>
                  </div>
                  <div className={styles.statusItem}>
                    <span className={styles.statusLabel}>Database</span>
                    <span className={styles.statusValue}>Online</span>
                  </div>
                  <div className={styles.statusItem}>
                    <span className={styles.statusLabel}>AI Service</span>
                    <span className={styles.statusValue}>Online</span>
                  </div>
                  <div className={styles.statusItem}>
                    <span className={styles.statusLabel}>Chat Service</span>
                    <span className={styles.statusValue}>Online</span>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}