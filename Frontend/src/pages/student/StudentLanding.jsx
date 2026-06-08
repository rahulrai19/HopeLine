import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useMood } from '../../context/MoodContext.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { NavbarChat } from '../../components/chatbot/NavbarChat.jsx'
import { ProfileDropdown } from '../../components/layout/ProfileDropdown.jsx'
import styles from './StudentLanding.module.scss'

export function StudentLanding() {
  const { currentMood, emotions, updateMood, personalizedContent, isLoading, getMoodInsights, moodHistory } = useMood()
  const { user, studentLoggedIn, adminLoggedIn } = useAuth()
  const navigate = useNavigate()
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light')
  const [animKey, setAnimKey] = useState(0)
  const insights = getMoodInsights()
  const activeMood = emotions.find(e => e.id === currentMood)

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') root.setAttribute('data-theme', 'dark')
    else root.removeAttribute('data-theme')
    localStorage.setItem('theme', theme)
  }, [theme])

  useEffect(() => { setAnimKey(k => k + 1) }, [currentMood])

  const greeting = () => {
    const name = user?.name || user?.fullName || 'Student'
    if (studentLoggedIn) return `Welcome back, ${name} 👋`
    return 'Find Peace of Mind'
  }

  const description = () => {
    if (personalizedContent) return personalizedContent.message
    if (studentLoggedIn) return 'Continue your mental health journey with personalized AI support and resources.'
    return 'A comprehensive digital mental health platform built for university students. AI-powered, private and available 24/7.'
  }

  return (
    <div className={styles.page}>
      {/* ─── Header ─────────────────────────────────── */}
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link to="/" className={styles.brand}>
            <img src="/logo.png" alt="HopeLine" className={styles.logo} />
            <div>
              <div className={styles.brandName}>HopeLine</div>
              <div className={styles.brandTagline}>Your mental health companion</div>
            </div>
          </Link>

          <nav className={styles.nav}>
            {!studentLoggedIn && (
              <>
                <a href="#features" className={styles.navLink}>Features</a>
                <a href="#support" className={styles.navLink}>Support</a>
                <a href="#about" className={styles.navLink}>About</a>
              </>
            )}
            <button
              className={styles.themeBtn}
              onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}
            >
              {theme === 'dark' ? '🌙' : '☀️'}
            </button>

            {studentLoggedIn ? (
              <div className={styles.userActions}>
                <NavbarChat />
                <ProfileDropdown />
              </div>
            ) : (
              <div className={styles.authBtns}>
                <Link to="/login?role=student" className={styles.signInBtn}>Sign In</Link>
                <Link to="/signup" className={styles.signUpBtn}>Get Started</Link>
              </div>
            )}
          </nav>

          {/* Mobile burger handled separately */}
        </div>
      </header>

      {/* ─── Hero ───────────────────────────────────── */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          {/* Left */}
          <div className={styles.heroLeft}>
            <div className={styles.heroBadge}>
              <span>🌊</span> Your AI Mental Health Companion
            </div>
            <h1 className={styles.heroHeadline} key={animKey}>
              {greeting()}
            </h1>
            <p className={styles.heroDesc}>{description()}</p>

            {personalizedContent && (
              <div className={styles.aiCards}>
                <div className={styles.aiCard}>
                  <span>💡</span> {personalizedContent.activity}
                </div>
                <div className={styles.aiCard}>
                  <span>💭</span> "{personalizedContent.quote}"
                </div>
              </div>
            )}

            <div className={styles.heroCtas}>
              {studentLoggedIn ? (
                <>
                  <Link to="/student/support" className="btn primary lg">Get Support Now</Link>
                  <Link to="/student/assessment" className="btn ghost lg">Take Assessment</Link>
                </>
              ) : adminLoggedIn ? (
                <Link to="/admin/dashboard" className="btn primary lg">Admin Dashboard</Link>
              ) : (
                <>
                  <Link to="/login?role=student" className="btn primary lg">Start Your Journey</Link>
                  <Link to="/login?role=admin" className="btn ghost lg">Admin Access</Link>
                </>
              )}
            </div>

            {/* Trust badges */}
            <div className={styles.trustRow}>
              <span>🔒 Private & Secure</span>
              <span>🤖 AI Powered</span>
              <span>⚡ 24/7 Support</span>
            </div>
          </div>

          {/* Right — Mood panel */}
          <div className={styles.heroRight}>
            <div className={styles.moodCard}>
              <div className={styles.moodOrb} style={{ '--mood-color': activeMood?.color }}>
                <span className={styles.moodEmoji} key={animKey}>{activeMood?.emoji}</span>
              </div>
              <p className={styles.moodPrompt}>How are you feeling right now?</p>
              <div className={styles.emotionGrid}>
                {emotions.map(e => (
                  <button
                    key={e.id}
                    className={`${styles.emotionBtn} ${currentMood === e.id ? styles.emotionActive : ''}`}
                    onClick={() => updateMood(e.id, 'Selected on landing page')}
                    disabled={isLoading}
                    style={{ '--ec': e.color }}
                  >
                    <span className={styles.emotionEmoji}>{e.emoji}</span>
                    <span className={styles.emotionLabel}>{e.label}</span>
                    {isLoading && currentMood === e.id && <div className="spinner" style={{ width: 12, height: 12 }} />}
                  </button>
                ))}
              </div>

              {insights && (
                <div className={styles.insightPill}>
                  Trend: <strong>{insights.trend.replace('_', ' ')}</strong> · Mood: <strong>{insights.dominantMood}</strong>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Dashboard (logged in) ───────────────────── */}
      {studentLoggedIn && (
        <section className={styles.dashSection}>
          <div className={styles.dashGrid}>
            {/* Quick Actions */}
            <div className={styles.dashCard}>
              <div className={styles.dashCardHeader}>
                <h3>Quick Actions</h3>
                <span>⚡</span>
              </div>
              <div className={styles.actionGrid}>
                <Link to="/student/support" className={styles.actionTile} style={{ '--tc': '#0d9488' }}>
                  <span className={styles.actionIcon}>🤝</span>
                  <span className={styles.actionLabel}>Choose Support</span>
                </Link>
                <Link to="/student/assessment" className={styles.actionTile} style={{ '--tc': '#6d28d9' }}>
                  <span className={styles.actionIcon}>📊</span>
                  <span className={styles.actionLabel}>Assessment</span>
                </Link>
                <Link to="/student/peer" className={styles.actionTile} style={{ '--tc': '#0ea5e9' }}>
                  <span className={styles.actionIcon}>💬</span>
                  <span className={styles.actionLabel}>Community Chat</span>
                </Link>
                <Link to="/student/crisis" className={`${styles.actionTile} ${styles.crisisTile}`} style={{ '--tc': '#ef4444' }}>
                  <span className={styles.actionIcon}>🚨</span>
                  <span className={styles.actionLabel}>Crisis Alert</span>
                </Link>
              </div>
            </div>

            {/* Mood History */}
            <div className={styles.dashCard}>
              <div className={styles.dashCardHeader}>
                <h3>Mood History</h3>
                <span>📈</span>
              </div>
              {moodHistory.length === 0 ? (
                <p style={{ color: 'var(--muted)', fontSize: 14 }}>No mood entries yet. Select an emotion above!</p>
              ) : (
                <div className={styles.moodHistory}>
                  {moodHistory.slice(-7).reverse().map((entry, i) => {
                    const em = emotions.find(e => e.id === entry.mood)
                    return (
                      <div key={entry.id || i} className={styles.moodHistoryItem}>
                        <span>{em?.emoji}</span>
                        <span style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{em?.label}</span>
                        <span style={{ color: 'var(--muted)', fontSize: 12, marginLeft: 'auto' }}>
                          {new Date(entry.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Resources */}
            <div className={styles.dashCard}>
              <div className={styles.dashCardHeader}>
                <h3>Recent Resources</h3>
                <span>📚</span>
              </div>
              <div className={styles.resourceList}>
                {[
                  { icon: '🧘', title: 'Mindful Breathing', desc: '5-min guided session', to: '/student/self-help' },
                  { icon: '🎵', title: 'Calming Sounds', desc: 'Stress relief playlist', to: '/student/self-help' },
                  { icon: '📖', title: 'Sleep Tips', desc: 'Sleep hygiene guide', to: '/student/self-help' },
                ].map((r, i) => (
                  <Link key={i} to={r.to} className={styles.resourceItem}>
                    <span className={styles.resourceIcon}>{r.icon}</span>
                    <div className={styles.resourceText}>
                      <div className={styles.resourceTitle}>{r.title}</div>
                      <div className={styles.resourceDesc}>{r.desc}</div>
                    </div>
                    <span className={styles.resourceArrow}>→</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ─── Features (logged out) ───────────────────── */}
      {!studentLoggedIn && !adminLoggedIn && (
        <>
          <section id="features" className={styles.featuresSection}>
            <div className={styles.sectionHeader}>
              <h2>Why Choose HopeLine?</h2>
              <p>Everything you need for your mental wellness journey</p>
            </div>
            <div className={styles.featuresGrid}>
              {[
                { icon: '🤖', title: 'AI Companion', desc: '24/7 intelligent support powered by advanced LLMs. Always here to listen, understand, and guide you.', color: '#0d9488' },
                { icon: '👥', title: 'Peer Community', desc: 'Connect anonymously with fellow students who truly understand what you\'re going through.', color: '#6d28d9' },
                { icon: '👨‍⚕️', title: 'Professional Counseling', desc: 'Book sessions with licensed mental health professionals at your convenience.', color: '#0ea5e9' },
                { icon: '📊', title: 'Smart Assessments', desc: 'PHQ-9 and GAD-7 validated tools to track your mental health with instant insights.', color: '#f59e0b' },
                { icon: '📚', title: 'Self-Help Library', desc: 'Videos, breathing exercises, calming sounds, and journaling prompts at your fingertips.', color: '#10b981' },
                { icon: '🔒', title: 'Privacy First', desc: 'Your data is encrypted and confidential. We never share your personal information.', color: '#ef4444' },
              ].map((f, i) => (
                <div key={i} className={styles.featureCard} style={{ '--fc': f.color }}>
                  <div className={styles.featureIconBox}>{f.icon}</div>
                  <h4>{f.title}</h4>
                  <p>{f.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section id="support" className={styles.supportSection}>
            <div className={styles.sectionHeader}>
              <h2>Student Support Options</h2>
              <p>Choose the type of support that works best for you</p>
            </div>
            <div className={styles.supportGrid}>
              {[
                { icon: '🤖', title: 'AI Companion', desc: 'Instant, private chat with our mental health AI', btn: 'Start Chat', to: '/student/peer', grad: 'var(--grad-primary)' },
                { icon: '👥', title: 'Peer Support', desc: 'Anonymous community with fellow students', btn: 'Join Community', to: '/student/peer', grad: 'var(--grad-accent)' },
                { icon: '👨‍⚕️', title: 'Professional Counselor', desc: 'Licensed professionals, flexible scheduling', btn: 'Book Session', to: '/student/counselor', grad: 'linear-gradient(135deg,#0ea5e9,#0284c7)' },
                { icon: '📚', title: 'Self-Help Resources', desc: 'Videos, exercises, meditation guides', btn: 'Explore', to: '/student/self-help', grad: 'linear-gradient(135deg,#10b981,#059669)' },
              ].map((s, i) => (
                <div key={i} className={styles.supportCard}>
                  <div className={styles.supportIconWrap} style={{ background: s.grad }}>{s.icon}</div>
                  <h4>{s.title}</h4>
                  <p>{s.desc}</p>
                  <Link to={s.to} className="btn primary" style={{ marginTop: 'auto' }}>{s.btn}</Link>
                </div>
              ))}
            </div>
          </section>

          <section id="about" className={styles.aboutSection}>
            <div className={styles.aboutInner}>
              <div className={styles.aboutLeft}>
                <h2>About HopeLine</h2>
                <p>A comprehensive digital mental health platform designed specifically for university students. We understand the unique pressures of academic life — from exam stress to social challenges — and provide accessible, effective, and private support every step of the way.</p>
                <p>Built by Team Verbose(0) for Smart India Hackathon, HopeLine integrates cutting-edge AI with human-centered design to make mental health support genuinely accessible.</p>
                <Link to="/signup" className="btn primary lg">Join HopeLine Today</Link>
              </div>
              <div className={styles.aboutStats}>
                {[
                  { num: '10K+', label: 'Students Helped' },
                  { num: '24/7', label: 'Always Available' },
                  { num: '95%', label: 'Satisfaction Rate' },
                  { num: '3', label: 'Support Modes' },
                ].map((s, i) => (
                  <div key={i} className={styles.statCard}>
                    <div className={styles.statNum}>{s.num}</div>
                    <div className={styles.statLabel}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {/* ─── Footer ─────────────────────────────────── */}
      <footer className={styles.footer}>
        <div className={styles.footerTop}>
          <div className={styles.footerBrand}>
            <div className={styles.footerLogo}>
              <img src="/logo.png" alt="HopeLine" style={{ height: 26 }} />
              <span>HopeLine</span>
            </div>
            <p>Your mental health companion for university life</p>
          </div>
          <div className={styles.footerLinks}>
            <div className={styles.footerCol}>
              <h5>Platform</h5>
              <a href="#features">Features</a>
              <a href="#support">Support</a>
              <a href="#about">About</a>
            </div>
            <div className={styles.footerCol}>
              <h5>Help</h5>
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
              <a href="#">Help Center</a>
            </div>
            <div className={styles.footerCol}>
              <h5>Contact</h5>
              <a href="#">support@hopeline.edu</a>
              <a href="#">crisis@hopeline.edu</a>
              <a href="#">+91 1800-599-0019</a>
            </div>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p>© 2024 HopeLine · All rights reserved · Your mental health matters</p>
        </div>
      </footer>
    </div>
  )
}