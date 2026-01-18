import { Link, useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import './Header.css'

/**
 * HEADER COMPONENT
 * Barra de navegación superior
 */

export const Header = () => {
  const { user, logout, isAuthenticated } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            <span className="logo-icon">🏋️</span>
            <span className="logo-text">Fitplan</span>
          </Link>

          <nav className="nav">
            {isAuthenticated ? (
              <>
                <Link to="/inicio" className="nav-link">Inicio</Link>
                <Link to="/rutinas" className="nav-link">Rutinas</Link>
                <div className="user-menu">
                  <span className="user-name">Hola, {user?.nombre}</span>
                  <button onClick={handleLogout} className="btn btn-secondary btn-sm">
                    Cerrar Sesión
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-primary btn-sm">
                  Iniciar Sesión
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}