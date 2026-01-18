/**
 * RUTINAS PAGE  
 * CRUD completo de rutinas de ejercicio
 */

import { useState, useEffect, useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext' 
import { obtenerRutinas, crearRutina, actualizarRutina, eliminarRutina } from '../../services/api' 
import './Rutinas.css'

export const Rutinas = () => {
  const { isAuthenticated } = useContext(AuthContext)
  const [rutinas, setRutinas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  // Estados para el modal
  const [showModal, setShowModal] = useState(false)
  const [modoEdicion, setModoEdicion] = useState(false)
  const [rutinaEditando, setRutinaEditando] = useState(null)
  
  // Estado del formulario
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    nivel: 'Principiante',
    objetivo: '',
    diasPorSemana: 3,
    duracionMinutos: 60,
    ejercicios: [],
    activa: true
  })
  
  // Estado para agregar ejercicios
  const [nuevoEjercicio, setNuevoEjercicio] = useState('')

  // Filtros
  const [filtroNivel, setFiltroNivel] = useState('Todos')
  const [busqueda, setBusqueda] = useState('')

  useEffect(() => {
    cargarRutinas()
  }, [])

  const cargarRutinas = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await obtenerRutinas()
      if (response.success) {
        setRutinas(response.data)
      }
    } catch (err) {
      setError('Error al cargar las rutinas')
    } finally {
      setLoading(false)
    }
  }

  // Limpiar mensajes después de 3 segundos
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(''), 3000)
      return () => clearTimeout(timer)
    }
  }, [success])

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 3000)
      return () => clearTimeout(timer)
    }
  }, [error])

  // Abrir modal para crear
  const abrirModalCrear = () => {
    setModoEdicion(false)
    setRutinaEditando(null)
    setFormData({
      nombre: '',
      descripcion: '',
      nivel: 'Principiante',
      objetivo: '',
      diasPorSemana: 3,
      duracionMinutos: 60,
      ejercicios: [],
      activa: true
    })
    setNuevoEjercicio('')
    setShowModal(true)
  }

  // Abrir modal para editar
  const abrirModalEditar = (rutina) => {
    setModoEdicion(true)
    setRutinaEditando(rutina)
    setFormData({
      nombre: rutina.nombre,
      descripcion: rutina.descripcion,
      nivel: rutina.nivel,
      objetivo: rutina.objetivo,
      diasPorSemana: rutina.diasPorSemana,
      duracionMinutos: rutina.duracionMinutos,
      ejercicios: rutina.ejercicios || [],
      activa: rutina.activa
    })
    setNuevoEjercicio('')
    setShowModal(true)
  }

  // Cerrar modal
  const cerrarModal = () => {
    setShowModal(false)
    setModoEdicion(false)
    setRutinaEditando(null)
  }

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  // Agregar ejercicio
  const agregarEjercicio = () => {
    if (nuevoEjercicio.trim()) {
      setFormData({
        ...formData,
        ejercicios: [...formData.ejercicios, nuevoEjercicio.trim()]
      })
      setNuevoEjercicio('')
    }
  }

  // Eliminar ejercicio
  const eliminarEjercicio = (index) => {
    setFormData({
      ...formData,
      ejercicios: formData.ejercicios.filter((_, i) => i !== index)
    })
  }

  // Guardar rutina (crear o editar)
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    // Validaciones
    if (!formData.nombre || !formData.descripcion || !formData.objetivo) {
      setError('Todos los campos son obligatorios')
      return
    }

    try {
      setLoading(true)
      
      if (modoEdicion) {
        // Actualizar rutina existente
        const response = await actualizarRutina(rutinaEditando._id, formData)
        if (response.success) {
          setSuccess('Rutina actualizada correctamente')
          cerrarModal()
          cargarRutinas()
        }
      } else {
        // Crear nueva rutina
        const response = await crearRutina(formData)
        if (response.success) {
          setSuccess('Rutina creada correctamente')
          cerrarModal()
          cargarRutinas()
        }
      }
    } catch (err) {
      setError(err.message || 'Error al guardar la rutina')
    } finally {
      setLoading(false)
    }
  }

  // Eliminar rutina
  const handleEliminar = async (id, nombre) => {
    if (window.confirm(`¿Estás seguro de eliminar la rutina "${nombre}"?`)) {
      try {
        setLoading(true)
        const response = await eliminarRutina(id)
        if (response.success) {
          setSuccess('Rutina eliminada correctamente')
          cargarRutinas()
        }
      } catch (err) {
        setError('Error al eliminar la rutina')
      } finally {
        setLoading(false)
      }
    }
  }

  // Filtrar rutinas
  const rutinasFiltradas = rutinas.filter(rutina => {
    const cumpleNivel = filtroNivel === 'Todos' || rutina.nivel === filtroNivel
    const cumpleBusqueda = rutina.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                          rutina.descripcion.toLowerCase().includes(busqueda.toLowerCase())
    return cumpleNivel && cumpleBusqueda
  })

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="rutinas-page">
      <div className="container">
        {/* Header */}
        <div className="page-header">
          <div>
            <h1>Mis Rutinas</h1>
            <p className="subtitle">
              {rutinasFiltradas.length} rutina{rutinasFiltradas.length !== 1 ? 's' : ''} encontrada{rutinasFiltradas.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button onClick={abrirModalCrear} className="btn btn-primary">
            ➕ Nueva Rutina
          </button>
        </div>

        {/* Mensajes */}
        {success && <div className="success-message">{success}</div>}
        {error && <div className="error-message">{error}</div>}

        {/* Filtros */}
        <div className="filtros-container">
          <div className="filtro-busqueda">
            <input
              type="text"
              placeholder="Buscar rutinas..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="input-field"
            />
          </div>
          <div className="filtro-nivel">
            <select
              value={filtroNivel}
              onChange={(e) => setFiltroNivel(e.target.value)}
              className="input-field"
            >
              <option value="Todos">Todos los niveles</option>
              <option value="Principiante">Principiante</option>
              <option value="Intermedio">Intermedio</option>
              <option value="Avanzado">Avanzado</option>
            </select>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="loading">
            <div className="spinner"></div>
          </div>
        )}

        {/* Listado de rutinas */}
        {!loading && rutinasFiltradas.length === 0 && (
          <div className="empty-state">
            <span className="empty-icon">📭</span>
            <h3>No se encontraron rutinas</h3>
            <p>
              {busqueda || filtroNivel !== 'Todos' 
                ? 'Intenta con otros filtros'
                : 'Crea tu primera rutina para comenzar'
              }
            </p>
          </div>
        )}

        {!loading && rutinasFiltradas.length > 0 && (
          <div className="cards-grid">
            {rutinasFiltradas.map((rutina) => (
              <div key={rutina._id} className="card rutina-card fade-in">
                <div className="card-header">
                  <h3>{rutina.nombre}</h3>
                  <span className={`badge badge-${rutina.nivel.toLowerCase()}`}>
                    {rutina.nivel}
                  </span>
                </div>

                <p className="rutina-description">{rutina.descripcion}</p>

                <div className="rutina-info">
                  <div className="info-item">
                    <span className="info-icon">🎯</span>
                    <span>{rutina.objetivo}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-icon">📅</span>
                    <span>{rutina.diasPorSemana} días/semana</span>
                  </div>
                  <div className="info-item">
                    <span className="info-icon">⏱️</span>
                    <span>{rutina.duracionMinutos} minutos</span>
                  </div>
                </div>

                {/* Ejercicios */}
                {rutina.ejercicios && rutina.ejercicios.length > 0 && (
                  <div className="ejercicios-preview">
                    <strong>Ejercicios ({rutina.ejercicios.length}):</strong>
                    <ul>
                      {rutina.ejercicios.slice(0, 3).map((ejercicio, index) => (
                        <li key={index}>{ejercicio}</li>
                      ))}
                      {rutina.ejercicios.length > 3 && (
                        <li className="mas-ejercicios">
                          +{rutina.ejercicios.length - 3} más
                        </li>
                      )}
                    </ul>
                  </div>
                )}

                <div className="card-footer">
                  <span className={`badge badge-${rutina.activa ? 'activa' : 'inactiva'}`}>
                    {rutina.activa ? 'Activa' : 'Inactiva'}
                  </span>
                  <div className="card-actions">
                    <button
                      onClick={() => abrirModalEditar(rutina)}
                      className="btn btn-sm btn-secondary"
                    >
                      ✏️ Editar
                    </button>
                    <button
                      onClick={() => handleEliminar(rutina._id, rutina.nombre)}
                      className="btn btn-sm btn-danger"
                    >
                      🗑️ Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal para crear/editar */}
        {showModal && (
          <div className="modal-overlay" onClick={cerrarModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{modoEdicion ? 'Editar Rutina' : 'Nueva Rutina'}</h2>
                <button onClick={cerrarModal} className="modal-close">✕</button>
              </div>

              <form onSubmit={handleSubmit} className="modal-form">
                {/* Nombre */}
                <div className="form-group">
                  <label htmlFor="nombre">Nombre de la rutina *</label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Ej: Full Body Principiante"
                    required
                  />
                </div>

                {/* Descripción */}
                <div className="form-group">
                  <label htmlFor="descripcion">Descripción *</label>
                  <textarea
                    id="descripcion"
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Describe los objetivos de esta rutina..."
                    rows="3"
                    required
                  ></textarea>
                </div>

                {/* Nivel y Objetivo */}
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="nivel">Nivel *</label>
                    <select
                      id="nivel"
                      name="nivel"
                      value={formData.nivel}
                      onChange={handleChange}
                      className="input-field"
                      required
                    >
                      <option value="Principiante">Principiante</option>
                      <option value="Intermedio">Intermedio</option>
                      <option value="Avanzado">Avanzado</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="objetivo">Objetivo *</label>
                    <input
                      type="text"
                      id="objetivo"
                      name="objetivo"
                      value={formData.objetivo}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="Ej: Hipertrofia"
                      required
                    />
                  </div>
                </div>

                {/* Días y Duración */}
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="diasPorSemana">Días por semana *</label>
                    <input
                      type="number"
                      id="diasPorSemana"
                      name="diasPorSemana"
                      value={formData.diasPorSemana}
                      onChange={handleChange}
                      className="input-field"
                      min="1"
                      max="7"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="duracionMinutos">Duración (minutos) *</label>
                    <input
                      type="number"
                      id="duracionMinutos"
                      name="duracionMinutos"
                      value={formData.duracionMinutos}
                      onChange={handleChange}
                      className="input-field"
                      min="1"
                      required
                    />
                  </div>
                </div>

                {/* Ejercicios */}
                <div className="form-group">
                  <label>Ejercicios</label>
                  <div className="ejercicios-input">
                    <input
                      type="text"
                      value={nuevoEjercicio}
                      onChange={(e) => setNuevoEjercicio(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), agregarEjercicio())}
                      className="input-field"
                      placeholder="Ej: Sentadilla con Barra"
                    />
                    <button
                      type="button"
                      onClick={agregarEjercicio}
                      className="btn btn-secondary"
                    >
                      ➕ Añadir
                    </button>
                  </div>

                  {formData.ejercicios.length > 0 && (
                    <div className="ejercicios-lista">
                      {formData.ejercicios.map((ejercicio, index) => (
                        <div key={index} className="ejercicio-item">
                          <span>{index + 1}. {ejercicio}</span>
                          <button
                            type="button"
                            onClick={() => eliminarEjercicio(index)}
                            className="btn-eliminar-ejercicio"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Estado activa */}
                <div className="form-group checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      name="activa"
                      checked={formData.activa}
                      onChange={handleChange}
                    />
                    <span>Marcar rutina como activa</span>
                  </label>
                </div>

                {/* Botones */}
                <div className="modal-footer">
                  <button
                    type="button"
                    onClick={cerrarModal}
                    className="btn btn-secondary"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? 'Guardando...' : (modoEdicion ? 'Actualizar' : 'Crear Rutina')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}