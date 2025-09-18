import { useState } from 'react'

export function ReportsAnalytics() {
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  return (
    <div className="grid" style={{gap:24}}>
      <section className="card">
        <h2>Reports & Analytics</h2>
        <div className="grid" style={{gridTemplateColumns:'repeat(3, minmax(0,1fr))'}}>
          <div className="card"><h4>Usage</h4><p>Chart placeholder</p></div>
          <div className="card"><h4>Sentiment</h4><p>Chart placeholder</p></div>
          <div className="card"><h4>Risk Trends</h4><p>Chart placeholder</p></div>
        </div>
      </section>
      <section className="card">
        <h3>Filters</h3>
        <div className="grid" style={{gridTemplateColumns:'repeat(3, minmax(0,1fr))', alignItems:'end'}}>
          <div>
            <label>From</label>
            <input type="date" value={from} onChange={e=>setFrom(e.target.value)} />
          </div>
          <div>
            <label>To</label>
            <input type="date" value={to} onChange={e=>setTo(e.target.value)} />
          </div>
          <button className="btn primary">Generate</button>
        </div>
      </section>
    </div>
  )
}


