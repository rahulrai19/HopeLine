import { useState } from 'react'

const initial = [
  { id: 1, name: 'Dr. A. Sharma', available: true },
  { id: 2, name: 'Ms. R. Iyer', available: false },
]

export function OfflineCounselorSupport() {
  const [list, setList] = useState(initial)
  function toggle(id){ setList(prev=>prev.map(c=>c.id===id? {...c, available:!c.available}:c)) }
  return (
    <div className="card">
      <h2>Offline Counselor Support</h2>
      {list.map(c => (
        <div key={c.id} className="card" style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:10}}>
          <div>
            <strong>{c.name}</strong>
            <span className="pill" style={{marginLeft:8}}>{c.available? 'Available':'Unavailable'}</span>
          </div>
          <button className="btn" onClick={()=>toggle(c.id)}>Toggle</button>
        </div>
      ))}
      <div className="card" style={{marginTop:12}}>
        <h4>Assign Students (placeholder)</h4>
        <p>Interface to assign students to counselors.</p>
      </div>
    </div>
  )
}


