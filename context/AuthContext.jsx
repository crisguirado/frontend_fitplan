import { createContext, useState, useEffect } from 'react'
import { login as loginService } from '../services/api'

/**
 * AUTH CONTEXT
 * Contexto global para manejo de autenticación
 */

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Cargar usuario del localStorage al iniciar
  useEffect(() => {
    const storedUser = localStorage.getItem('fitplan_user')
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        localStorage.removeItem('fitplan_user')
      }
    }
    setLoading(false)
  }, [])

  // Login
  const login = async (credentials) => {
    try {
      const response = await loginService(credentials)
      
      if (response.success) {
        const userData = response.data
        setUser(userData)
        localStorage.setItem('fitplan_user', JSON.stringify(userData))
        return { success: true }
      }
      
      return { success: false, message: response.message }
    } catch (error) {
      return { 
        success: false, 
        message: error.message || 'Error al iniciar sesión' 
      }
    }
  }

  // Logout
  const logout = () => {
    setUser(null)
    localStorage.removeItem('fitplan_user')
  }

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user
  }

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}