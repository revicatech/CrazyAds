import { createContext, useContext, useState, useEffect } from 'react'
import { adminLogin as loginApi, adminVerify } from '../services/adminApi'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('adminToken'))
  const [loading, setLoading] = useState(!!token)

  useEffect(() => {
    if (!token) return
    adminVerify()
      .then((res) => setAdmin(res.admin))
      .catch(() => {
        localStorage.removeItem('adminToken')
        setToken(null)
        setAdmin(null)
      })
      .finally(() => setLoading(false))
  }, [token])

  const login = async (username, password) => {
    const res = await loginApi(username, password)
    localStorage.setItem('adminToken', res.token)
    setToken(res.token)
    setAdmin(res.admin)
    return res
  }

  const logout = () => {
    localStorage.removeItem('adminToken')
    setToken(null)
    setAdmin(null)
  }

  return (
    <AuthContext.Provider value={{ admin, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
