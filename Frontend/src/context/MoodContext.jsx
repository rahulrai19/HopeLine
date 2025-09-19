import { createContext, useContext, useState, useEffect } from 'react'
import { AIAPI } from '../services/api.js'

const MoodContext = createContext(null)

export function MoodProvider({ children }) {
  const [currentMood, setCurrentMood] = useState('peaceful')
  const [moodHistory, setMoodHistory] = useState([])
  const [personalizedContent, setPersonalizedContent] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const emotions = [
    { id: 'down', emoji: '😔', label: 'Down', color: '#6366f1', intensity: 1 },
    { id: 'content', emoji: '🙂', label: 'Content', color: '#10b981', intensity: 2 },
    { id: 'peaceful', emoji: '😌', label: 'Peaceful', color: '#8b5cf6', intensity: 3 },
    { id: 'happy', emoji: '😊', label: 'Happy', color: '#f59e0b', intensity: 4 },
    { id: 'excited', emoji: '✨', label: 'Excited', color: '#ef4444', intensity: 5 }
  ]

  // Load mood history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('moodHistory')
    if (savedHistory) {
      try {
        setMoodHistory(JSON.parse(savedHistory))
      } catch (e) {
        console.error('Error loading mood history:', e)
      }
    }
  }, [])

  // Save mood history to localStorage whenever it changes
  useEffect(() => {
    if (moodHistory.length > 0) {
      localStorage.setItem('moodHistory', JSON.stringify(moodHistory))
    }
  }, [moodHistory])

  const updateMood = async (newMood, additionalContext = '') => {
    const emotion = emotions.find(e => e.id === newMood)
    if (!emotion) return

    setCurrentMood(newMood)
    
    // Add to mood history
    const moodEntry = {
      id: Date.now(),
      mood: newMood,
      emotion,
      timestamp: new Date().toISOString(),
      context: additionalContext
    }
    
    setMoodHistory(prev => [...prev.slice(-9), moodEntry]) // Keep last 10 entries

    // Generate personalized content based on mood
    await generatePersonalizedContent(newMood, additionalContext)
  }

  const generatePersonalizedContent = async (mood, context = '') => {
    setIsLoading(true)
    try {
      const emotion = emotions.find(e => e.id === mood)
      const prompt = `Based on the user's current mood: ${emotion?.label} (${emotion?.emoji}), provide personalized mental health support. 
      
      Context: ${context || 'User is feeling ' + emotion?.label.toLowerCase()}
      
      Please provide:
      1. A supportive message (max 100 characters)
      2. A suggested activity (max 50 characters)
      3. A motivational quote (max 80 characters)
      
      Format as JSON: {"message": "...", "activity": "...", "quote": "..."}`
      
      const response = await AIAPI.chat({ message: prompt })
      
      try {
        const content = JSON.parse(response.message)
        setPersonalizedContent(content)
      } catch (e) {
        // Fallback if AI doesn't return valid JSON
        setPersonalizedContent({
          message: `We're here to support you through this ${emotion?.label.toLowerCase()} feeling.`,
          activity: 'Take a deep breath and try some gentle stretching',
          quote: 'Every emotion is valid and temporary. You are stronger than you know.'
        })
      }
    } catch (error) {
      console.error('Error generating personalized content:', error)
      // Fallback content
      const emotion = emotions.find(e => e.id === mood)
      setPersonalizedContent({
        message: `We're here to support you through this ${emotion?.label.toLowerCase()} feeling.`,
        activity: 'Take a deep breath and try some gentle stretching',
        quote: 'Every emotion is valid and temporary. You are stronger than you know.'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getMoodInsights = () => {
    if (moodHistory.length < 3) return null

    const recentMoods = moodHistory.slice(-7) // Last 7 entries
    const moodCounts = recentMoods.reduce((acc, entry) => {
      acc[entry.mood] = (acc[entry.mood] || 0) + 1
      return acc
    }, {})

    const dominantMood = Object.keys(moodCounts).reduce((a, b) => 
      moodCounts[a] > moodCounts[b] ? a : b
    )

    const avgIntensity = recentMoods.reduce((sum, entry) => 
      sum + entry.emotion.intensity, 0
    ) / recentMoods.length

    return {
      dominantMood,
      avgIntensity,
      trend: avgIntensity > 3 ? 'positive' : avgIntensity < 2.5 ? 'needs_support' : 'stable',
      moodCounts
    }
  }

  const resetMood = () => {
    setCurrentMood('peaceful')
    setPersonalizedContent(null)
  }

  const value = {
    currentMood,
    moodHistory,
    personalizedContent,
    isLoading,
    emotions,
    updateMood,
    getMoodInsights,
    resetMood,
    setPersonalizedContent
  }

  return (
    <MoodContext.Provider value={value}>
      {children}
    </MoodContext.Provider>
  )
}

export function useMood() {
  const context = useContext(MoodContext)
  if (!context) {
    throw new Error('useMood must be used within a MoodProvider')
  }
  return context
}
