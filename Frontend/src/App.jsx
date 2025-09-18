import { Routes, Route, Navigate } from 'react-router-dom'
import { AppLayout } from './components/layout/AppLayout.jsx'
import { StudentLanding } from './pages/student/StudentLanding.jsx'
import { StudentDashboard } from './pages/student/StudentDashboard.jsx'
import { Assessment } from './pages/student/Assessment.jsx'
import { CrisisAlert } from './pages/student/CrisisAlert.jsx'
import { ChooseSupport } from './pages/student/ChooseSupport.jsx'
import { SelfHelp } from './pages/student/SelfHelp.jsx'
import { PeerSupport } from './pages/student/PeerSupport.jsx'
import { Counselor } from './pages/student/Counselor.jsx'
import { Feedback } from './pages/student/Feedback.jsx'
import { AdminLogin } from './pages/admin/AdminLogin.jsx'
import { AdminDashboard } from './pages/admin/AdminDashboard.jsx'
import { UserManagement } from './pages/admin/UserManagement.jsx'
import { CaseMonitoring } from './pages/admin/CaseMonitoring.jsx'
import { ReportsAnalytics } from './pages/admin/ReportsAnalytics.jsx'
import { OfflineCounselorSupport } from './pages/admin/OfflineCounselorSupport.jsx'
import { UpdatesNotification } from './pages/admin/UpdatesNotification.jsx'
import { AuthProvider, useAuth } from './context/AuthContext.jsx'
import { Login } from './pages/auth/Login.jsx'
import { ChatbotWidget } from './components/chatbot/ChatbotWidget.jsx'

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<AppLayout />}> 
          <Route index element={<Navigate to="/student" replace />} />
          <Route path="student">
            <Route index element={<StudentLanding />} />
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="assessment" element={<RequireStudent><Assessment /></RequireStudent>} />
            <Route path="crisis" element={<CrisisAlert />} />
            <Route path="support" element={<ChooseSupport />} />
            <Route path="self-help" element={<SelfHelp />} />
            <Route path="peer" element={<PeerSupport />} />
            <Route path="counselor" element={<Counselor />} />
            <Route path="feedback" element={<Feedback />} />
          </Route>

          <Route path="login" element={<Login />} />

          <Route path="admin">
            <Route index element={<AdminLogin />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="cases" element={<CaseMonitoring />} />
            <Route path="reports" element={<ReportsAnalytics />} />
            <Route path="offline-support" element={<OfflineCounselorSupport />} />
            <Route path="updates" element={<UpdatesNotification />} />
          </Route>
        </Route>
      </Routes>
      <ChatbotWidget />
    </AuthProvider>
  )
}

function RequireStudent({ children }){
  const { studentLoggedIn } = useAuth()
  if (!studentLoggedIn) return <Navigate to="/login?role=student" replace />
  return children
}


