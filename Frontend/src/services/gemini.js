// Lightweight Gemini client for direct frontend calls
// NOTE: This exposes your API key to the browser. Prefer a server proxy in production.

const DEFAULT_MODEL = 'gemini-1.5-flash-8b'

export async function geminiGenerate(messages, options = {}) {
  const apiKey = options.apiKey || import.meta.env.VITE_GEMINI_API_KEY
  const model = options.model || DEFAULT_MODEL

  if (!apiKey) {
    throw new Error('Missing VITE_GEMINI_API_KEY')
  }

  // Convert chat messages to a single prompt string
  const prompt = messages.map(m => `${m.role}: ${m.content}`).join('\n') + '\nassistant:'

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`
  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.3,
      maxOutputTokens: 256,
      topP: 0.8,
    },
    safetySettings: [
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_LOW_AND_ABOVE' },
      { category: 'HARM_CATEGORY_CIVIC_INTEGRITY', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
    ],
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 15000)
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    })
    clearTimeout(timeout)
    if (!res.ok) {
      const text = await res.text()
      throw new Error(text || `HTTP ${res.status}`)
    }
    const data = await res.json()
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || ''
    return text
  } catch (err) {
    clearTimeout(timeout)
    throw err
  }
}


