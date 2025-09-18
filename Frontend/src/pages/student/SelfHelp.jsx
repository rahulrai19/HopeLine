import { useState } from 'react'

const resources = [
  { id: 1, title: 'Mindful Breathing (5 min)', type: 'Meditation' },
  { id: 2, title: 'Grounding Exercise (3-2-1)', type: 'Exercise' },
  { id: 3, title: 'Sleep Hygiene Basics', type: 'Article' },
]

export function SelfHelp() {
  const [mood, setMood] = useState(5)
  return (
    <div className="grid" style={{gap:24}}>
      <section className="card">
        <h2>Self Help Library</h2>
        <div className="grid grid-3">
          {resources.map(r=> (
            <div key={r.id} className="card">
              <h4>{r.title}</h4>
              <p className="pill">{r.type}</p>
              <button className="btn">Open</button>
            </div>
          ))}
        </div>
      </section>
      <section className="card">
        <h3>Mood Tracker</h3>
        <label>How do you feel today? {mood}/10</label>
        <input type="range" min="0" max="10" value={mood} onChange={e=>setMood(Number(e.target.value))} />
      </section>
    </div>
  )
}


