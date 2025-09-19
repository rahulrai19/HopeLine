import { useMood } from '../../context/MoodContext.jsx'
import { useState } from 'react'
import styles from './MoodIndicator.module.scss'

export function MoodIndicator({ compact = false, showHistory = false }) {
  const { currentMood, emotions, updateMood, moodHistory, getMoodInsights } = useMood()
  const [isExpanded, setIsExpanded] = useState(false)

  const currentEmotion = emotions.find(e => e.id === currentMood)
  const insights = getMoodInsights()

  if (compact) {
    return (
      <div className={styles.compactIndicator}>
        <div 
          className={styles.moodDot}
          style={{ backgroundColor: currentEmotion?.color }}
          title={`Current mood: ${currentEmotion?.label}`}
        >
          {currentEmotion?.emoji}
        </div>
      </div>
    )
  }

  return (
    <div className={styles.moodIndicator}>
      <div className={styles.currentMood}>
        <div className={styles.moodDisplay}>
          <div 
            className={styles.moodEmoji}
            style={{ 
              backgroundColor: currentEmotion?.color,
              boxShadow: `0 0 20px ${currentEmotion?.color}40`
            }}
          >
            {currentEmotion?.emoji}
          </div>
          <div className={styles.moodInfo}>
            <div className={styles.moodLabel}>{currentEmotion?.label}</div>
            <div className={styles.moodTime}>
              {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </div>
        
        {showHistory && (
          <button 
            className={styles.toggleBtn}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? '▼' : '▶'}
          </button>
        )}
      </div>

      {isExpanded && showHistory && (
        <div className={styles.moodHistory}>
          <h4>Recent Moods</h4>
          <div className={styles.historyList}>
            {moodHistory.slice(-5).reverse().map(entry => (
              <div key={entry.id} className={styles.historyItem}>
                <div 
                  className={styles.historyEmoji}
                  style={{ backgroundColor: entry.emotion.color }}
                >
                  {entry.emotion.emoji}
                </div>
                <div className={styles.historyInfo}>
                  <div className={styles.historyLabel}>{entry.emotion.label}</div>
                  <div className={styles.historyTime}>
                    {new Date(entry.timestamp).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {insights && (
            <div className={styles.insights}>
              <h5>Insights</h5>
              <p>Trend: <strong>{insights.trend.replace('_', ' ')}</strong></p>
              <p>Most common: <strong>{insights.dominantMood}</strong></p>
            </div>
          )}
        </div>
      )}

      <div className={styles.quickMoods}>
        <span>Quick mood:</span>
        {emotions.map(emotion => (
          <button
            key={emotion.id}
            className={`${styles.quickMoodBtn} ${currentMood === emotion.id ? styles.active : ''}`}
            onClick={() => updateMood(emotion.id, 'Quick mood selection')}
            style={{ '--emotion-color': emotion.color }}
          >
            {emotion.emoji}
          </button>
        ))}
      </div>
    </div>
  )
}
