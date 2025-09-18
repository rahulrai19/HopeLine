import { Link } from 'react-router-dom'
import styles from './StudentDashboard.module.scss'

export function StudentDashboard() {
  return (
    <div className={styles.wrap}>
      <section className="card">
        <h2>Hello, Student</h2>
        <p>Overview of your wellbeing</p>
        <p>Risk status: <strong className="risk-low">Low Risk</strong></p>
        <Link to="/student/assessment" className="btn">Take Assessment</Link>
      </section>
      <section className="card">
        <h3>Quick Actions</h3>
        <div style={{display:'flex', gap:10, flexWrap:'wrap'}}>
          <Link to="/student/support" className="btn primary">Choose Support</Link>
          <Link to="/student/crisis" className="btn danger">Crisis Alert</Link>
        </div>
      </section>
      <section className="card">
        <h3>Recent Resources</h3>
        <ul>
          <li><Link to="/student/self-help">Mindful breathing (5 min)</Link></li>
          <li><Link to="/student/self-help">De-stress playlist</Link></li>
        </ul>
      </section>
    </div>
  )
}


