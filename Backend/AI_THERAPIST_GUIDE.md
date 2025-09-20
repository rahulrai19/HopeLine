# AI Therapist System - Implementation Guide

## Overview
This document describes the enhanced AI Therapist system implemented for the HopeLine mental health platform. The system provides structured mental health support with assessment capabilities, risk categorization, and counselor referral processes.

## System Architecture

### Core Components
1. **AIPromptSystem** - Main prompt management and assessment logic
2. **Enhanced AI Chat Route** - Updated chat endpoint with structured responses
3. **Assessment Endpoints** - PHQ-9 and GAD-7 assessment tools
4. **Counselor Referral System** - Crisis intervention and referral management

## API Endpoints

### 1. Enhanced Chat Endpoint
**POST** `/api/ai/chat`

Enhanced chat with structured mental health support.

#### Request Body
```json
{
  "messages": [
    {"role": "user", "content": "I feel really depressed lately"}
  ],
  "userId": "user123",
  "lang": "en",
  "model": "gemini-1.5-flash-8b"
}
```

#### Response
```json
{
  "reply": "I'm sorry to hear you're feeling depressed. Let's work through this together. Would you like to start with a quick mental health check-in?",
  "action": "general_support",
  "suggestions": ["start_assessment", "general_chat", "self_help_tips"],
  "counselorContact": "+91-9999-888-777",
  "priority": "moderate"
}
```

#### Crisis Response
```json
{
  "reply": "I'm really concerned about your wellbeing. You are not alone. Please call +91-9999-888-777 for immediate support.",
  "action": "crisis_intervention",
  "counselorContact": "+91-9999-888-777",
  "priority": "urgent",
  "crisis": true
}
```

### 2. Mental Health Assessment
**POST** `/api/ai/assessment`

Conduct PHQ-9 or GAD-7 assessments.

#### Request Body
```json
{
  "userId": "user123",
  "assessmentType": "phq9", // or "gad7"
  "responses": [0, 1, 2, 1, 0, 2, 1, 0, 1] // PHQ-9 responses
}
```

#### Response (In Progress)
```json
{
  "complete": false,
  "question": "Over the last 2 weeks, how often have you been bothered by little interest or pleasure in doing things?",
  "questionNumber": 1,
  "totalQuestions": 9,
  "message": "Question 1 of 9: Over the last 2 weeks..."
}
```

#### Response (Complete)
```json
{
  "complete": true,
  "totalScore": 12,
  "severity": {
    "level": "moderate",
    "risk": "moderate"
  },
  "message": "Assessment complete. Your score is 12, indicating moderate depression levels."
}
```

### 3. Counselor Referral
**POST** `/api/ai/counselor-referral`

Create counselor referral for high-risk cases.

#### Request Body
```json
{
  "userId": "user123",
  "reason": "Severe depression with suicidal thoughts",
  "priority": "high",
  "contactInfo": "user@email.com"
}
```

#### Response
```json
{
  "message": "Counselor referral created successfully",
  "referral": {
    "userId": "user123",
    "reason": "Severe depression with suicidal thoughts",
    "priority": "high",
    "status": "pending",
    "counselorContact": "+91-9999-888-777"
  },
  "nextSteps": [
    "A counselor will contact you within 24 hours",
    "In case of emergency, call the helpline immediately"
  ]
}
```

### 4. Self-Help Suggestions
**GET** `/api/ai/self-help/:riskLevel`

Get personalized self-help suggestions based on risk level.

#### Response
```json
{
  "riskLevel": "moderate",
  "suggestions": [
    "Practice daily journaling to express your thoughts",
    "Try progressive muscle relaxation exercises",
    "Consider joining our peer support groups"
  ],
  "counselorContact": null
}
```

### 5. Assessment Progress
**GET** `/api/ai/assessment-progress/:userId`

Get user's current assessment progress.

#### Response
```json
{
  "progress": {
    "phq9Score": 12,
    "gad7Score": 8,
    "phq9Severity": {"level": "moderate", "risk": "moderate"},
    "gad7Severity": {"level": "mild", "risk": "low"},
    "overallRisk": "moderate",
    "timestamp": "2024-01-20T10:30:00.000Z"
  }
}
```

## Assessment Tools

### PHQ-9 (Patient Health Questionnaire-9)
**Purpose:** Depression screening
**Questions:** 9 items
**Scale:** 0-3 (Not at all to Nearly every day)
**Scoring:**
- 0-4: Minimal depression
- 5-9: Mild depression
- 10-14: Moderate depression
- 15-19: Moderately severe depression
- 20-27: Severe depression

### GAD-7 (Generalized Anxiety Disorder-7)
**Purpose:** Anxiety screening
**Questions:** 7 items
**Scale:** 0-3 (Not at all to Nearly every day)
**Scoring:**
- 0-4: Minimal anxiety
- 5-9: Mild anxiety
- 10-14: Moderate anxiety
- 15-21: Severe anxiety

## Risk Categorization

### Low Risk (Minimal/Mild)
- **Actions:** Self-help guidance, breathing exercises, time management
- **Response:** "It sounds like mild stress. Let's try some simple techniques that can help."

### Moderate Risk (Moderate levels)
- **Actions:** Peer support, counselor booking, follow-up check-ins
- **Response:** "I recommend connecting with a peer support group or booking a counselor session."

### High Risk (Moderately severe or severe)
- **Actions:** Immediate counselor contact, crisis intervention
- **Response:** "I'm really concerned about your wellbeing. Please call +91-9999-888-777 for immediate support."

## Crisis Detection

### Keywords Monitored
- "suicide", "kill myself", "end it all"
- "hurt myself", "self harm", "cut myself"
- "better off dead", "not worth living"

### Crisis Response
1. Immediate empathy and concern
2. Provide helpline number
3. Create counselor referral
4. Keep student engaged until human intervention

## Implementation Features

### 1. Structured Prompt System
- Comprehensive system prompt with mental health guidelines
- Risk-based response generation
- Crisis detection and intervention
- Professional boundaries and safety protocols

### 2. Assessment Management
- PHQ-9 and GAD-7 question banks
- Score calculation and severity assessment
- Progress tracking per user
- Completion status management

### 3. Counselor Integration
- Automatic referral creation
- Priority-based routing
- Contact information management
- Follow-up tracking

### 4. Safety Features
- Crisis keyword detection
- Immediate intervention protocols
- Helpline integration
- Professional referral system

## Configuration

### Environment Variables
```env
GEMINI_API_KEY=your_gemini_api_key
COUNSELOR_CONTACT=+91-9999-888-777
```

### Safety Settings
- Enhanced dangerous content detection
- Lower temperature for consistent responses
- Increased token limit for detailed responses
- Retry logic with exponential backoff

## Usage Examples

### Basic Chat
```javascript
const response = await fetch('/api/ai/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    messages: [{ role: 'user', content: 'I feel anxious about exams' }],
    userId: 'user123'
  })
})
```

### Start Assessment
```javascript
const assessment = await fetch('/api/ai/assessment', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userId: 'user123',
    assessmentType: 'phq9',
    responses: []
  })
})
```

### Get Self-Help
```javascript
const selfHelp = await fetch('/api/ai/self-help/moderate')
```

## Best Practices

### 1. User Safety
- Always prioritize user safety over system functionality
- Implement proper crisis intervention protocols
- Maintain professional boundaries
- Ensure confidentiality and privacy

### 2. Response Quality
- Keep responses concise and empathetic
- Avoid clinical jargon
- Provide actionable next steps
- Maintain consistent tone and approach

### 3. System Monitoring
- Log all crisis interventions
- Track assessment completion rates
- Monitor counselor referral success
- Regular system health checks

## Future Enhancements

### 1. Database Integration
- Store assessment results in MongoDB
- Track user progress over time
- Generate analytics and insights
- Maintain referral history

### 2. Advanced Features
- Multi-language support
- Voice interaction capabilities
- Integration with wearable devices
- Predictive risk modeling

### 3. Counselor Dashboard
- Real-time referral notifications
- User risk level overview
- Assessment history viewing
- Follow-up task management

## Testing

### Test Cases
1. **Normal conversation** - General mental health support
2. **Crisis detection** - Suicidal ideation keywords
3. **Assessment flow** - Complete PHQ-9/GAD-7
4. **Risk categorization** - Different severity levels
5. **Counselor referral** - High-risk case handling

### Test Commands
```bash
# Test normal chat
curl -X POST http://localhost:4000/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"messages": [{"role": "user", "content": "I feel stressed"}], "userId": "test123"}'

# Test crisis detection
curl -X POST http://localhost:4000/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"messages": [{"role": "user", "content": "I want to kill myself"}], "userId": "test123"}'

# Test assessment
curl -X POST http://localhost:4000/api/ai/assessment \
  -H "Content-Type: application/json" \
  -d '{"userId": "test123", "assessmentType": "phq9", "responses": []}'
```

This enhanced AI Therapist system provides comprehensive mental health support with proper risk assessment, crisis intervention, and counselor referral capabilities, ensuring student safety and well-being.
