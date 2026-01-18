/**
 * LOGIN PAGE
 * Página de inicio de sesión
 */

import { useState, useContext } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import './Login.css'

export const Login = () => {
  const navigate = useNavigate()
  const { login, isAuthenticated } = useContext(AuthContext)
  
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Redirigir si ya está autenticado
  if (isAuthenticated) {
    return <Navigate to="/inicio" replace />
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!formData.username || !formData.password) {
      setError('Todos los campos son obligatorios')
      setLoading(false)
      return
    }

    try {
      const result = await login(formData)
      
      if (result.success) {
        navigate('/inicio')
      } else {
        setError(result.message || 'Error al iniciar sesión')
      }
    } catch (err) {
      setError('Error de conexión. Intenta nuevamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <span className="login-icon">🔒</span>
            <h1>Iniciar Sesión</h1>
            <p>Accede a tu cuenta de Fitplan</p>
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="username">Usuario o Email</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="input-field"
                placeholder="susanahoria97"
                disabled={loading}
                autoComplete="username"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Contraseña</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="input-field"
                placeholder="••••••••"
                disabled={loading}
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%' }}
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
          </form>

          <div className="login-footer">
            <p className="credentials-info">
              <strong>Credenciales de prueba:</strong><br />
              Usuario: <code>susanahoria97</code><br />
              Contraseña: <code>escuelacei</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}