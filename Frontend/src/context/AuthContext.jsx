import { createContext, useContext, useEffect, useState } from 'react'
import { AuthAPI } from '../services/api.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [studentLoggedIn, setStudentLoggedIn] = useState(false)
  const [adminLoggedIn, setAdminLoggedIn] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(()=>{
    const token = localStorage.getItem('token')
    const role = localStorage.getItem('role')
    if (token && role) {
      setUser({ role })
      setStudentLoggedIn(role==='student')
      setAdminLoggedIn(role==='admin')
    }
  }, [])

  async function login(payload){
    const data = await AuthAPI.login(payload)
    localStorage.setItem('token', data.token)
    localStorage.setItem('role', data.user.role)
    setUser(data.user)
    setStudentLoggedIn(data.user.role==='student')
    setAdminLoggedIn(data.user.role==='admin')
  }

  const loginStudent = () => { setStudentLoggedIn(true); localStorage.setItem('role','student') }
  const logoutStudent = () => { setStudentLoggedIn(false); localStorage.removeItem('token'); localStorage.removeItem('role'); setUser(null) }
  const loginAdmin   = () => { setAdminLoggedIn(true); localStorage.setItem('role','admin') }
  const logoutAdmin  = () => { setAdminLoggedIn(false); localStorage.removeItem('token'); localStorage.removeItem('role'); setUser(null) }

  return (
    <AuthContext.Provider value={{ user, studentLoggedIn, adminLoggedIn, loginStudent, logoutStudent, loginAdmin, logoutAdmin, login }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() { return useContext(AuthContext) }


