import { Router } from 'express'

const router = Router()

// POST /api/ai/chat  { messages: [{role:'user'|'system'|'assistant', content:string}], lang?:'en' }
router.post('/chat', async (req, res) => {
  const { messages = [], lang = 'en', model = 'gemini-1.5-flash-8b' } = req.body || {}
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) return res.status(500).json({ message: 'Missing GEMINI_API_KEY' })

  // Build a prompt (simple, safe)
  const system = 'You are HopeLine mental health assistant. Be supportive and VERY concise (max 2-3 sentences). Provide general wellbeing guidance, not medical diagnosis. If crisis is suspected, advise calling local helplines.'
  const userText = messages.map(m=>`${m.role}: ${m.content}`).join('\n')
  const prompt = `${system}\nLanguage: ${lang}\nConversation:\n${userText}\nassistant:`

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`
  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: { temperature: 0.4, maxOutputTokens: 128, topP: 0.9 },
    safetySettings: [
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_CIVIC_INTEGRITY', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
    ],
  }

  // Retry with exponential backoff on 5xx/UNAVAILABLE
  async function callWithRetry(attempt = 1) {
    const controller = new AbortController()
    const to = setTimeout(()=>controller.abort(), 12_000)
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
        await new Promise(res=>setTimeout(res, 300 * Math.pow(2, attempt)))
        return callWithRetry(attempt + 1)
      }
      return { ok: false, status: r.status, text: errText }
    } catch (e) {
      clearTimeout(to)
      if (attempt < 3) {
        await new Promise(res=>setTimeout(res, 300 * Math.pow(2, attempt)))
        return callWithRetry(attempt + 1)
      }
      return { ok: false, status: 500, text: String(e) }
    }
  }

  const out = await callWithRetry()
  if (!out.ok) {
    // Graceful fallback: respond 200 with a supportive default to keep UX smooth
    const fallback = {
      en: 'The assistant is busy right now. I\'m here to listen. If this is urgent, please use Crisis Alert or call a local helpline.',
      hi: 'सहायक अभी व्यस्त है। मैं सुन रहा/रही हूँ। यदि यह आपातकाल है, कृपया Crisis Alert का उपयोग करें।',
    }
    const text = fallback[lang] || fallback.en
    return res.json({ reply: text, degraded: true, error: { status: out.status, text: out.text } })
  }
  res.json({ reply: out.text })
})

export default router


