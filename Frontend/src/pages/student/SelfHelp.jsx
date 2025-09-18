import { useEffect, useMemo, useState } from 'react'

const videos = [
  { id: 'breath5', yt: 'inpok4MKVLM', title: 'Mindful Breathing (5 min)', tag: 'Meditation' },
  { id: 'ground321', yt: 'tEmt1Znux58', title: 'Grounding Exercise (3-2-1)', tag: 'Exercise' },
  // Example MP4 (royalty‑free) to show an unbranded player; replace with your hosted file
  { id: 'motivation', mp4: 'https://cdn.pixabay.com/vimeo/147015082/bird-1860.mp4?width=1280&hash=a0b3f0ed9d9f3e3c2e6f1', title: 'Student Motivation Boost', tag: 'Motivation' },
]

const sounds = [
  { id: 'rain', title: 'Gentle Rain', url: 'https://cdn.pixabay.com/download/audio/2023/02/28/audio_2d2a0aa9c9.mp3?filename=gentle-rain-139481.mp3' },
  { id: 'piano', title: 'Soft Piano', url: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_1c8e3a3f33.mp3?filename=calm-piano-ambient-110058.mp3' },
]

const sleepTips = [
  'Keep a consistent sleep schedule (same time daily).',
  'Limit screens 60 minutes before bed.',
  'Avoid caffeine after 3 PM; hydrate with water or herbal tea.',
  'Keep room cool, dark, and quiet; consider earplugs or eye mask.',
  'If you cannot sleep in 20 minutes, get up and do a calm activity.'
]

export function SelfHelp() {
  const [activeVideo, setActiveVideo] = useState(null)
  const [mood, setMood] = useState(() => Number(localStorage.getItem('mood') || 5))
  const [filter, setFilter] = useState('All')
  const [reminders, setReminders] = useState(() => {
    try { return JSON.parse(localStorage.getItem('reminders') || '[]') } catch { return [] }
  })
  const [remNote, setRemNote] = useState('')
  const [remTime, setRemTime] = useState('')

  useEffect(()=>{ localStorage.setItem('mood', String(mood)) }, [mood])
  useEffect(()=>{ localStorage.setItem('reminders', JSON.stringify(reminders)) }, [reminders])

  const upcoming = useMemo(()=> reminders
    .map(r=>({ ...r, ts: new Date(r.when).getTime() }))
    .filter(r=> r.ts >= Date.now())
    .sort((a,b)=> a.ts-b.ts)[0]
  , [reminders])

  function addReminder(){
    if (!remTime || !remNote) return
    setReminders(list => [...list, { id: Date.now(), when: remTime, note: remNote }])
    setRemNote(''); setRemTime('')
  }

  return (
    <div className="grid" style={{gap:24}}>
      {/* Videos */}
      <section className="card">
        <h2>Self Help Library</h2>
        <div style={{display:'flex', gap:8, alignItems:'center', marginBottom:8}}>
          <label>Filter</label>
          <select value={filter} onChange={e=>setFilter(e.target.value)} style={{maxWidth:200}}>
            {['All','Meditation','Exercise','Motivation'].map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
        <div className="grid grid-3">
          {videos.filter(v=> filter==='All' || v.tag===filter).map(v => (
            <div key={v.id} className="card">
              <h4>{v.title}</h4>
              <p className="pill">{v.tag}</p>
              <button className="btn" onClick={()=>setActiveVideo(v)}>Open</button>
            </div>
          ))}
        </div>
      </section>

      {activeVideo && (
        <div className="modal-backdrop" onClick={()=>setActiveVideo(null)}>
          <div className="card modal" onClick={e=>e.stopPropagation()}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
              <h3 style={{margin:0}}>{activeVideo.title}</h3>
              <button className="btn" onClick={()=>setActiveVideo(null)}>Close</button>
            </div>
            <div style={{marginTop:12, position:'relative', paddingTop:'56.25%'}}>
              {activeVideo.mp4 ? (
                <video
                  controls
                  playsInline
                  style={{position:'absolute', inset:0, width:'100%', height:'100%', border:'0', borderRadius:'12px', background:'#000'}}
                >
                  <source src={activeVideo.mp4} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <iframe
                  title={activeVideo.title}
                  src={`https://www.youtube-nocookie.com/embed/${activeVideo.yt}?rel=0&modestbranding=1&controls=1&iv_load_policy=3&playsinline=1`}
                  style={{position:'absolute', inset:0, width:'100%', height:'100%', border:'0', borderRadius:'12px'}}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Guided exercise: short meditation */}
      <section className="card">
        <h3>Quick Meditation (3 min)</h3>
        <ol>
          <li>Inhale slowly through the nose for 4 seconds.</li>
          <li>Hold for 4 seconds.</li>
          <li>Exhale gently through the mouth for 6 seconds.</li>
          <li>Repeat for 10 breaths.</li>
        </ol>
        <button className="btn" onClick={()=>alert('Set a 3 min timer on your phone and start gentle breathing.')}>
          Start 3‑minute session
        </button>
      </section>

      {/* Calming sounds */}
      <section className="card">
        <h3>Calming Sounds</h3>
        <div className="grid grid-2">
          {sounds.map(s => (
            <div key={s.id} className="card">
              <h4>{s.title}</h4>
              <audio controls src={s.url} style={{width:'100%'}} />
            </div>
          ))}
        </div>
      </section>

      {/* Sleep hygiene */}
      <section className="card">
        <h3>Sleep Hygiene Basics</h3>
        <ul>
          {sleepTips.map((t,i)=>(<li key={i}>{t}</li>))}
        </ul>
      </section>

      {/* Mood tracker */}
      <section className="card">
        <h3>Mood Tracker</h3>
        <label>How do you feel today? {mood}/10</label>
        <input type="range" min="0" max="10" value={mood} onChange={e=>setMood(Number(e.target.value))} />
        <div style={{marginTop:8}}>
          <button className="btn" onClick={()=>{
            const logs = JSON.parse(localStorage.getItem('moodLogs')||'[]')
            logs.push({ ts: Date.now(), mood })
            localStorage.setItem('moodLogs', JSON.stringify(logs))
            alert('Saved today\'s mood')
          }}>Save today</button>
        </div>
      </section>

      {/* Counselor reminders (placeholder, stored locally) */}
      <section className="card">
        <h3>Reminders from Counselor</h3>
        <p className="pill">Local demo – integrate backend later</p>
        <div className="grid grid-2">
          <div className="card">
            <label>When</label>
            <input type="datetime-local" value={remTime} onChange={e=>setRemTime(e.target.value)} />
            <label>Note</label>
            <input type="text" placeholder="E.g., Breathing at 7 PM" value={remNote} onChange={e=>setRemNote(e.target.value)} />
            <div style={{marginTop:8}}><button className="btn" onClick={addReminder}>Add reminder</button></div>
          </div>
          <div className="card">
            <h4>Upcoming</h4>
            {upcoming ? (
              <p>
                {new Date(upcoming.when).toLocaleString()} – {upcoming.note}
              </p>
            ) : (
              <p>No upcoming reminders</p>
            )}
            <h4>All</h4>
            <ul>
              {reminders.map(r=> (
                <li key={r.id}>{new Date(r.when).toLocaleString()} – {r.note}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}


