// AI Therapist Prompt System for Mental Health Support
// Implements structured assessment and risk categorization

export class AIPromptSystem {
  constructor() {
    this.assessmentState = new Map() // Store user assessment progress
    this.counselorContact = '+91-9999-888-777' // Replace with actual helpline
  }

  // Main system prompt for the AI therapist
  getSystemPrompt() {
    return `You are an AI Therapist chatbot built for the project "Development of a Digital Mental Health and Psychological Support System for Students in Higher Education."

Your purpose is to support students who may face stress, anxiety, depression, academic pressure, loneliness, or other psychological issues.

CORE BEHAVIOR:
- Keep replies short, empathetic, and supportive (2–4 sentences max)
- Avoid judgment and clinical jargon unless necessary
- Always give next steps instead of long lectures
- Be warm, understanding, and non-judgmental
- Use "I" statements and show genuine care


CONVERSATION RULES:
- Do not repeat the same question or sentence in back-to-back messages.
- Build on the student's last message; acknowledge briefly, then progress.
- If you already asked something, either rephrase once or move forward.


ASSESSMENT FLOW (PHQ-9 & GAD-7):
1. Greet the student and explain you'll ask a few short questions to understand their mental health better
2. Administer PHQ-9 (9 items) and GAD-7 (7 items), one question at a time
3. Response scale: 0 = Not at all, 1 = Several days, 2 = More than half the days, 3 = Nearly every day
4. Collect responses and calculate total scores

PHQ-9 SEVERITY:
- 0–4 → Minimal
- 5–9 → Mild  
- 10–14 → Moderate
- 15–19 → Moderately Severe
- 20–27 → Severe

GAD-7 SEVERITY:
- 0–4 → Minimal
- 5–9 → Mild
- 10–14 → Moderate
- 15–21 → Severe

RISK CATEGORIZATION & ACTIONS:

LOW RISK (minimal/mild):
→ Suggest self-help tips (breathing, journaling, peer support, time management)
→ Example: "It sounds like mild stress. Let's try breaking tasks into smaller steps or doing a quick breathing exercise."

MODERATE RISK (moderate levels):
→ Suggest peer support, counselor booking, and follow-up check-ins
→ Example: "It seems you've been feeling down lately. I recommend connecting with a peer support group or booking a counselor session. Should I schedule one for you?"

HIGH RISK (moderately severe or severe; mentions of self-harm, suicidal thoughts, crisis):
→ Show immediate empathy
→ Escalate to a human counselor with contact details
→ Example: "I'm really concerned about your wellbeing. You are not alone. I'm connecting you with a professional counselor right now. Please call ${this.counselorContact} for immediate support. I've also scheduled an offline counselor session for you."
→ Keep the student calm and engaged until counselor takes over

COUNSELOR REFERRAL FLOW:
- Provide counselor contact number when risk is high
- Create a record in the offline counselor support system for follow-up
- Keep encouraging, empathetic responses until human intervention is confirmed

BOUNDARIES:
- Do not prescribe medication
- Never dismiss feelings
- Always prioritize confidentiality and safety
- If crisis detected, immediately provide helpline numbers
- Maintain professional boundaries while being supportive

Remember: You are here to support, not diagnose. Always encourage professional help when needed.`
  }

  // PHQ-9 Depression Assessment Questions
  getPHQ9Questions() {
    return [
      "Over the last 2 weeks, how often have you been bothered by little interest or pleasure in doing things?",
      "Over the last 2 weeks, how often have you been bothered by feeling down, depressed, or hopeless?",
      "Over the last 2 weeks, how often have you been bothered by trouble falling or staying asleep, or sleeping too much?",
      "Over the last 2 weeks, how often have you been bothered by feeling tired or having little energy?",
      "Over the last 2 weeks, how often have you been bothered by poor appetite or overeating?",
      "Over the last 2 weeks, how often have you been bothered by feeling bad about yourself - or that you are a failure or have let yourself or your family down?",
      "Over the last 2 weeks, how often have you been bothered by trouble concentrating on things, such as reading the newspaper or watching television?",
      "Over the last 2 weeks, how often have you been bothered by moving or speaking so slowly that other people could have noticed, or the opposite - being so fidgety or restless that you have been moving around a lot more than usual?",
      "Over the last 2 weeks, how often have you been bothered by thoughts that you would be better off dead, or of hurting yourself in some way?"
    ]
  }

  // GAD-7 Anxiety Assessment Questions
  getGAD7Questions() {
    return [
      "Over the last 2 weeks, how often have you been bothered by feeling nervous, anxious, or on edge?",
      "Over the last 2 weeks, how often have you been bothered by not being able to stop or control worrying?",
      "Over the last 2 weeks, how often have you been bothered by worrying too much about different things?",
      "Over the last 2 weeks, how often have you been bothered by trouble relaxing?",
      "Over the last 2 weeks, how often have you been bothered by being so restless that it's hard to sit still?",
      "Over the last 2 weeks, how often have you been bothered by becoming easily annoyed or irritable?",
      "Over the last 2 weeks, how often have you been bothered by feeling afraid as if something awful might happen?"
    ]
  }

  // Calculate PHQ-9 severity
  calculatePHQ9Severity(score) {
    if (score >= 0 && score <= 4) return { level: 'minimal', risk: 'low' }
    if (score >= 5 && score <= 9) return { level: 'mild', risk: 'low' }
    if (score >= 10 && score <= 14) return { level: 'moderate', risk: 'moderate' }
    if (score >= 15 && score <= 19) return { level: 'moderately severe', risk: 'high' }
    if (score >= 20 && score <= 27) return { level: 'severe', risk: 'high' }
    return { level: 'unknown', risk: 'moderate' }
  }

  // Calculate GAD-7 severity
  calculateGAD7Severity(score) {
    if (score >= 0 && score <= 4) return { level: 'minimal', risk: 'low' }
    if (score >= 5 && score <= 9) return { level: 'mild', risk: 'low' }
    if (score >= 10 && score <= 14) return { level: 'moderate', risk: 'moderate' }
    if (score >= 15 && score <= 21) return { level: 'severe', risk: 'high' }
    return { level: 'unknown', risk: 'moderate' }
  }

  // Get risk-based response
  getRiskBasedResponse(phq9Score, gad7Score, userId) {
    const phq9Severity = this.calculatePHQ9Severity(phq9Score)
    const gad7Severity = this.calculateGAD7Severity(gad7Score)
    
    // Determine overall risk level
    const overallRisk = this.determineOverallRisk(phq9Severity.risk, gad7Severity.risk)
    
    // Store assessment results
    this.assessmentState.set(userId, {
      phq9Score,
      gad7Score,
      phq9Severity,
      gad7Severity,
      overallRisk,
      timestamp: new Date()
    })

    return this.generateRiskResponse(overallRisk, phq9Severity, gad7Severity)
  }

  // Determine overall risk level
  determineOverallRisk(phq9Risk, gad7Risk) {
    if (phq9Risk === 'high' || gad7Risk === 'high') return 'high'
    if (phq9Risk === 'moderate' || gad7Risk === 'moderate') return 'moderate'
    return 'low'
  }

  // Generate response based on risk level
  generateRiskResponse(riskLevel, phq9Severity, gad7Severity) {
    switch (riskLevel) {
      case 'high':
        return {
          message: `I'm really concerned about your wellbeing. You are not alone, and I want to make sure you get the support you need right now. Please call ${this.counselorContact} for immediate professional support. I've also scheduled an offline counselor session for you. Your feelings are valid, and there are people who can help you through this.`,
          action: 'crisis_intervention',
          counselorContact: this.counselorContact,
          priority: 'urgent'
        }
      
      case 'moderate':
        return {
          message: `It seems you've been going through a challenging time lately. I recommend connecting with a peer support group or booking a counselor session. Would you like me to help you schedule a counseling appointment? There are also some self-help techniques we can explore together.`,
          action: 'counselor_referral',
          suggestions: ['peer_support', 'counselor_booking', 'self_help_tips']
        }
      
      case 'low':
      default:
        return {
          message: `It sounds like you might be experiencing some mild stress or anxiety. Let's try some simple techniques that can help. How about we start with a quick breathing exercise, or would you prefer to talk about what's on your mind?`,
          action: 'self_help_guidance',
          suggestions: ['breathing_exercises', 'time_management', 'peer_support', 'journaling']
        }
    }
  }

  // Get self-help suggestions based on risk level
  getSelfHelpSuggestions(riskLevel) {
    const suggestions = {
      low: [
        "Try the 4-7-8 breathing technique: Inhale for 4, hold for 7, exhale for 8",
        "Break large tasks into smaller, manageable steps",
        "Take regular breaks and practice mindfulness",
        "Connect with friends or join a study group"
      ],
      moderate: [
        "Practice daily journaling to express your thoughts",
        "Try progressive muscle relaxation exercises",
        "Consider joining our peer support groups",
        "Schedule regular check-ins with a counselor"
      ],
      high: [
        "Please call the helpline immediately: " + this.counselorContact,
        "Stay with a trusted friend or family member",
        "Remove any means of self-harm from your environment",
        "Remember: This feeling is temporary and help is available"
      ]
    }
    return suggestions[riskLevel] || suggestions.low
  }

  // Check for crisis keywords in user message
  detectCrisisKeywords(message) {
    const crisisKeywords = [
      'suicide', 'kill myself', 'end it all', 'not worth living',
      'hurt myself', 'self harm', 'cut myself', 'overdose',
      'jump off', 'hang myself', 'end my life', 'better off dead'
    ]
    
    const lowerMessage = message.toLowerCase()
    return crisisKeywords.some(keyword => lowerMessage.includes(keyword))
  }

  // Generate crisis response
  generateCrisisResponse() {
    return {
      message: `I'm really concerned about what you're telling me. Your life has value, and you are not alone. Please call ${this.counselorContact} right now for immediate support. I'm also connecting you with a crisis counselor. Please stay safe - there are people who care about you and want to help.`,
      action: 'crisis_intervention',
      counselorContact: this.counselorContact,
      priority: 'urgent',
      immediateAction: true
    }
  }

  // Get assessment progress for a user
  getAssessmentProgress(userId) {
    return this.assessmentState.get(userId) || null
  }

  // Clear assessment data for a user
  clearAssessment(userId) {
    this.assessmentState.delete(userId)
  }

  // Generate conversation context
  generateConversationContext(userId, messages) {
    const assessment = this.getAssessmentProgress(userId)
    const lastMessage = messages[messages.length - 1]?.content || ''
    
    // Check for crisis keywords
    if (this.detectCrisisKeywords(lastMessage)) {
      return this.generateCrisisResponse()
    }

    // If assessment is complete, provide risk-based response
    if (assessment) {
      return this.getRiskBasedResponse(
        assessment.phq9Score, 
        assessment.gad7Score, 
        userId
      )
    }

    // Default supportive response
    return {
      message: "I'm here to listen and support you. How are you feeling today? If you'd like, I can help you with a quick mental health check-in.",
      action: 'general_support',
      suggestions: ['start_assessment', 'general_chat', 'self_help_tips']
    }
  }
}

// Export singleton instance
export const aiPromptSystem = new AIPromptSystem()
