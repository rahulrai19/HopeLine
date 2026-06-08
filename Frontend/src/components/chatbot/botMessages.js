export const BOT_MESSAGES = {
  en: {
    hello: "Hi! I'm your HopeLine assistant. How can I help you today?",
    placeholder: "Type a message",
    nudge: "Need help? Try our chatbot!",
    crisis: "If you feel unsafe, please tap Crisis Alert immediately or call your local helpline. You are not alone.",
    help: "HopeLine offers Self Help resources, anonymous Peer Support communities, and licensed Counselors. What would you like to explore?",
    breathe: "Try a 5-minute breathing exercise or listen to calming sounds in the Self Help section.",
    assessment: "You can take a PHQ-9 or GAD-7 mental health assessment in the dashboard to track your well-being.",
    counselor: "You can book a 1-on-1 session with our verified counselors from the Counselor section. Many are available 24/7.",
    peer: "Our Peer Support community allows you to chat anonymously with other students going through similar challenges.",
    off_topic: "I am a mental health assistant. I can only help you with HopeLine features, mental health support, and wellness resources. Please ask me something related to these topics.",
    default: "Thanks for sharing. I'm here to listen and support you.",
  },
  hi: {
    hello: "नमस्ते! मैं HopeLine सहायक हूँ। मैं आपकी कैसे मदद कर सकता/सकती हूँ?",
    placeholder: "यहाँ लिखें",
    nudge: "मदद चाहिए? चैटबॉट आज़माएँ!",
    crisis: "यदि आप असुरक्षित महसूस कर रहे हैं, तो कृपया तुरंत Crisis Alert दबाएँ। आप अकेले नहीं हैं।",
    help: "HopeLine आपको Self Help, Peer Support, और Counselor की सुविधा देता है।",
    breathe: "Self Help में 5 मिनट का श्वास व्यायाम आज़माएँ।",
    assessment: "आप डैशबोर्ड में मानसिक स्वास्थ्य मूल्यांकन (PHQ-9 या GAD-7) दे सकते हैं।",
    counselor: "आप हमारे सत्यापित सलाहकारों के साथ 1-on-1 सत्र बुक कर सकते हैं।",
    peer: "Peer Support समुदाय आपको अन्य छात्रों के साथ गुमनाम रूप से चैट करने की अनुमति देता है।",
    off_topic: "मैं एक मानसिक स्वास्थ्य सहायक हूँ। कृपया मुझसे HopeLine और मानसिक स्वास्थ्य से संबंधित प्रश्न ही पूछें।",
    default: "धन्यवाद, मैं आपकी बात समझ रहा/रही हूँ।",
  },
}

const INTENTS = [
  { key: 'crisis', patterns: [/suicid|hurt|unsafe|danger|die|kill|end my life/i, /आत्महत्या|खतरा|असुरक्षित|मरना/i] },
  { key: 'help', patterns: [/what can you do|features|how to use|platform|services/i, /क्या कर सकते|सुविधा|उपयोग/i] },
  { key: 'breathe', patterns: [/anx|anxiety|panic|breathe|stress/i, /घबराहट|सांस|तनाव/i] },
  { key: 'assessment', patterns: [/test|assess|phq|gad|score/i, /टेस्ट|मूल्यांकन|स्कोर/i] },
  { key: 'counselor', patterns: [/counselor|therapist|doctor|book/i, /सलाहकार|डॉक्टर|बुक/i] },
  { key: 'peer', patterns: [/peer|community|chat with others|friends/i, /समुदाय|अन्य छात्र/i] },
  { key: 'hello', patterns: [/hi|hello|hey|greetings/i, /नमस्ते|हैलो/i] },
  // Simple off-topic restriction (catches coding, math, general knowledge)
  { key: 'off_topic', patterns: [/code|math|calculate|python|javascript|president|weather|movie|sports/i, /कोड|गणित|मौसम/i] },
]

export function detectLanguage(text) {
  if (/[अ-ह]/.test(text)) return 'hi'
  return 'en'
}

export function replyFor(text, lang='en') {
  const pack = BOT_MESSAGES[lang] || BOT_MESSAGES.en
  if (!text.trim()) return pack.default
  
  for (const intent of INTENTS) {
    if (intent.patterns.some(p => p.test(text))) {
      return pack[intent.key] || pack.default
    }
  }
  return pack.default
}


