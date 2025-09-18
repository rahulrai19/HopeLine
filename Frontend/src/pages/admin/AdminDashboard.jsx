import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'

export function AdminDashboard() {
  const { adminLoggedIn, logoutAdmin } = useAuth()
  return (
    <div className="grid grid-3">
      <section className="card">
        <h2>System Overview</h2>
        <ul>
          <li>Active users: 128</li>
          <li>Pending cases: 6</li>
          <li>Online counselors: 4</li>
        </ul>
      </section>
      <section className="card">
        <h3>Navigation</h3>
        <div style={{display:'flex', gap:10, flexWrap:'wrap'}}>
          <Link className="btn" to="/admin/users">User Management</Link>
          <Link className="btn" to="/admin/reports">Reports Analytics</Link>
          <Link className="btn" to="/admin/cases">Case Monitoring</Link>
          <Link className="btn" to="/admin/offline-support">Offline Counselor Support</Link>
          <Link className="btn" to="/admin/updates">Updates Notification</Link>
        </div>
      </section>
      <section className="card">
        <h3>Status</h3>
        <p className="pill">All services operational</p>
        <div style={{marginTop:10}}>
          <p>Admin session: {adminLoggedIn? 'Logged In' : 'Logged Out'}</p>
          {adminLoggedIn && <button className="btn" onClick={logoutAdmin}>Logout Admin</button>}
        </div>
      </section>
    </div>
  )
}


