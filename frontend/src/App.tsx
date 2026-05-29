import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import Home from './pages/Home'
import ProjectDetail from './pages/ProjectDetail'
import Login from './pages/admin/Login'
import Dashboard from './pages/admin/Dashboard'

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { isAdmin } = useAuth()
  return isAdmin ? children : <Navigate to="/admin/login" replace />
}

export default function App() {
  return (
    <Routes>
      <Route path="/"               element={<Home />} />
      <Route path="/project/:slug"  element={<ProjectDetail />} />
      <Route path="/admin/login"    element={<Login />} />
      <Route path="/admin/*"        element={
        <ProtectedRoute><Dashboard /></ProtectedRoute>
      } />
      <Route path="*"               element={<Navigate to="/" replace />} />
    </Routes>
  )
}
