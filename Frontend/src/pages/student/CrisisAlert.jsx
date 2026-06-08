import { Link } from 'react-router-dom'
import styles from './CrisisAlert.module.scss'

const hotlines = [
  { name: 'iCall (India)', number: '9152987821', flag: '🇮🇳' },
  { name: 'Vandrevala Foundation', number: '1860-2662-345', flag: '🇮🇳' },
  { name: 'National Helpline', number: '1800-599-0019', flag: '🇮🇳' },
  { name: 'Campus Security', number: '+91 12345 67890', flag: '🏫' },
]

export function CrisisAlert() {
  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.alertRing}>
          <span className={styles.alertIcon}>🆘</span>
        </div>

        <h1 className={styles.title}>You Are Not Alone</h1>
        <p className={styles.desc}>
          If you're in immediate danger or experiencing a mental health crisis, please reach out now.
          Help is available 24/7 — it takes courage to ask, and we're proud of you for being here.
        </p>

        <div className={styles.hotlines}>
          {hotlines.map((h, i) => (
            <a key={i} href={`tel:${h.number.replace(/[^0-9+]/g, '')}`} className={styles.hotlineCard}>
              <span className={styles.hotlineFlag}>{h.flag}</span>
              <div className={styles.hotlineInfo}>
                <div className={styles.hotlineName}>{h.name}</div>
                <div className={styles.hotlineNum}>{h.number}</div>
              </div>
              <span className={styles.callIcon}>📞</span>
            </a>
          ))}
        </div>

        <div className={styles.actions}>
          <a href="tel:18005990019" className={styles.callBtn}>
            📞 Call Helpline Now
          </a>
          <Link to="/student/support" className="btn ghost">
            Back to Support Options
          </Link>
        </div>

        <div className={styles.calmTips}>
          <h4>While you wait — try this:</h4>
          <div className={styles.tipList}>
            <div className={styles.tip}>🫁 Take 5 slow, deep breaths</div>
            <div className={styles.tip}>👀 Name 5 things you can see right now</div>
            <div className={styles.tip}>🤚 Place your hand on your heart and feel it beating</div>
          </div>
        </div>
      </div>
    </div>
  )
}
