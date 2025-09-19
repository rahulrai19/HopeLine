import mongoose from 'mongoose'
import dotenv from 'dotenv'
import User from '../models/User.js'
import Appointment from '../models/Appointment.js'
import Feedback from '../models/Feedback.js'
import ChatSession from '../models/ChatSession.js'
import Assessment from '../models/Assessment.js'
import SystemLog from '../models/SystemLog.js'

dotenv.config()

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hopeline'

const sampleUsers = [
  { name: 'John Doe', email: 'john@university.edu', username: 'john_doe', password: 'password123', role: 'student' },
  { name: 'Jane Smith', email: 'jane@university.edu', username: 'jane_smith', password: 'password123', role: 'student' },
  { name: 'Mike Johnson', email: 'mike@university.edu', username: 'mike_j', password: 'password123', role: 'student' },
  { name: 'Sarah Wilson', email: 'sarah@university.edu', username: 'sarah_w', password: 'password123', role: 'student' },
  { name: 'Dr. Emily Brown', email: 'emily@university.edu', username: 'dr_emily', password: 'password123', role: 'counselor' },
  { name: 'Dr. Michael Davis', email: 'michael@university.edu', username: 'dr_michael', password: 'password123', role: 'counselor' },
  // Demo accounts with correct passwords for frontend
  { name: 'Admin User', email: 'admin@university.edu', username: 'admin', password: 'admin123', role: 'admin' },
  { name: 'Student Demo', email: 'student@university.edu', username: 'student_demo', password: 'admin123', role: 'student' }
]

const sampleAssessments = [
  { type: 'PHQ-9', responses: [
    { questionId: 'q1', question: 'Little interest or pleasure in doing things', answer: 1 },
    { questionId: 'q2', question: 'Feeling down, depressed, or hopeless', answer: 2 },
    { questionId: 'q3', question: 'Trouble falling or staying asleep', answer: 1 },
    { questionId: 'q4', question: 'Feeling tired or having little energy', answer: 2 },
    { questionId: 'q5', question: 'Poor appetite or overeating', answer: 0 },
    { questionId: 'q6', question: 'Feeling bad about yourself', answer: 1 },
    { questionId: 'q7', question: 'Trouble concentrating', answer: 1 },
    { questionId: 'q8', question: 'Moving or speaking slowly', answer: 0 },
    { questionId: 'q9', question: 'Thoughts of self-harm', answer: 0 }
  ], totalScore: 8, severity: 'mild' },
  { type: 'GAD-7', responses: [
    { questionId: 'q1', question: 'Feeling nervous or anxious', answer: 2 },
    { questionId: 'q2', question: 'Not being able to stop worrying', answer: 1 },
    { questionId: 'q3', question: 'Worrying too much about different things', answer: 2 },
    { questionId: 'q4', question: 'Trouble relaxing', answer: 1 },
    { questionId: 'q5', question: 'Being so restless it is hard to sit still', answer: 0 },
    { questionId: 'q6', question: 'Becoming easily annoyed or irritable', answer: 1 },
    { questionId: 'q7', question: 'Feeling afraid as if something awful might happen', answer: 1 }
  ], totalScore: 8, severity: 'mild' }
]

const sampleChatSessions = [
  { sessionType: 'ai', messages: [
    { sender: 'student', content: 'I\'m feeling really stressed about my exams', timestamp: new Date() },
    { sender: 'ai', content: 'I understand that exam stress can be overwhelming. Let\'s work through this together.', timestamp: new Date() }
  ], duration: 15, satisfaction: 4, status: 'completed', mood: 'down' },
  { sessionType: 'peer', messages: [
    { sender: 'student', content: 'Anyone else struggling with anxiety?', timestamp: new Date() },
    { sender: 'peer', content: 'Yes, I\'ve been there. What helps me is deep breathing exercises.', timestamp: new Date() }
  ], duration: 25, satisfaction: 5, status: 'completed', mood: 'content' }
]

const sampleSystemLogs = [
  { level: 'info', category: 'auth', message: 'User login successful', metadata: { ip: '192.168.1.1', endpoint: '/api/auth/login' } },
  { level: 'info', category: 'chat', message: 'New chat session started', metadata: { endpoint: '/api/ai/chat' } },
  { level: 'warning', category: 'system', message: 'High memory usage detected', metadata: { responseTime: 1200 } },
  { level: 'error', category: 'assessment', message: 'Assessment submission failed', metadata: { errorCode: 'VALIDATION_ERROR' } }
]

async function seedDatabase() {
  try {
    await mongoose.connect(MONGO_URI)
    console.log('Connected to MongoDB')

    // Clear existing data
    await User.deleteMany({})
    await Appointment.deleteMany({})
    await Feedback.deleteMany({})
    await ChatSession.deleteMany({})
    await Assessment.deleteMany({})
    await SystemLog.deleteMany({})
    console.log('Cleared existing data')

    // Create users
    const users = await User.insertMany(sampleUsers)
    console.log(`Created ${users.length} users`)

    // Create appointments
    const students = users.filter(u => u.role === 'student')
    const counselors = users.filter(u => u.role === 'counselor')
    
    const appointments = []
    for (let i = 0; i < 10; i++) {
      const student = students[Math.floor(Math.random() * students.length)]
      const counselor = counselors[Math.floor(Math.random() * counselors.length)]
      const startsAt = new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000) // Random date in next 30 days
      
      appointments.push({
        studentId: student._id,
        counselorId: counselor._id,
        startsAt,
        status: Math.random() > 0.3 ? 'booked' : 'completed'
      })
    }
    
    const createdAppointments = await Appointment.insertMany(appointments)
    console.log(`Created ${createdAppointments.length} appointments`)

    // Create feedback for completed appointments
    const completedAppointments = createdAppointments.filter(a => a.status === 'completed')
    const feedbacks = completedAppointments.map(appointment => ({
      studentId: appointment.studentId,
      counselorId: appointment.counselorId,
      appointmentId: appointment._id,
      rating: Math.floor(Math.random() * 5) + 1,
      comment: 'Great session, very helpful!'
    }))
    
    await Feedback.insertMany(feedbacks)
    console.log(`Created ${feedbacks.length} feedback entries`)

    // Create chat sessions
    const chatSessions = []
    for (let i = 0; i < 20; i++) {
      const student = students[Math.floor(Math.random() * students.length)]
      const sessionType = ['ai', 'peer', 'counselor'][Math.floor(Math.random() * 3)]
      const mood = ['down', 'content', 'peaceful', 'happy', 'excited'][Math.floor(Math.random() * 5)]
      
      chatSessions.push({
        studentId: student._id,
        sessionType,
        messages: [
          { sender: 'student', content: 'Hello, I need some support', timestamp: new Date() },
          { sender: sessionType, content: 'I\'m here to help. What\'s on your mind?', timestamp: new Date() }
        ],
        duration: Math.floor(Math.random() * 60) + 5,
        satisfaction: Math.floor(Math.random() * 5) + 1,
        status: Math.random() > 0.2 ? 'completed' : 'active',
        mood
      })
    }
    
    await ChatSession.insertMany(chatSessions)
    console.log(`Created ${chatSessions.length} chat sessions`)

    // Create assessments
    const assessments = []
    for (let i = 0; i < 15; i++) {
      const student = students[Math.floor(Math.random() * students.length)]
      const assessmentType = ['PHQ-9', 'GAD-7', 'combined'][Math.floor(Math.random() * 3)]
      const totalScore = Math.floor(Math.random() * 20) + 1
      const severity = totalScore < 5 ? 'minimal' : totalScore < 10 ? 'mild' : totalScore < 15 ? 'moderate' : 'severe'
      
      assessments.push({
        studentId: student._id,
        type: assessmentType,
        responses: sampleAssessments[0].responses,
        totalScore,
        severity,
        recommendations: ['Practice mindfulness', 'Regular exercise', 'Maintain sleep schedule']
      })
    }
    
    await Assessment.insertMany(assessments)
    console.log(`Created ${assessments.length} assessments`)

    // Create system logs
    await SystemLog.insertMany(sampleSystemLogs)
    console.log(`Created ${sampleSystemLogs.length} system logs`)

    console.log('Database seeding completed successfully!')
    
  } catch (error) {
    console.error('Error seeding database:', error)
  } finally {
    await mongoose.disconnect()
    console.log('Disconnected from MongoDB')
  }
}

seedDatabase()
