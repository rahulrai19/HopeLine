import { useEffect, useMemo, useState } from 'react'
import styles from './SelfHelp.module.scss'

const TABS = ['Videos', 'Sounds', 'Exercises', 'Sleep', 'Reminders']

const videos = [
  { id: 'breath5', yt: 'inpok4MKVLM', title: 'Mindful Breathing', desc: '5-min guided session', tag: 'Meditation' },
  { id: 'ground321', yt: 'tEmt1Znux58', title: 'Grounding Exercise (3-2-1)', desc: 'Calm anxiety fast', tag: 'Exercise' },
  { id: 'motivation', mp4: 'https://cdn.pixabay.com/vimeo/147015082/bird-1860.mp4?width=1280&hash=a0b3f0ed9d9f3e3c2e6f1', title: 'Student Motivation Boost', desc: 'Uplifting video', tag: 'Motivation' },
]

const sounds = [
  { id: 'rain', title: 'Rain and Thunder', icon: '🌧️', url: '/audio/Rain-and-Thunder(chosic.com).mp3' },
  { id: 'ambient', title: 'Deep Ambient', icon: '🌌', url: '/audio/leberch-ambient-deep-375261.mp3' },
  { id: 'focus', title: 'Deep Concentration', icon: '🧠', url: '/audio/leberch-deep-concentration-263073.mp3' },
  { id: 'beauty', title: 'Beauty', icon: '✨', url: '/audio/Beauty(chosic.com).mp3' },
  { id: 'memories', title: 'Precious Memories', icon: '💭', url: '/audio/precious-memories(chosic.com).mp3' },
  { id: 'mountain', title: 'Inspiring Mountain', icon: '🏔️', url: '/audio/the_mountain-inspiring-focus-137045.mp3' },
  { id: 'orangery', title: 'Orangery Rose', icon: '🌹', url: '/audio/orangery-rose-141246.mp3' },
]

const sleepTips = [
  { icon: '🕐', tip: 'Keep a consistent sleep schedule — same time every day, even weekends.' },
  { icon: '📱', tip: 'Limit screens 60 minutes before bed. Blue light disrupts melatonin production.' },
  { icon: '☕', tip: 'Avoid caffeine after 3 PM. Stay hydrated with water or herbal tea.' },
  { icon: '🌡️', tip: 'Keep your room cool (18–20°C), dark, and quiet.' },
  { icon: '📖', tip: 'If you can\'t sleep in 20 minutes, get up and do a calm activity until sleepy.' },
]

const exercises = [
  { title: 'Box Breathing', steps: ['Inhale for 4 seconds', 'Hold for 4 seconds', 'Exhale for 4 seconds', 'Hold for 4 seconds', 'Repeat 8 times'], icon: '🫁', color: '#0d9488' },
  { title: '5-4-3-2-1 Grounding', steps: ['Name 5 things you SEE', 'Name 4 things you TOUCH', 'Name 3 things you HEAR', 'Name 2 things you SMELL', 'Name 1 thing you TASTE'], icon: '🌿', color: '#10b981' },
  { title: 'Progressive Muscle Relaxation', steps: ['Tense feet for 5 sec, then release', 'Tense calves for 5 sec, then release', 'Tense thighs for 5 sec, then release', 'Tense stomach for 5 sec, then release', 'Tense shoulders and release — feel calm'], icon: '🧘', color: '#6d28d9' },
]

export function SelfHelp() {
  const [tab, setTab] = useState('Videos')
  const [activeVideo, setActiveVideo] = useState(null)
  const [filter, setFilter] = useState('All')
  const [reminders, setReminders] = useState(() => {
    try { return JSON.parse(localStorage.getItem('selfhelp_reminders') || '[]') } catch { return [] }
  })
  const [remNote, setRemNote] = useState('')
  const [remTime, setRemTime] = useState('')

  useEffect(() => { localStorage.setItem('selfhelp_reminders', JSON.stringify(reminders)) }, [reminders])

  const filteredVideos = videos.filter(v => filter === 'All' || v.tag === filter)

  function addReminder() {
    if (!remTime || !remNote) return
    setReminders(l => [...l, { id: Date.now(), when: remTime, note: remNote }])
    setRemNote(''); setRemTime('')
  }

  return (
    <div className={styles.page}>
      {/* Tabs */}
      <div className={styles.tabBar}>
        {TABS.map(t => (
          <button
            key={t}
            className={`${styles.tab} ${tab === t ? styles.tabActive : ''}`}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
      </div>

      {/* ── Videos ── */}
      {tab === 'Videos' && (
        <div className={styles.section}>
          <div className={styles.filterRow}>
            {['All', 'Meditation', 'Exercise', 'Motivation'].map(f => (
              <button
                key={f}
                className={`${styles.chip} ${filter === f ? styles.chipActive : ''}`}
                onClick={() => setFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
          <div className={styles.videoGrid}>
            {filteredVideos.map(v => (
              <div key={v.id} className={styles.videoCard}>
                <div className={styles.videoThumb} onClick={() => setActiveVideo(v)}>
                  {v.yt ? (
                    <img src={`https://img.youtube.com/vi/${v.yt}/mqdefault.jpg`} alt={v.title} />
                  ) : (
                    <div className={styles.videoThumbBlank}>🎬</div>
                  )}
                  <div className={styles.playBtn}>▶</div>
                </div>
                <div className={styles.videoInfo}>
                  <span className={styles.videoTag}>{v.tag}</span>
                  <h4 className={styles.videoTitle}>{v.title}</h4>
                  <p className={styles.videoDesc}>{v.desc}</p>
                  <button className="btn primary sm" onClick={() => setActiveVideo(v)}>Watch</button>
                </div>
              </div>
            ))}
          </div>

          {/* Video modal */}
          {activeVideo && (
            <div className="modal-backdrop" onClick={() => setActiveVideo(null)}>
              <div className="modal-box" onClick={e => e.stopPropagation()}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                  <h3 style={{ margin: 0 }}>{activeVideo.title}</h3>
                  <button className="btn ghost sm" onClick={() => setActiveVideo(null)}>✕</button>
                </div>
                <div style={{ position: 'relative', paddingTop: '56.25%', borderRadius: 12, overflow: 'hidden' }}>
                  {activeVideo.mp4 ? (
                    <video controls playsInline style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
                      <source src={activeVideo.mp4} type="video/mp4" />
                    </video>
                  ) : (
                    <iframe
                      title={activeVideo.title}
                      src={`https://www.youtube-nocookie.com/embed/${activeVideo.yt}?autoplay=1&rel=0&modestbranding=1`}
                      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Sounds ── */}
      {tab === 'Sounds' && (
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Calming Sound Library</h3>
          <div className={styles.soundGrid}>
            {sounds.map(s => (
              <div key={s.id} className={styles.soundCard}>
                <div className={styles.soundIcon}>{s.icon}</div>
                <h4 className={styles.soundTitle}>{s.title}</h4>
                {s.url ? (
                  <audio controls src={s.url} className={styles.audio} />
                ) : (
                  <p className={styles.comingSoon}>Coming soon</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Exercises ── */}
      {tab === 'Exercises' && (
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Guided Mental Health Exercises</h3>
          <div className={styles.exerciseGrid}>
            {exercises.map((ex, i) => (
              <div key={i} className={styles.exerciseCard} style={{ '--ec': ex.color }}>
                <div className={styles.exerciseIcon}>{ex.icon}</div>
                <h4 className={styles.exerciseTitle}>{ex.title}</h4>
                <ol className={styles.stepList}>
                  {ex.steps.map((s, j) => <li key={j}>{s}</li>)}
                </ol>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Sleep ── */}
      {tab === 'Sleep' && (
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Sleep Hygiene Guide</h3>
          <div className={styles.sleepGrid}>
            {sleepTips.map((t, i) => (
              <div key={i} className={styles.sleepTip}>
                <div className={styles.sleepIcon}>{t.icon}</div>
                <p>{t.tip}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Reminders ── */}
      {tab === 'Reminders' && (
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Self-Care Reminders</h3>
          <div className={styles.reminderLayout}>
            <div className={styles.reminderForm}>
              <h4>Add Reminder</h4>
              <div className="form-group">
                <label>Note</label>
                <input placeholder="e.g., Deep breathing session" value={remNote} onChange={e => setRemNote(e.target.value)} />
              </div>
              <div className="form-group">
                <label>When</label>
                <input type="datetime-local" value={remTime} onChange={e => setRemTime(e.target.value)} />
              </div>
              <button className="btn primary" onClick={addReminder}>Add Reminder</button>
            </div>

            <div className={styles.reminderList}>
              <h4>Your Reminders</h4>
              {reminders.length === 0 ? (
                <p style={{ color: 'var(--muted)', fontSize: 14 }}>No reminders yet.</p>
              ) : (
                reminders
                  .sort((a, b) => new Date(a.when) - new Date(b.when))
                  .map(r => (
                    <div key={r.id} className={styles.reminderItem}>
                      <span>🔔</span>
                      <div>
                        <div className={styles.reminderNote}>{r.note}</div>
                        <div className={styles.reminderTime}>{new Date(r.when).toLocaleString()}</div>
                      </div>
                      <button className="btn ghost sm" onClick={() => setReminders(l => l.filter(x => x.id !== r.id))}>✕</button>
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
