/const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

/**
 * API SERVICE
 * Servicio para peticiones HTTP usando FETCH nativo
 */

// LOGIN
export const login = async (credentials) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Error en el login')
    }

    return data
  } catch (error) {
    throw error
  }
}

// OBTENER TODAS LAS RUTINAS
export const obtenerRutinas = async () => {
  try {
    const response = await fetch(`${API_URL}/rutinas`)
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Error al obtener rutinas')
    }

    return data
  } catch (error) {
    throw error
  }
}

// OBTENER RUTINA POR ID
export const obtenerRutinaPorId = async (id) => {
  try {
    const response = await fetch(`${API_URL}/rutinas/${id}`)
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Error al obtener rutina')
    }

    return data
  } catch (error) {
    throw error
  }
}

// CREAR NUEVA RUTINA
export const crearRutina = async (rutina) => {
  try {
    const response = await fetch(`${API_URL}/rutinas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(rutina)
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Error al crear rutina')
    }

    return data
  } catch (error) {
    throw error
  }
}

// ACTUALIZAR RUTINA
export const actualizarRutina = async (id, rutina) => {
  try {
    const response = await fetch(`${API_URL}/rutinas/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(rutina)
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Error al actualizar rutina')
    }

    return data
  } catch (error) {
    throw error
  }
}

// ELIMINAR RUTINA
export const eliminarRutina = async (id) => {
  try {
    const response = await fetch(`${API_URL}/rutinas/${id}`, {
      method: 'DELETE'
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Error al eliminar rutina')
    }

    return data
  } catch (error) {
    throw error
  }
}