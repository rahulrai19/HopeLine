import { Link } from 'react-router-dom'
import styles from './StudentDashboard.module.scss'

export function StudentDashboard() {
  return (
    <div className={styles.wrap}>
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.welcome}>Welcome back, Student! 👋</h1>
          <p className={styles.subtitle}>Here's your mental health overview</p>
          <div className={styles.statusCard}>
            <div className={styles.statusItem}>
              <span className={styles.statusLabel}>Current Status</span>
              <span className={styles.statusValue}>Low Risk</span>
            </div>
            <div className={styles.statusItem}>
              <span className={styles.statusLabel}>Last Assessment</span>
              <span className={styles.statusValue}>2 days ago</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.grid}>
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h3>Quick Actions</h3>
            <div className={styles.cardIcon}>⚡</div>
          </div>
          <div className={styles.actionGrid}>
            <Link to="/student/support" className={styles.actionBtn}>
              <div className={styles.actionIcon}>🤝</div>
              <div>
                <div className={styles.actionTitle}>Choose Support</div>
                <div className={styles.actionDesc}>Get help now</div>
              </div>
            </Link>
            <Link to="/student/assessment" className={styles.actionBtn}>
              <div className={styles.actionIcon}>📊</div>
              <div>
                <div className={styles.actionTitle}>Take Assessment</div>
                <div className={styles.actionDesc}>Check your mood</div>
              </div>
            </Link>
            <Link to="/student/crisis" className={styles.crisisBtn}>
              <div className={styles.actionIcon}>🚨</div>
              <div>
                <div className={styles.actionTitle}>Crisis Alert</div>
                <div className={styles.actionDesc}>Emergency support</div>
              </div>
            </Link>
          </div>
        </section>

        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h3>Recent Resources</h3>
            <div className={styles.cardIcon}>📚</div>
          </div>
          <div className={styles.resourceList}>
            <div className={styles.resourceItem}>
              <div className={styles.resourceIcon}>🧘</div>
              <div className={styles.resourceContent}>
                <div className={styles.resourceTitle}>Mindful Breathing</div>
                <div className={styles.resourceDesc}>5-minute guided session</div>
              </div>
              <Link to="/student/self-help" className={styles.resourceLink}>Start</Link>
            </div>
            <div className={styles.resourceItem}>
              <div className={styles.resourceIcon}>🎵</div>
              <div className={styles.resourceContent}>
                <div className={styles.resourceTitle}>De-stress Playlist</div>
                <div className={styles.resourceDesc}>Calming music collection</div>
              </div>
              <Link to="/student/self-help" className={styles.resourceLink}>Listen</Link>
            </div>
            <div className={styles.resourceItem}>
              <div className={styles.resourceIcon}>📖</div>
              <div className={styles.resourceContent}>
                <div className={styles.resourceTitle}>Daily Journal</div>
                <div className={styles.resourceDesc}>Reflect on your day</div>
              </div>
              <Link to="/student/self-help" className={styles.resourceLink}>Write</Link>
            </div>
          </div>
        </section>

        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h3>Your Progress</h3>
            <div className={styles.cardIcon}>📈</div>
          </div>
          <div className={styles.progressStats}>
            <div className={styles.progressItem}>
              <div className={styles.progressNumber}>7</div>
              <div className={styles.progressLabel}>Days Active</div>
            </div>
            <div className={styles.progressItem}>
              <div className={styles.progressNumber}>3</div>
              <div className={styles.progressLabel}>Sessions Completed</div>
            </div>
            <div className={styles.progressItem}>
              <div className={styles.progressNumber}>85%</div>
              <div className={styles.progressLabel}>Wellness Score</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}


