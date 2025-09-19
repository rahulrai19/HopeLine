import { Router } from 'express'
import User from '../models/User.js'
import Appointment from '../models/Appointment.js'
import Feedback from '../models/Feedback.js'
import ChatSession from '../models/ChatSession.js'
import Assessment from '../models/Assessment.js'
import SystemLog from '../models/SystemLog.js'
import { protectRoute } from '../middleware/protectRoute.js'

const router = Router()

// Get dashboard overview statistics
router.get('/overview', protectRoute, async (req, res) => {
  try {
    const [
      totalUsers,
      activeUsers,
      totalAppointments,
      pendingAppointments,
      totalChatSessions,
      activeChatSessions,
      totalAssessments,
      averageRating
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'student' }),
      Appointment.countDocuments(),
      Appointment.countDocuments({ status: 'booked' }),
      ChatSession.countDocuments(),
      ChatSession.countDocuments({ status: 'active' }),
      Assessment.countDocuments(),
      Feedback.aggregate([
        { $group: { _id: null, avgRating: { $avg: '$rating' } } }
      ])
    ])

    res.json({
      totalUsers,
      activeUsers,
      totalAppointments,
      pendingAppointments,
      totalChatSessions,
      activeChatSessions,
      totalAssessments,
      averageRating: averageRating[0]?.avgRating || 0
    })
  } catch (error) {
    res.status(500).json({ message: 'Error fetching overview data', error: error.message })
  }
})

// Get user registration trends
router.get('/users/trends', protectRoute, async (req, res) => {
  try {
    const { period = '7d' } = req.query
    const days = period === '7d' ? 7 : period === '30d' ? 30 : 90
    
    const trends = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000) }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ])

    res.json(trends)
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user trends', error: error.message })
  }
})

// Get chat session analytics
router.get('/chat/analytics', protectRoute, async (req, res) => {
  try {
    const [
      sessionTypes,
      averageDuration,
      satisfactionScores,
      moodDistribution,
      languageUsage
    ] = await Promise.all([
      ChatSession.aggregate([
        { $group: { _id: '$sessionType', count: { $sum: 1 } } }
      ]),
      ChatSession.aggregate([
        { $group: { _id: null, avgDuration: { $avg: '$duration' } } }
      ]),
      ChatSession.aggregate([
        { $match: { satisfaction: { $exists: true } } },
        { $group: { _id: '$satisfaction', count: { $sum: 1 } } }
      ]),
      ChatSession.aggregate([
        { $match: { mood: { $exists: true } } },
        { $group: { _id: '$mood', count: { $sum: 1 } } }
      ]),
      ChatSession.aggregate([
        { $unwind: '$messages' },
        { $group: { _id: '$messages.language', count: { $sum: 1 } } }
      ])
    ])

    res.json({
      sessionTypes,
      averageDuration: averageDuration[0]?.avgDuration || 0,
      satisfactionScores,
      moodDistribution,
      languageUsage
    })
  } catch (error) {
    res.status(500).json({ message: 'Error fetching chat analytics', error: error.message })
  }
})

// Get assessment analytics
router.get('/assessments/analytics', protectRoute, async (req, res) => {
  try {
    const [
      assessmentTypes,
      severityDistribution,
      recentAssessments,
      scoreTrends
    ] = await Promise.all([
      Assessment.aggregate([
        { $group: { _id: '$type', count: { $sum: 1 } } }
      ]),
      Assessment.aggregate([
        { $group: { _id: '$severity', count: { $sum: 1 } } }
      ]),
      Assessment.find()
        .sort({ completedAt: -1 })
        .limit(10)
        .populate('studentId', 'name email'),
      Assessment.aggregate([
        {
          $group: {
            _id: {
              year: { $year: '$completedAt' },
              month: { $month: '$completedAt' },
              day: { $dayOfMonth: '$completedAt' }
            },
            avgScore: { $avg: '$totalScore' },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
      ])
    ])

    res.json({
      assessmentTypes,
      severityDistribution,
      recentAssessments,
      scoreTrends
    })
  } catch (error) {
    res.status(500).json({ message: 'Error fetching assessment analytics', error: error.message })
  }
})

// Get appointment analytics
router.get('/appointments/analytics', protectRoute, async (req, res) => {
  try {
    const [
      statusDistribution,
      monthlyTrends,
      counselorWorkload,
      completionRate
    ] = await Promise.all([
      Appointment.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]),
      Appointment.aggregate([
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } }
      ]),
      Appointment.aggregate([
        { $group: { _id: '$counselorId', count: { $sum: 1 } } },
        { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'counselor' } },
        { $unwind: '$counselor' },
        { $project: { counselorName: '$counselor.name', appointmentCount: '$count' } }
      ]),
      Appointment.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            completed: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } }
          }
        },
        {
          $project: {
            completionRate: { $multiply: [{ $divide: ['$completed', '$total'] }, 100] }
          }
        }
      ])
    ])

    res.json({
      statusDistribution,
      monthlyTrends,
      counselorWorkload,
      completionRate: completionRate[0]?.completionRate || 0
    })
  } catch (error) {
    res.status(500).json({ message: 'Error fetching appointment analytics', error: error.message })
  }
})

// Get system health metrics
router.get('/system/health', protectRoute, async (req, res) => {
  try {
    const [
      errorLogs,
      systemLoad,
      responseTimes,
      activeUsers
    ] = await Promise.all([
      SystemLog.countDocuments({ level: 'error' }),
      SystemLog.aggregate([
        { $match: { category: 'system' } },
        { $group: { _id: '$level', count: { $sum: 1 } } }
      ]),
      SystemLog.aggregate([
        { $match: { 'metadata.responseTime': { $exists: true } } },
        { $group: { _id: null, avgResponseTime: { $avg: '$metadata.responseTime' } } }
      ]),
      User.countDocuments({ role: 'student' })
    ])

    res.json({
      errorCount: errorLogs,
      systemLoad,
      averageResponseTime: responseTimes[0]?.avgResponseTime || 0,
      activeUsers
    })
  } catch (error) {
    res.status(500).json({ message: 'Error fetching system health', error: error.message })
  }
})

// Get real-time activity feed
router.get('/activity/feed', protectRoute, async (req, res) => {
  try {
    const { limit = 20 } = req.query
    
    const activities = await SystemLog.find()
      .sort({ timestamp: -1 })
      .limit(parseInt(limit))
      .populate('userId', 'name email role')
      .select('level category message timestamp userId metadata')

    res.json(activities)
  } catch (error) {
    res.status(500).json({ message: 'Error fetching activity feed', error: error.message })
  }
})

export default router
