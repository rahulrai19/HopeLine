import { Link } from 'react-router-dom'
import styles from './ChooseSupport.module.scss'

const supports = [
  {
    icon: '🤖', title: 'AI Companion',
    desc: 'Chat with our intelligent AI that understands your emotions and provides 24/7 support.',
    features: ['Instant support', 'Always available', 'Multilingual'],
    btn: 'Start Chatting', to: '/student/peer', grad: 'linear-gradient(135deg,#0d9488,#0f766e)',
  },
  {
    icon: '👥', title: 'Peer Support',
    desc: 'Connect with fellow students who understand your struggles and offer genuine support.',
    features: ['Anonymous chat', 'Community', 'Shared experiences'],
    btn: 'Join Community', to: '/student/peer', grad: 'linear-gradient(135deg,#6d28d9,#4f46e5)',
  },
  {
    icon: '👨‍⚕️', title: 'Professional Counseling',
    desc: 'Book sessions with licensed mental health professionals for personalized therapy.',
    features: ['Licensed counselors', 'Flexible scheduling', 'Confidential'],
    btn: 'Book Session', to: '/student/counselor', grad: 'linear-gradient(135deg,#0ea5e9,#0284c7)',
  },
  {
    icon: '📚', title: 'Self-Help Resources',
    desc: 'Access a curated library of mental health resources, exercises, and educational content.',
    features: ['Guided exercises', 'Articles & videos', 'Meditation'],
    btn: 'Explore Resources', to: '/student/self-help', grad: 'linear-gradient(135deg,#10b981,#059669)',
  },
  {
    icon: '📊', title: 'Mood Assessment',
    desc: 'Take a clinically validated assessment to understand your current mental health status.',
    features: ['PHQ-9 & GAD-7', 'Instant results', 'Progress tracking'],
    btn: 'Take Assessment', to: '/student/assessment', grad: 'linear-gradient(135deg,#f59e0b,#d97706)',
  },
  {
    icon: '🚨', title: 'Crisis Support',
    desc: 'Immediate help and emergency resources when you need them most. You are not alone.',
    features: ['24/7 hotline', 'Emergency contacts', 'Immediate help'],
    btn: 'Get Help Now', to: '/student/crisis', grad: 'linear-gradient(135deg,#ef4444,#dc2626)',
    crisis: true,
  },
]

export function ChooseSupport() {
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>Choose Your Support</h1>
        <p>Select the type of support that works best for you right now</p>
      </div>

      <div className={styles.grid}>
        {supports.map((s, i) => (
          <div key={i} className={`${styles.card} ${s.crisis ? styles.crisisCard : ''}`}>
            <div className={styles.cardTop}>
              <div className={styles.iconWrap} style={{ background: s.grad }}>
                {s.icon}
              </div>
              <h3 className={styles.cardTitle}>{s.title}</h3>
              <p className={styles.cardDesc}>{s.desc}</p>
            </div>

            <div className={styles.features}>
              {s.features.map((f, j) => (
                <span key={j} className={styles.featurePill}>{f}</span>
              ))}
            </div>

            <Link
              to={s.to}
              className={`${styles.cardBtn} ${s.crisis ? styles.crisisBtn : ''}`}
              style={!s.crisis ? { background: s.grad } : {}}
            >
              {s.btn}
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
