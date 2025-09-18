import { Link } from 'react-router-dom'

export function CrisisAlert() {
  return (
    <div className="modal-backdrop">
      <div className="card modal">
        <h2 className="risk-high">High Risk Detected</h2>
        <p>Please contact emergency services or reach out immediately.</p>
        <ul>
          <li>Campus Security: <strong>+91 12345 67890</strong></li>
          <li>National Helpline: <strong>1800-599-0019</strong></li>
        </ul>
        <div style={{display:'flex', gap:10, justifyContent:'flex-end'}}>
          <a className="btn danger" href="tel:18005990019">Call Now</a>
          <Link className="btn" to="/student/self-help">Back to Safety Resources</Link>
        </div>
      </div>
    </div>
  )
}


