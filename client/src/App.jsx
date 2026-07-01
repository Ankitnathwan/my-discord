import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import { useEffect } from 'react'
import useAuthStore from './stores/authStore'
import ProtectedRoute from './components/ProtectedRoute'
import ChannelsPage from './pages/ChannelsPage'

export default function App() {
  const { initialize } = useAuthStore()
  useEffect(() => {
    initialize()
  }, [])

  return (
    <Routes>
      <Route path="/login" element={<LoginPage/>}/>
      <Route path="/register" element={<div>Register Page</div>}/>
      <Route path="/channels" element={<ProtectedRoute><ChannelsPage /></ProtectedRoute>}/>
      <Route path="*" element={<Navigate to="/login" replace />}/>
    </Routes>
  )
}