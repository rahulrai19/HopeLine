import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useMood } from '../../context/MoodContext.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import styles from './StudentLanding.module.scss'
import dashboardStyles from './StudentDashboard.module.scss'
import { ProfileDropdown } from '../../components/layout/ProfileDropdown.jsx'
import { NavbarChat } from '../../components/chatbot/NavbarChat.jsx'

export function StudentLanding() {
  const { currentMood, emotions, updateMood, personalizedContent, isLoading, getMoodInsights } = useMood()
  const { user, studentLoggedIn, adminLoggedIn } = useAuth()
  const [showInsights, setShowInsights] = useState(false)
  const [animationKey, setAnimationKey] = useState(0)
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light')

  const insights = getMoodInsights()

  // Theme logic
  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') root.setAttribute('data-theme', 'dark')
    else root.removeAttribute('data-theme')
    localStorage.setItem('theme', theme)
  }, [theme])

  function toggleTheme() {
    setTheme(t => t === 'light' ? 'dark' : 'light')
  }

  const themeIcon = theme === 'dark' ? '🌙' : '☀️'

  // Update animation when mood changes
  useEffect(() => {
    setAnimationKey(prev => prev + 1)
  }, [currentMood])

  const handleEmotionSelect = async (emotionId) => {
    await updateMood(emotionId, 'User selected emotion on landing page')
  }

  const getDynamicGreeting = () => {
    const name = user?.fullName || user?.name || 'Student'
    if (studentLoggedIn) return `Welcome back, ${name}! How are you feeling today?`
    if (adminLoggedIn) return `Admin Dashboard - System Overview`
    return "Find Peace of Mind"
  }

  const getDynamicDescription = () => {
    if (personalizedContent) {
      return personalizedContent.message
    }
    if (studentLoggedIn) {
      return "Continue your mental health journey with personalized support and resources."
    }
    return "Experience a new way of emotional support. Our AI companion is here to listen, understand, and guide you through life's journey."
  }

  return (
    <div className={styles.hero}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.logo}>
          <img src="/logo.png" alt="HopeLine Logo" className={styles.logoImage} />
          <div>
            <div className={styles.brand}>HopeLine</div>
            <div className={styles.tagline}>Your mental health Companion</div>
          </div>
        </div>
        <nav className={styles.nav}>
          {!studentLoggedIn && (
            <>
              <a href="#features" className={styles.navLink}>Features</a>
              <a href="#about" className={styles.navLink}>About HopeLine</a>
            </>
          )}
          <a href={studentLoggedIn ? "/student/support" : "#support"} className={styles.navLink}>Student Support</a>
          <button className={styles.moonIcon} onClick={toggleTheme} aria-label="Toggle theme" title={`Theme: ${theme}`}>
            {themeIcon}
          </button>
          {studentLoggedIn ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <NavbarChat />
              <ProfileDropdown />
            </div>
          ) : (
            <Link to="/login?role=admin" className={styles.signInBtn}>Sign In</Link>
          )}
        </nav>
      </header>

      {/* Main Content */}
      <main className={styles.mainContent}>
        {/* Hero Section */}
        <section className={styles.heroSection}>
          <div className={styles.heroLeft}>
            {/* Badge */}
            <div className={styles.badge}>
              <div className={styles.waveIcon}>🌊</div>
              <span>Your AI Agent Mental Health Companion</span>
            </div>

            {/* Main Headline */}
            <h1 className={styles.headline} key={animationKey}>
              <span className={styles.highlight}>{getDynamicGreeting()}</span>
            </h1>

            {/* Description */}
            <p className={styles.description}>
              {getDynamicDescription()}
            </p>

            {/* Personalized Content */}
            {personalizedContent && (
              <div className={styles.personalizedContent}>
                <div className={styles.activityCard}>
                  <div className={styles.activityIcon}>💡</div>
                  <span>{personalizedContent.activity}</span>
                </div>
                <div className={styles.quoteCard}>
                  <div className={styles.quoteIcon}>💭</div>
                  <span>"{personalizedContent.quote}"</span>
                </div>
              </div>
            )}

            {/* CTA Buttons */}
            <div className={styles.ctaButtons}>
              {studentLoggedIn ? (
                <Link to="/student/dashboard" className={styles.primaryBtn}>
                  Continue Journey
                </Link>
              ) : (
                <div className={styles.authButtons}>
                  <Link to="/login?role=student" className={styles.primaryBtn}>
                    Sign In
                  </Link>
                  <Link to="/signup" className={styles.signupBtn}>
                    Create Account
                  </Link>
                </div>
              )}
              {adminLoggedIn ? (
                <Link to="/admin/dashboard" className={styles.secondaryBtn}>
                  Admin Dashboard
                </Link>
              ) : (
                <Link to="/login?role=admin" className={styles.secondaryBtn}>
                  Admin Access
                </Link>
              )}
            </div>
          </div>

          <div className={styles.heroRight}>
            {/* Emotion Selector */}
            <div className={styles.emotionSection}>
              <p className={styles.emotionPrompt}>Whatever you're feeling, we're here to listen</p>
              <div className={styles.emotionGrid}>
                {emotions.map(emotion => (
                  <button
                    key={emotion.id}
                    className={`${styles.emotionBtn} ${currentMood === emotion.id ? styles.active : ''}`}
                    onClick={() => handleEmotionSelect(emotion.id)}
                    disabled={isLoading}
                    style={{
                      '--emotion-color': emotion.color,
                      opacity: isLoading ? 0.7 : 1
                    }}
                  >
                    <div className={styles.emotionEmoji}>{emotion.emoji}</div>
                    <div className={styles.emotionLabel}>{emotion.label}</div>
                    {isLoading && currentMood === emotion.id && (
                      <div className={styles.loadingSpinner}></div>
                    )}
                  </button>
                ))}
              </div>
              
              {/* Slider */}
              <div className={styles.sliderContainer}>
                <div className={styles.sliderTrack}>
                  <div 
                    className={styles.sliderThumb}
                    style={{
                      left: `${emotions.findIndex(e => e.id === currentMood) * 25}%`,
                      backgroundColor: emotions.find(e => e.id === currentMood)?.color
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {studentLoggedIn ? (
          <div className={dashboardStyles.grid} style={{ marginTop: '20px' }}>
            <section className={dashboardStyles.card}>
              <div className={dashboardStyles.cardHeader}>
                <h3>Quick Actions</h3>
                <div className={dashboardStyles.cardIcon}>⚡</div>
              </div>
              <div className={dashboardStyles.actionGrid}>
                <Link to="/student/support" className={dashboardStyles.actionBtn}>
                  <div className={dashboardStyles.actionIcon}>🤝</div>
                  <div>
                    <div className={dashboardStyles.actionTitle}>Choose Support</div>
                    <div className={dashboardStyles.actionDesc}>Get help now</div>
                  </div>
                </Link>
                <Link to="/student/assessment" className={dashboardStyles.actionBtn}>
                  <div className={dashboardStyles.actionIcon}>📊</div>
                  <div>
                    <div className={dashboardStyles.actionTitle}>Take Assessment</div>
                    <div className={dashboardStyles.actionDesc}>Check your mood</div>
                  </div>
                </Link>
                <Link to="/student/crisis" className={dashboardStyles.crisisBtn}>
                  <div className={dashboardStyles.actionIcon}>🚨</div>
                  <div>
                    <div className={dashboardStyles.actionTitle}>Crisis Alert</div>
                    <div className={dashboardStyles.actionDesc}>Emergency support</div>
                  </div>
                </Link>
              </div>
            </section>

            <section className={dashboardStyles.card}>
              <div className={dashboardStyles.cardHeader}>
                <h3>Recent Resources</h3>
                <div className={dashboardStyles.cardIcon}>📚</div>
              </div>
              <div className={dashboardStyles.resourceList}>
                <div className={dashboardStyles.resourceItem}>
                  <div className={dashboardStyles.resourceIcon}>🧘</div>
                  <div className={dashboardStyles.resourceContent}>
                    <div className={dashboardStyles.resourceTitle}>Mindful Breathing</div>
                    <div className={dashboardStyles.resourceDesc}>5-minute guided session</div>
                  </div>
                  <Link to="/student/self-help" className={dashboardStyles.resourceLink}>Start</Link>
                </div>
                <div className={dashboardStyles.resourceItem}>
                  <div className={dashboardStyles.resourceIcon}>🎵</div>
                  <div className={dashboardStyles.resourceContent}>
                    <div className={dashboardStyles.resourceTitle}>De-stress Playlist</div>
                    <div className={dashboardStyles.resourceDesc}>Calming music collection</div>
                  </div>
                  <Link to="/student/self-help" className={dashboardStyles.resourceLink}>Listen</Link>
                </div>
                <div className={dashboardStyles.resourceItem}>
                  <div className={dashboardStyles.resourceIcon}>📖</div>
                  <div className={dashboardStyles.resourceContent}>
                    <div className={dashboardStyles.resourceTitle}>Daily Journal</div>
                    <div className={dashboardStyles.resourceDesc}>Reflect on your day</div>
                  </div>
                  <Link to="/student/self-help" className={dashboardStyles.resourceLink}>Write</Link>
                </div>
              </div>
            </section>

            <section className={dashboardStyles.card}>
              <div className={dashboardStyles.cardHeader}>
                <h3>Your Progress</h3>
                <div className={dashboardStyles.cardIcon}>📈</div>
              </div>
              <div className={dashboardStyles.progressStats}>
                <div className={dashboardStyles.progressItem}>
                  <div className={dashboardStyles.progressNumber}>7</div>
                  <div className={dashboardStyles.progressLabel}>Days Active</div>
                </div>
                <div className={dashboardStyles.progressItem}>
                  <div className={dashboardStyles.progressNumber}>3</div>
                  <div className={dashboardStyles.progressLabel}>Sessions Completed</div>
                </div>
                <div className={dashboardStyles.progressItem}>
                  <div className={dashboardStyles.progressNumber}>85%</div>
                  <div className={dashboardStyles.progressLabel}>Wellness Score</div>
                </div>
              </div>
            </section>
          </div>
        ) : (
          <>
            {/* Features & About Combined Section */}
            <section id="features" className={styles.infoSection}>
              <div className={styles.infoGrid}>
                {/* Features */}
                <div className={styles.featuresCard}>
                  <h2 className={styles.cardTitle}>Why Choose HopeLine?</h2>
                  <div className={styles.featuresList}>
                    <div className={styles.featureItem}>
                      <div className={styles.featureIcon}>🤖</div>
                      <div>
                        <h4>AI-Powered Support</h4>
                        <p>24/7 intelligent companion</p>
                      </div>
                    </div>
                    <div className={styles.featureItem}>
                      <div className={styles.featureIcon}>👥</div>
                      <div>
                        <h4>Peer Support</h4>
                        <p>Connect with fellow students</p>
                      </div>
                    </div>
                    <div className={styles.featureItem}>
                      <div className={styles.featureIcon}>👨‍⚕️</div>
                      <div>
                        <h4>Professional Counselors</h4>
                        <p>Licensed mental health professionals</p>
                      </div>
                    </div>
                    <div className={styles.featureItem}>
                      <div className={styles.featureIcon}>📊</div>
                      <div>
                        <h4>Mood Tracking</h4>
                        <p>Monitor your emotional patterns</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* About */}
                <div id="about" className={styles.aboutCard}>
                  <h2 className={styles.cardTitle}>About HopeLine</h2>
                  <p className={styles.aboutText}>
                    A comprehensive digital mental health platform designed specifically for university students. 
                    We understand the unique challenges you face and provide accessible, effective support.
                  </p>
                  <div className={styles.stats}>
                    <div className={styles.stat}>
                      <div className={styles.statNumber}>10K+</div>
                      <div className={styles.statLabel}>Students Helped</div>
                    </div>
                    <div className={styles.stat}>
                      <div className={styles.statNumber}>24/7</div>
                      <div className={styles.statLabel}>Support Available</div>
                    </div>
                    <div className={styles.stat}>
                      <div className={styles.statNumber}>95%</div>
                      <div className={styles.statLabel}>Satisfaction Rate</div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Support Options */}
            <section id="support" className={styles.supportSection}>
              <h2 className={styles.sectionTitle}>Student Support Options</h2>
              <div className={styles.supportGrid}>
                <div className={styles.supportCard}>
                  <div className={styles.supportIcon}>🤖</div>
                  <h3>AI Companion</h3>
                  <p>Chat with our intelligent AI for 24/7 support</p>
                  <Link to="/student/peer" className={styles.supportBtn}>Start Chatting</Link>
                </div>

                <div className={styles.supportCard}>
                  <div className={styles.supportIcon}>👥</div>
                  <h3>Peer Support</h3>
                  <p>Connect with fellow students who understand</p>
                  <Link to="/student/peer" className={styles.supportBtn}>Join Community</Link>
                </div>

                <div className={styles.supportCard}>
                  <div className={styles.supportIcon}>👨‍⚕️</div>
                  <h3>Professional Counseling</h3>
                  <p>Book sessions with licensed professionals</p>
                  <Link to="/student/counselor" className={styles.supportBtn}>Book Session</Link>
                </div>

                <div className={styles.supportCard}>
                  <div className={styles.supportIcon}>📚</div>
                  <h3>Self-Help Resources</h3>
                  <p>Access mental health resources and exercises</p>
                  <Link to="/student/self-help" className={styles.supportBtn}>Explore Resources</Link>
                </div>
              </div>
            </section>
          </>
        )}

        {/* Mood Insights - Only for logged in students */}
        {insights && studentLoggedIn && (
          <section className={styles.insightsSection}>
            <h2 className={styles.sectionTitle}>Your Mood Insights</h2>
            <div className={styles.insightsCard}>
              <div className={styles.insightsContent}>
                <div className={styles.insightItem}>
                  <span className={styles.insightLabel}>Recent Trend:</span>
                  <span className={styles.insightValue}>{insights.trend.replace('_', ' ')}</span>
                </div>
                <div className={styles.insightItem}>
                  <span className={styles.insightLabel}>Most Common:</span>
                  <span className={styles.insightValue}>{insights.dominantMood}</span>
                </div>
              </div>
              <div className={styles.moodChart}>
                {Object.entries(insights.moodCounts).map(([mood, count]) => (
                  <div key={mood} className={styles.moodBar}>
                    <span>{emotions.find(e => e.id === mood)?.emoji}</span>
                    <div 
                      className={styles.bar}
                      style={{ 
                        width: `${(count / Math.max(...Object.values(insights.moodCounts))) * 100}%`,
                        backgroundColor: emotions.find(e => e.id === mood)?.color
                      }}
                    />
                    <span>{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerBrand}>
            <div className={styles.footerLogo}>
              <div className={styles.footerLogoIcon}>💚</div>
              <span>HopeLine</span>
            </div>
            <p>Your mental health companion for university life</p>
          </div>
          <div className={styles.footerLinks}>
            <div className={styles.footerColumn}>
              <h4>Support</h4>
              <a href="#features">Features</a>
              <a href="#about">About</a>
              <a href="#support">Student Support</a>
            </div>
            <div className={styles.footerColumn}>
              <h4>Resources</h4>
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
              <a href="#">Help Center</a>
            </div>
            <div className={styles.footerColumn}>
              <h4>Contact</h4>
              <a href="#">support@hopeline.edu</a>
              <a href="#">crisis@hopeline.edu</a>
              <a href="#">+1 (800) 123-4567</a>
            </div>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p>&copy; 2024 HopeLine. All rights reserved. Your mental health matters.</p>
        </div>
      </footer>
    </div>
  )
}