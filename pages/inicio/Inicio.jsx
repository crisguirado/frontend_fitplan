/**
 * INICIO PAGE
 * Dashboard con resumen de rutinas del usuario autenticado
 */

import { useState, useEffect, useContext } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import { obtenerRutinas } from '../../services/api'      
import './Inicio.css'

export const Inicio = () => {
  const { user, isAuthenticated } = useContext(AuthContext)
  const [rutinas, setRutinas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    cargarRutinas()
  }, [])

  const cargarRutinas = async () => {
    try {
      setLoading(true)
      const response = await obtenerRutinas()
      if (response.success) {
        // Obtener solo las últimas 4 rutinas
        const ultimasRutinas = response.data.slice(0, 4)
        setRutinas(ultimasRutinas)
      }
    } catch (err) {
      setError('Error al cargar las rutinas')
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="inicio-page">
      <div className="container">
        <div className="inicio-header">
          <div>
            <h1>¡Bienvenido, {user?.nombre}! 👋</h1>
            <p className="subtitle">Aquí tienes un resumen de tus últimas rutinas</p>
          </div>
          <Link to="/rutinas" className="btn btn-primary">
            Ver todas las rutinas
          </Link>
        </div>

        {/* Estadísticas */}
        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-icon">📋</span>
            <div className="stat-info">
              <h3>Total Rutinas</h3>
              <p className="stat-number">{rutinas.length}</p>
            </div>
          </div>
          <div className="stat-card">
            <span className="stat-icon">✅</span>
            <div className="stat-info">
              <h3>Rutinas Activas</h3>
              <p className="stat-number">
                {rutinas.filter(r => r.activa).length}
              </p>
            </div>
          </div>
          <div className="stat-card">
            <span className="stat-icon">⏱️</span>
            <div className="stat-info">
              <h3>Tiempo Total</h3>
              <p className="stat-number">
                {rutinas.reduce((acc, r) => acc + r.duracionMinutos, 0)} min
              </p>
            </div>
          </div>
        </div>

        {/* Últimas rutinas */}
        <div className="rutinas-section">
          <h2>Últimas Rutinas Añadidas</h2>

          {loading && (
            <div className="loading">
              <div className="spinner"></div>
            </div>
          )}

          {error && (
            <div className="error-message">{error}</div>
          )}

          {!loading && !error && rutinas.length === 0 && (
            <div className="empty-state">
              <span className="empty-icon">📭</span>
              <h3>No tienes rutinas aún</h3>
              <p>Crea tu primera rutina para comenzar</p>
              <Link to="/rutinas" className="btn btn-primary">
                Crear rutina
              </Link>
            </div>
          )}

          {!loading && !error && rutinas.length > 0 && (
            <div className="cards-grid">
              {rutinas.map((rutina) => (
                <div key={rutina._id} className="card rutina-card">
                  <div className="card-header">
                    <h3>{rutina.nombre}</h3>
                    <span className={`badge badge-${rutina.nivel.toLowerCase()}`}>
                      {rutina.nivel}
                    </span>
                  </div>
                  <p className="rutina-description">{rutina.descripcion}</p>
                  <div className="rutina-info">
                    <span>🎯 {rutina.objetivo}</span>
                    <span>📅 {rutina.diasPorSemana} días/semana</span>
                    <span>⏱️ {rutina.duracionMinutos} min</span>
                  </div>
                  <div className="card-footer">
                    <span className={`badge badge-${rutina.activa ? 'activa' : 'inactiva'}`}>
                      {rutina.activa ? 'Activa' : 'Inactiva'}
                    </span>
                    <Link to={`/rutinas`} className="btn btn-primary btn-sm">
                      Ver detalles
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}