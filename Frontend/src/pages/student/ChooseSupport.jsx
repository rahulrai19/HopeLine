import { Link } from 'react-router-dom'
import styles from './ChooseSupport.module.scss'

export function ChooseSupport() {
  return (
    <div className={styles.support}>
      <div className={styles.header}>
        <h1 className={styles.title}>Choose Your Support</h1>
        <p className={styles.subtitle}>Select the type of support that works best for you</p>
      </div>
      
      <div className={styles.supportGrid}>
        <div className={styles.supportCard}>
          <div className={styles.cardIcon}>🤖</div>
          <h3 className={styles.cardTitle}>AI Companion</h3>
          <p className={styles.cardDescription}>
            Chat with our intelligent AI that understands your emotions and provides 24/7 support
          </p>
          <div className={styles.cardFeatures}>
            <span className={styles.feature}>Instant support</span>
            <span className={styles.feature}>Always available</span>
            <span className={styles.feature}>Multilingual</span>
          </div>
          <Link to="/student/peer" className={styles.cardBtn}>
            Start Chatting
          </Link>
        </div>

        <div className={styles.supportCard}>
          <div className={styles.cardIcon}>👥</div>
          <h3 className={styles.cardTitle}>Peer Support</h3>
          <p className={styles.cardDescription}>
            Connect with fellow students who understand your struggles and can offer genuine support
          </p>
          <div className={styles.cardFeatures}>
            <span className={styles.feature}>Anonymous chat</span>
            <span className={styles.feature}>Group sessions</span>
            <span className={styles.feature}>Community</span>
          </div>
          <Link to="/student/peer" className={styles.cardBtn}>
            Join Community
          </Link>
        </div>

        <div className={styles.supportCard}>
          <div className={styles.cardIcon}>👨‍⚕️</div>
          <h3 className={styles.cardTitle}>Professional Counseling</h3>
          <p className={styles.cardDescription}>
            Book sessions with licensed mental health professionals for personalized therapy
          </p>
          <div className={styles.cardFeatures}>
            <span className={styles.feature}>Licensed counselors</span>
            <span className={styles.feature}>Flexible scheduling</span>
            <span className={styles.feature}>Confidential</span>
          </div>
          <Link to="/student/counselor" className={styles.cardBtn}>
            Book Session
          </Link>
        </div>

        <div className={styles.supportCard}>
          <div className={styles.cardIcon}>📚</div>
          <h3 className={styles.cardTitle}>Self-Help Resources</h3>
          <p className={styles.cardDescription}>
            Access a library of mental health resources, exercises, and educational content
          </p>
          <div className={styles.cardFeatures}>
            <span className={styles.feature}>Guided exercises</span>
            <span className={styles.feature}>Articles & videos</span>
            <span className={styles.feature}>Meditation</span>
          </div>
          <Link to="/student/self-help" className={styles.cardBtn}>
            Explore Resources
          </Link>
        </div>

        <div className={styles.supportCard}>
          <div className={styles.cardIcon}>📊</div>
          <h3 className={styles.cardTitle}>Mood Assessment</h3>
          <p className={styles.cardDescription}>
            Take a quick assessment to understand your current mental health status
          </p>
          <div className={styles.cardFeatures}>
            <span className={styles.feature}>PHQ-9 & GAD-7</span>
            <span className={styles.feature}>Instant results</span>
            <span className={styles.feature}>Progress tracking</span>
          </div>
          <Link to="/student/assessment" className={styles.cardBtn}>
            Take Assessment
          </Link>
        </div>

        <div className={styles.supportCard}>
          <div className={styles.cardIcon}>🚨</div>
          <h3 className={styles.cardTitle}>Crisis Support</h3>
          <p className={styles.cardDescription}>
            Immediate help and emergency resources when you need them most
          </p>
          <div className={styles.cardFeatures}>
            <span className={styles.feature}>24/7 hotline</span>
            <span className={styles.feature}>Emergency contacts</span>
            <span className={styles.feature}>Crisis resources</span>
          </div>
          <Link to="/student/crisis" className={styles.crisisBtn}>
            Get Help Now
          </Link>
        </div>
      </div>
    </div>
  )
}


