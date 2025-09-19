import { API_BASE } from '../config.js'

function getToken(){ return localStorage.getItem('token') || '' }
function authHeaders(){ const t=getToken(); return t? { Authorization: `Bearer ${t}` } : {} }

export async function apiPost(path, body, opts={}){
  try {
    console.log('API POST:', path, body)
    const res = await fetch(`${API_BASE}${path}`, {
      method: 'POST',
      headers: { 'Content-Type':'application/json', ...authHeaders(), ...(opts.headers||{}) },
      body: JSON.stringify(body),
    })
    
    if (!res.ok) {
      const errorText = await res.text()
      console.error('API Error:', res.status, errorText)
      throw new Error(errorText || `HTTP ${res.status}`)
    }
    
    return res.json()
  } catch (error) {
    console.error('API Request failed:', error)
    throw error
  }
}

export const AuthAPI = {
  login: (payload) => apiPost('/api/auth/login', payload),
  register: (payload) => apiPost('/api/auth/register', payload),
}

export const AppointmentsAPI = {
  book: (payload) => apiPost('/api/appointments/book', payload),
}

export const FeedbackAPI = {
  submit: (payload) => apiPost('/api/feedback/submit', payload),
}

export const AIAPI = {
  chat: (payload) => apiPost('/api/ai/chat', payload),
}

export const AnalyticsAPI = {
  getOverview: () => apiGet('/api/analytics/overview'),
  getUserTrends: (period) => apiGet(`/api/analytics/users/trends?period=${period}`),
  getChatAnalytics: () => apiGet('/api/analytics/chat/analytics'),
  getAssessmentAnalytics: () => apiGet('/api/analytics/assessments/analytics'),
  getAppointmentAnalytics: () => apiGet('/api/analytics/appointments/analytics'),
  getSystemHealth: () => apiGet('/api/analytics/system/health'),
  getActivityFeed: (limit) => apiGet(`/api/analytics/activity/feed?limit=${limit}`),
}

function apiGet(path) {
  return fetch(`${API_BASE}${path}`, {
    method: 'GET',
    headers: { ...authHeaders() },
  }).then(res => {
    if (!res.ok) throw new Error(res.statusText)
    return res.json()
  })
}


