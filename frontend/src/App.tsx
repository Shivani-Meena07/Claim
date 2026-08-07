
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Landing from './pages/Landing'
import Login from './pages/auth/Login'
import Signup from './pages/auth/Signup'
import ForgotPassword from './pages/auth/ForgotPassword'
import VerifyOtp from './pages/auth/VerifyOtp'
import AppShell from './components/layout/AppShell'
import Dashboard from './pages/Dashboard'
import CycleTracker from './pages/CycleTracker'
import MoodTracker from './pages/MoodTracker'
import WellnessCoach from './pages/WellnessCoach'
import Chatbot from './pages/Chatbot'
import Community from './pages/Community'
import DoctorConnect from './pages/DoctorConnect'
import MentalWellness from './pages/MentalWellness'
import MonthlyReport from './pages/MonthlyReport'
import Settings from './pages/Settings'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />

        <Route path="/app" element={<AppShell />}>
          <Route index element={<Dashboard />} />
          <Route path="cycle" element={<CycleTracker />} />
          <Route path="mood" element={<MoodTracker />} />
          <Route path="coach" element={<WellnessCoach />} />
          <Route path="chat" element={<Chatbot />} />
          <Route path="community" element={<Community />} />
          <Route path="doctors" element={<DoctorConnect />} />
          <Route path="mental-wellness" element={<MentalWellness />} />
          <Route path="report" element={<MonthlyReport />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
