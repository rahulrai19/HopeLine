import { API_BASE } from '../config.js'

function getToken(){ return localStorage.getItem('token') || '' }
function authHeaders(){ const t=getToken(); return t? { Authorization: `Bearer ${t}` } : {} }

export async function apiPost(path, body, opts={}){
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type':'application/json', ...authHeaders(), ...(opts.headers||{}) },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
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


