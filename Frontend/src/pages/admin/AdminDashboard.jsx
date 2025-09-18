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
      
      {/* 1. Sidebar for Navigation */}
      <Sidebar />

      {/* 2. Main Dashboard Content */}
      <div className={styles.dashboardMain}>
        <div className={styles.dashboardRoot}>
          
          {/* Important Cards Grid - Visually prominent on all screens */}
          <section className={styles.cardsGrid}>
          
            
            <div className={`card ${styles.overviewCard}`}>
              <h3 className={styles.overviewTitle}>Quick Overview</h3>
              <div className={styles.overviewStats}>
                <div className={styles.statItem}>
                  <div className={styles.statValue}>128</div>
                  <div className={styles.statLabel}>Active Users</div>
                </div>
                <div className={styles.statItem}>
                  <div className={styles.statValue}>6</div>
                  <div className={styles.statLabel}>Pending Cases</div>
                </div>
                <div className={styles.statItem}>
                  <div className={styles.statValue}>4</div>
                  <div className={styles.statLabel}>Online Counselors</div>
                </div>
              </div>
            </div>
            
            <div className={`card ${styles.analyticsCard}`}>
              {/* <h3 className={styles.analyticsTitle}>Analytics Overview</h3> */}
              <div className={styles.analyticsContent}><AdminCharts /></div>
            </div>
          </section>

          {/* Compact Admin Cards Grid */}
          <div className={styles.adminGrid}>
            <section className={`card ${styles.smallCard}`}>
              <h4>User Management</h4>
              <div className={styles.cardContent}><UserManagement /></div>
            </section>

            <section className={`card ${styles.smallCard}`} onClick={() => navigate('/admin/reports')} style={{cursor:'pointer'}}>
              <h4>Reports & Analytics</h4>
              <div className={styles.cardContent}><ReportsAnalytics /></div>
            </section>

            <section className={`card ${styles.smallCard}`}>
              <h4>Case Monitoring</h4>
              <div className={styles.cardContent}><CaseMonitoring /></div>
            </section>

            <section className={`card ${styles.smallCard}`}>
              <h4>Offline Counselor Support</h4>
              <div className={styles.cardContent}><OfflineCounselorSupport /></div>
            </section>

            <section className={`card ${styles.smallCard}`}>
              <h4>Updates & Notifications</h4>
              <div className={styles.cardContent}><UpdatesNotification /></div>
            </section>
            
            <section className={`card ${styles.smallCard} ${styles.statusCard}`}>
              <h4>System Status</h4>
              <div className={styles.statusContent}>
                <div className={styles.statusPill}>All services operational</div>
                <div className={styles.adminSession}>
                  <p>Admin session: {adminLoggedIn ? 'Logged In' : 'Logged Out'}</p>
                  {adminLoggedIn && <button className="btn" onClick={logoutAdmin}>Logout Admin</button>}
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}