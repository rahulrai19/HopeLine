export const BOT_MESSAGES = {
  en: {
    hello: "Hi! I'm your HopeLine assistant. How can I help?",
    placeholder: "Type a message",
    nudge: "Need help? Try our chatbot!",
    crisis: "If you feel unsafe, tap Crisis Alert or call your local helpline.",
    help: "You can choose Self Help, Peer Support, or Counselor from Support.",
    breathe: "Try a 5-minute breathing exercise in Self Help → Meditation.",
    default: "Thanks for sharing. I'm listening.",
  },
  hi: {
    hello: "नमस्ते! मैं HopeLine सहायक हूँ। मैं आपकी कैसे मदद कर सकता/सकती हूँ?",
    placeholder: "यहाँ लिखें",
    nudge: "मदद चाहिए? चैटबॉट आज़माएँ!",
    crisis: "यदि आप असुरक्षित महसूस कर रहे हैं, तो Crisis Alert दबाएँ।",
    help: "आप Self Help, Peer Support, या Counselor चुन सकते हैं।",
    breathe: "Self Help → Meditation में 5 मिनट का श्वास व्यायाम आज़माएँ।",
    default: "धन्यवाद, मैं आपकी बात समझ रहा/रही हूँ।",
  },
}

const INTENTS = [
  { key: 'crisis', patterns: [/suicid|hurt|unsafe|danger/i, /आत्महत्या|खतरा|असुरक्षित/i] },
  { key: 'help', patterns: [/help|support|assist/i, /मदद|सहायता/i] },
  { key: 'breathe', patterns: [/anx|anxiety|panic|breathe/i, /घबराहट|सांस/i] },
]

export function detectLanguage(text) {
  // Very naive detection for demo
  if (/[अ-ह]/.test(text)) return 'hi'
  // Default to English if not Hindi
  return 'en'
}

export function replyFor(text, lang='en') {
  const pack = BOT_MESSAGES[lang] || BOT_MESSAGES.en
  if (!text.trim()) return pack.default
  for (const intent of INTENTS) {
    if (intent.patterns.some(p=>p.test(text))) return pack[intent.key] || pack.default
  }
  return pack.default
}


