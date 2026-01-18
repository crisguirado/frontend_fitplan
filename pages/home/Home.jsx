/**
 * HOME PAGE
 * Página de inicio/landing con logo y botones
 */

import { Link } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import './Home.css'

export const Home = () => {
  const { isAuthenticated } = useContext(AuthContext)

  return (
    <div className="home-page">
      <div className="home-container">
        <div className="home-content">
          {/* Logo grande */}
          <div className="home-logo">
            <span className="home-logo-icon">🏋️</span>
            <h1 className="home-logo-text">Fitplan</h1>
          </div>

          {/* Descripción */}
          <p className="home-description">
            Tu aplicación para gestionar rutinas de entrenamiento de forma profesional
          </p>

          {/* Botones */}
          <div className="home-buttons">
            {isAuthenticated ? (
              <>
                <Link to="/inicio" className="btn btn-primary btn-large">
                  Ir al Inicio
                </Link>
                <Link to="/rutinas" className="btn btn-secondary btn-large">
                  Ver Rutinas
                </Link>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-primary btn-large">
                  Iniciar Sesión
                </Link>
              </>
            )}
          </div>

          {/* Características */}
          <div className="home-features">
            <div className="feature-card">
              <span className="feature-icon">📋</span>
              <h3>Organiza tus rutinas</h3>
              <p>Crea y gestiona todas tus rutinas de entrenamiento</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">💪</span>
              <h3>Alcanza tus metas</h3>
              <p>Define objetivos y niveles de dificultad</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">📈</span>
              <h3>Controla tu progreso</h3>
              <p>Mantén un registro completo de tus ejercicios</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}