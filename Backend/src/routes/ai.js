import { Router } from 'express'
import { aiPromptSystem } from '../utils/aiPromptSystem.js'

const PY_LLM_URL = process.env.PY_LLM_URL // e.g., http://localhost:8001/chat

const router = Router()

// POST /api/ai/chat
router.post('/chat', async (req, res) => {
  const { messages = [], lang = 'en', model = 'gemini-1.5-flash-8b', userId = 'anonymous' } = req.body || {}

  try {
    const context = aiPromptSystem.generateConversationContext(userId, messages)

    if (context.immediateAction) {
      return res.json({
        reply: context.message,
        action: context.action,
        counselorContact: context.counselorContact,
        priority: context.priority,
        crisis: true
      })
    }

    if (PY_LLM_URL) {
      const pyRes = await fetch(PY_LLM_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages, system_prompt: aiPromptSystem.getSystemPrompt() })
      })
      if (pyRes.ok) {
        const data = await pyRes.json()
        return res.json({
          reply: data.reply,
          action: context.action,
          suggestions: context.suggestions,
          counselorContact: context.counselorContact,
          priority: context.priority
        })
      }
      const txt = await pyRes.text()
      return res.status(502).json({ message: 'Python LLM error', detail: txt })
    }

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) return res.status(500).json({ message: 'Missing GEMINI_API_KEY' })

    const systemPrompt = aiPromptSystem.getSystemPrompt()
    const userText = messages.map(m => `${m.role}: ${m.content}`).join('\n')
    const prompt = `${systemPrompt}\n\nLanguage: ${lang}\n\nConversation:\n${userText}\n\nassistant:`

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`
    const payload = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 200,
        topP: 0.8
      },
      safetySettings: [
        { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_LOW_AND_ABOVE' },
        { category: 'HARM_CATEGORY_CIVIC_INTEGRITY', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      ],
    }

    async function callWithRetry(attempt = 1) {
      const controller = new AbortController()
      const to = setTimeout(() => controller.abort(), 15_000)
      try {
        const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload), signal: controller.signal })
        clearTimeout(to)
        if (r.ok) {
          const data = await r.json()
          const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '...'
          return { ok: true, text }
        }
        const errText = await r.text()
        if (r.status >= 500 && attempt < 3) {
          await new Promise(res => setTimeout(res, 300 * Math.pow(2, attempt)))
          return callWithRetry(attempt + 1)
        }
        return { ok: false, status: r.status, text: errText }
      } catch (e) {
        clearTimeout(to)
        if (attempt < 3) {
          await new Promise(res => setTimeout(res, 300 * Math.pow(2, attempt)))
          return callWithRetry(attempt + 1)
        }
        return { ok: false, status: 500, text: String(e) }
      }
    }

    let out = await callWithRetry()

    if (!out.ok) {
      const fallback = {
        en: 'I\'m here to listen and support you. If this is urgent, please call our helpline or use the Crisis Alert feature. You\'re not alone.',
        hi: 'मैं आपकी बात सुनने और सहायता करने के लिए यहाँ हूँ। यदि यह आपातकाल है, कृपया हमारी हेल्पलाइन पर कॉल करें।',
      }
      const text = fallback[lang] || fallback.en
      return res.json({
        reply: text,
        degraded: true,
        error: { status: out.status, text: out.text },
        action: 'general_support'
      })
    }

    const lastAssistant = [...messages].reverse().find(m => m.role === 'assistant')?.content?.trim()
    const current = out.text?.trim()
    if (lastAssistant && current && current === lastAssistant) {
      payload.generationConfig = { ...(payload.generationConfig || {}), temperature: 0.6, topP: 0.9 }
      const antiRepeatPrompt = `${prompt}\n\nAvoid repeating the previous assistant message. Add one new supportive insight or next step.`
      payload.contents = [{ parts: [{ text: antiRepeatPrompt }] }]
      out = await callWithRetry()
    }

    res.json({
      reply: out.text,
      action: context.action,
      suggestions: context.suggestions,
      counselorContact: context.counselorContact,
      priority: context.priority
    })

  } catch (error) {
    console.error('AI Chat error:', error)
    res.status(500).json({
      message: 'Internal server error',
      reply: 'I\'m experiencing some technical difficulties, but I\'m still here for you. Please try again or contact our support team.',
      action: 'general_support'
    })
  }
})

// POST /api/ai/assessment
router.post('/assessment', async (req, res) => {
  try {
    const { userId, assessmentType, responses = [] } = req.body

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' })
    }

    let questions = []
    let currentQuestion = 0

    if (assessmentType === 'phq9') {
      questions = aiPromptSystem.getPHQ9Questions()
    } else if (assessmentType === 'gad7') {
      questions = aiPromptSystem.getGAD7Questions()
    } else {
      return res.status(400).json({ message: 'Invalid assessment type. Use "phq9" or "gad7"' })
    }

    currentQuestion = responses.length

    if (currentQuestion >= questions.length) {
      const totalScore = responses.reduce((sum, score) => sum + score, 0)
      const severity = assessmentType === 'phq9'
        ? aiPromptSystem.calculatePHQ9Severity(totalScore)
        : aiPromptSystem.calculateGAD7Severity(totalScore)

      return res.json({
        complete: true,
        totalScore,
        severity,
        message: `Assessment complete. Your score is ${totalScore}, indicating ${severity.level} ${assessmentType === 'phq9' ? 'depression' : 'anxiety'} levels.`
      })
    }

    res.json({
      complete: false,
      question: questions[currentQuestion],
      questionNumber: currentQuestion + 1,
      totalQuestions: questions.length,
      message: `Question ${currentQuestion + 1} of ${questions.length}: ${questions[currentQuestion]}`
    })

  } catch (error) {
    console.error('Assessment error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

// POST /api/ai/counselor-referral
router.post('/counselor-referral', async (req, res) => {
  try {
    const { userId, reason, priority = 'moderate', contactInfo } = req.body

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' })
    }

    const referral = {
      userId,
      reason,
      priority,
      contactInfo,
      timestamp: new Date(),
      status: 'pending',
      counselorContact: aiPromptSystem.counselorContact
    }

    console.log('Counselor referral created:', referral)

    res.json({
      message: 'Counselor referral created successfully',
      referral,
      counselorContact: aiPromptSystem.counselorContact,
      nextSteps: [
        'A counselor will contact you within 24 hours',
        'In case of emergency, call the helpline immediately',
        'Continue using self-help resources in the meantime'
      ]
    })

  } catch (error) {
    console.error('Counselor referral error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

// GET /api/ai/self-help/:riskLevel
router.get('/self-help/:riskLevel', async (req, res) => {
  try {
    const { riskLevel } = req.params

    if (!['low', 'moderate', 'high'].includes(riskLevel)) {
      return res.status(400).json({ message: 'Invalid risk level. Use low, moderate, or high' })
    }

    const suggestions = aiPromptSystem.getSelfHelpSuggestions(riskLevel)

    res.json({
      riskLevel,
      suggestions,
      counselorContact: riskLevel === 'high' ? aiPromptSystem.counselorContact : null
    })

  } catch (error) {
    console.error('Self-help suggestions error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

// GET /api/ai/assessment-progress/:userId
router.get('/assessment-progress/:userId', async (req, res) => {
  try {
    const { userId } = req.params
    const progress = aiPromptSystem.getAssessmentProgress(userId)

    if (!progress) {
      return res.json({ message: 'No assessment in progress' })
    }

    res.json({ progress })

  } catch (error) {
    console.error('Assessment progress error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

export default router
