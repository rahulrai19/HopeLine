import { createContext, useContext, useEffect, useState } from 'react'
import { AuthAPI } from '../services/api.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [studentLoggedIn, setStudentLoggedIn] = useState(false)
  const [adminLoggedIn, setAdminLoggedIn] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const role = localStorage.getItem('role')
    
    if (token && role) {
      // Temporarily set logged in state so UI doesn't flicker
      setStudentLoggedIn(role === 'student')
      setAdminLoggedIn(role === 'admin')
      
      // Fetch full user profile
      AuthAPI.getProfile().then(data => {
        if (data && data.user) {
          setUser(data.user)
          localStorage.setItem('role', data.user.role)
          setStudentLoggedIn(data.user.role === 'student')
          setAdminLoggedIn(data.user.role === 'admin')
        }
      }).catch(err => {
        console.error('Failed to restore session:', err)
        // Only log out if it's a 401/auth error, otherwise keep the local session
        if (err.message.includes('401')) {
          logout()
        } else {
          setUser({ role }) // fallback to just role if network is down
        }
      })
    }
  }, [])

  async function login(payload){
    const data = await AuthAPI.login(payload)
    localStorage.setItem('token', data.accessToken || data.token)
    localStorage.setItem('role', data.user.role)
    setUser(data.user)
    setStudentLoggedIn(data.user.role==='student')
    setAdminLoggedIn(data.user.role==='admin')
  }

  async function signup(payload){
    const data = await AuthAPI.signup(payload)
    localStorage.setItem('token', data.accessToken || data.token)
    localStorage.setItem('role', data.user.role)
    setUser(data.user)
    setStudentLoggedIn(data.user.role==='student')
    setAdminLoggedIn(data.user.role==='admin')
    return data
  }

  const loginStudent = () => { setStudentLoggedIn(true); localStorage.setItem('role','student') }
  const logoutStudent = () => { setStudentLoggedIn(false); localStorage.removeItem('token'); localStorage.removeItem('role'); setUser(null) }
  const loginAdmin   = () => { setAdminLoggedIn(true); localStorage.setItem('role','admin') }
  const logoutAdmin  = () => { setAdminLoggedIn(false); localStorage.removeItem('token'); localStorage.removeItem('role'); setUser(null) }

  const logout = () => {
    setStudentLoggedIn(false)
    setAdminLoggedIn(false)
    setUser(null)
    localStorage.removeItem('token')
    localStorage.removeItem('role')
  }

  return (
    <AuthContext.Provider value={{ user, studentLoggedIn, adminLoggedIn, loginStudent, logoutStudent, loginAdmin, logoutAdmin, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() { return useContext(AuthContext) }


