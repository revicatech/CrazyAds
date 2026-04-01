import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function ProtectedRoute() {
  const { admin, loading } = useAuth()

  if (loading)
    return (
      <div className="min-h-screen bg-[#111] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#dc1e1e] border-t-transparent rounded-full animate-spin" />
      </div>
    )

  if (!admin) return <Navigate to="/admin/login" replace />

  return <Outlet />
}
