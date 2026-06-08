import { useEffect, useMemo, useState } from 'react'
import styles from './Assessment.module.scss'

const phqQuestions = [
  'Little interest or pleasure in doing things',
  'Feeling down, depressed, or hopeless',
  'Trouble falling or staying asleep, or sleeping too much',
  'Feeling tired or having little energy',
  'Poor appetite or overeating',
  'Feeling bad about yourself — or that you are a failure or have let yourself down',
  'Trouble concentrating on things, such as reading or watching television',
  'Moving or speaking so slowly that other people could have noticed — or being fidgety or restless',
  'Thoughts that you would be better off dead, or of hurting yourself in some way'
]

const gadQuestions = [
  'Feeling nervous, anxious, or on edge',
  'Not being able to stop or control worrying',
  'Worrying too much about different things',
  'Trouble relaxing',
  'Being so restless that it is hard to sit still',
  'Becoming easily annoyed or irritable',
  'Feeling afraid as if something awful might happen'
]

const OPTIONS = [
  { value: 0, label: 'Not at all', color: '#10b981' },
  { value: 1, label: 'Several days', color: '#f59e0b' },
  { value: 2, label: 'More than half the days', color: '#f97316' },
  { value: 3, label: 'Nearly every day', color: '#ef4444' },
]

function getRisk(score, type) {
  if (type === 'phq') {
    if (score <= 4)  return { label: 'Minimal', color: '#10b981' }
    if (score <= 9)  return { label: 'Mild', color: '#f59e0b' }
    if (score <= 14) return { label: 'Moderate', color: '#f97316' }
    if (score <= 19) return { label: 'Moderately Severe', color: '#ef4444' }
    return { label: 'Severe', color: '#dc2626' }
  } else {
    if (score <= 4)  return { label: 'Minimal', color: '#10b981' }
    if (score <= 9)  return { label: 'Mild', color: '#f59e0b' }
    if (score <= 14) return { label: 'Moderate', color: '#f97316' }
    return { label: 'Severe', color: '#ef4444' }
  }
}

export function Assessment() {
  const [mode, setMode] = useState('both')
  useEffect(() => {
    const opts = ['phq', 'gad', 'both']
    setMode(opts[Math.floor(Math.random() * opts.length)])
  }, [])

  const [phq, setPhq] = useState(Array(phqQuestions.length).fill(null))
  const [gad, setGad] = useState(Array(gadQuestions.length).fill(null))
  const [cursor, setCursor] = useState(0)
  const [submitted, setSubmitted] = useState(false)

  const queue = useMemo(() => {
    const phqQ = phqQuestions.map((q, i) => ({ type: 'phq', text: q, idx: i }))
    const gadQ = gadQuestions.map((q, i) => ({ type: 'gad', text: q, idx: i }))
    if (mode === 'phq') return phqQ
    if (mode === 'gad') return gadQ
    const merged = [...phqQ, ...gadQ]
    for (let i = merged.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [merged[i], merged[j]] = [merged[j], merged[i]]
    }
    return merged
  }, [mode])

  const current = queue[cursor]
  const selectedValue = current ? (current.type === 'phq' ? phq[current.idx] : gad[current.idx]) : null
  const progress = Math.round(((cursor) / queue.length) * 100)
  const allAnswered = queue.every(q => (q.type === 'phq' ? phq[q.idx] : gad[q.idx]) !== null)

  function setAnswer(value) {
    if (current.type === 'phq') {
      setPhq(prev => { const n = [...prev]; n[current.idx] = value; return n })
    } else {
      setGad(prev => { const n = [...prev]; n[current.idx] = value; return n })
    }
  }

  function handleChoice(value) {
    setAnswer(value)
    // Auto-advance after 300ms
    setTimeout(() => {
      if (cursor < queue.length - 1) setCursor(i => i + 1)
    }, 300)
  }

  const scorePhq = phq.reduce((a, b) => a + (b ?? 0), 0)
  const scoreGad = gad.reduce((a, b) => a + (b ?? 0), 0)
  const overall = scorePhq + scoreGad
  const riskHigh = overall >= 20

  if (submitted) {
    return (
      <div className={styles.results}>
        <div className={styles.resultsIcon}>{riskHigh ? '⚠️' : '✅'}</div>
        <h2 className={styles.resultsTitle}>Assessment Complete</h2>
        <p className={styles.resultsDesc}>
          {riskHigh
            ? 'Your responses suggest you may be experiencing significant distress. Please reach out for support.'
            : 'Your responses suggest a lower risk level. Keep practicing self-care!'}
        </p>

        <div className={styles.scoreGrid}>
          {mode !== 'gad' && (
            <div className={styles.scoreCard}>
              <div className={styles.scoreLabel}>PHQ-9 Score</div>
              <div className={styles.scoreNum} style={{ color: getRisk(scorePhq, 'phq').color }}>{scorePhq}</div>
              <div className={styles.scoreBadge} style={{ background: getRisk(scorePhq, 'phq').color }}>
                {getRisk(scorePhq, 'phq').label}
              </div>
            </div>
          )}
          {mode !== 'phq' && (
            <div className={styles.scoreCard}>
              <div className={styles.scoreLabel}>GAD-7 Score</div>
              <div className={styles.scoreNum} style={{ color: getRisk(scoreGad, 'gad').color }}>{scoreGad}</div>
              <div className={styles.scoreBadge} style={{ background: getRisk(scoreGad, 'gad').color }}>
                {getRisk(scoreGad, 'gad').label}
              </div>
            </div>
          )}
        </div>

        <div className={styles.resultsActions}>
          {riskHigh && (
            <a href="/student/crisis" className="btn danger lg">
              🚨 Open Crisis Alert
            </a>
          )}
          <a href="/student/support" className="btn primary lg">
            Get Support Now
          </a>
          <button className="btn ghost" onClick={() => {
            setPhq(Array(phqQuestions.length).fill(null))
            setGad(Array(gadQuestions.length).fill(null))
            setCursor(0)
            setSubmitted(false)
          }}>Retake Assessment</button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      {/* Progress bar */}
      <div className={styles.progressWrap}>
        <div className={styles.progressMeta}>
          <span className={styles.modeLabel}>
            {mode === 'both' ? 'PHQ-9 + GAD-7' : mode === 'phq' ? 'PHQ-9 (Depression)' : 'GAD-7 (Anxiety)'}
          </span>
          <span className={styles.progressText}>{cursor + 1} / {queue.length}</span>
        </div>
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Question card */}
      <div className={styles.questionCard} key={cursor}>
        <div className={styles.questionType}>
          {current?.type === 'phq' ? '🧠 Depression Check' : '😟 Anxiety Check'}
        </div>
        <h2 className={styles.questionText}>{current?.text}</h2>
        <p className={styles.questionHint}>Over the past 2 weeks, how often have you been bothered by this?</p>

        <div className={styles.choiceGrid}>
          {OPTIONS.map(opt => (
            <button
              key={opt.value}
              className={`${styles.choiceBtn} ${selectedValue === opt.value ? styles.choiceSelected : ''}`}
              style={{ '--cc': opt.color }}
              onClick={() => handleChoice(opt.value)}
            >
              <div className={styles.choiceDot} />
              <span className={styles.choiceLabel}>{opt.label}</span>
              <span className={styles.choiceValue}>{opt.value}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Nav buttons */}
      <div className={styles.navBtns}>
        <button className="btn ghost" onClick={() => setCursor(i => Math.max(0, i - 1))} disabled={cursor === 0}>
          ← Previous
        </button>
        <div style={{ flex: 1 }} />
        {cursor < queue.length - 1 ? (
          <button className="btn primary" onClick={() => setCursor(i => i + 1)} disabled={selectedValue === null}>
            Next →
          </button>
        ) : (
          <button className="btn primary" onClick={() => setSubmitted(true)} disabled={!allAnswered}>
            Submit Assessment ✓
          </button>
        )}
      </div>
    </div>
  )
}
