import { Link } from 'react-router-dom'

export function StudentLanding() {

  return (
    <div className="grid" style={{gap:24}}>
      <section className="card">
        <h1>Student App</h1>
        <p className="pill">Your safe space for support</p>
        <p>Access self help, peer communities, and professional counsellors in one place.</p>
        <div className="grid" style={{gridTemplateColumns:'repeat(3, minmax(0,1fr))'}}>
          <Link to="/student/assessment" className="card" style={{display:'block'}}>
            <h3>Assessment</h3>
            <p>PHQ-9 + GAD-7</p>
          </Link>
          <Link to="/student/dashboard" className="card" style={{display:'block'}}>
            <h3>Dashboard</h3>
            <p>Personalised overview</p>
          </Link>
          <Link to="/student/crisis" className="card" style={{display:'block'}}>
            <h3>Crisis Alert</h3>
            <p>Emergency guidance</p>
          </Link>
        </div>
      </section>
      <div className="card" style={{textAlign:'center'}}>
        <h3>Get Started</h3>
        <p>Login to access your dashboard and support options.</p>
        <div style={{display:'flex', gap:10, justifyContent:'center'}}>
          <Link to="/login?role=student" className="btn primary">Student Login</Link>
          <Link to="/login?role=admin" className="btn">Admin Login</Link>
        </div>
      </div>
    </div>
  )
}


