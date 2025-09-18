const cases = [
  { id: 'C-102', student: 'Aarav', risk: 'High', counselor: 'Dr. A. Sharma' },
  { id: 'C-117', student: 'Dia', risk: 'Medium', counselor: 'Ms. R. Iyer' },
]

export function CaseMonitoring() {
  return (
    <div className="card">
      <h2>Case Monitoring</h2>
      {cases.map(c => (
        <div key={c.id} className="card" style={{marginTop:10}}>
          <strong>{c.id}</strong> • {c.student} • Risk: <span className={c.risk==='High' ? 'risk-high' : 'pill'}>{c.risk}</span> • {c.counselor}
          <div style={{marginTop:8}}>
            <button className="btn">Open Details</button>
          </div>
        </div>
      ))}
    </div>
  )
}


