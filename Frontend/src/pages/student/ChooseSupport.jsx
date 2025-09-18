import { Link } from 'react-router-dom'
import styles from './ChooseSupport.module.scss'

export function ChooseSupport() {
  return (
    <div className={styles.support}>
      <div className="card">
        <h3>Self Help</h3>
        <p>Guides, exercises, and tools.</p>
        <Link to="/student/self-help" className="btn primary">Open</Link>
      </div>
      <div className="card">
        <h3>Peer Support</h3>
        <p>Connect with peers anonymously.</p>
        <Link to="/student/peer" className="btn primary">Open</Link>
      </div>
      <div className="card">
        <h3>Counselor</h3>
        <p>Book an appointment.</p>
        <Link to="/student/counselor" className="btn primary">Open</Link>
      </div>
    </div>
  )
}


