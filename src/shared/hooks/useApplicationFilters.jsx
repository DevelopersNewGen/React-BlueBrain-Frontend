import { useState, useEffect } from 'react'
import { 
  getApplicationsByUser, 
  getApplicationsBySubject
} from '../../services/api'

export const useApplicationFilters = () => {
  const [userApplications, setUserApplications] = useState([])
  const [subjectApplications, setSubjectApplications] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchApplicationsByUser = async (userId) => {
    if (!userId) return

    setLoading(true)
    setError(null)
    
    try {
      const response = await getApplicationsByUser(userId)
      
      if (response.success) {
        setUserApplications(response.applications || [])
      } else if (response.error && response.e?.response?.status === 404) {
        setUserApplications([])
        setError(null)
      } else {
        setError('Error al cargar las aplicaciones del usuario')
        setUserApplications([])
      }
    } catch (err) {
      setError('Error de conexión al obtener las aplicaciones del usuario')
      setUserApplications([])
      console.error('Error fetching user applications:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchApplicationsBySubject = async (subjectId) => {
    if (!subjectId) return

    setLoading(true)
    setError(null)
    
    try {
      const response = await getApplicationsBySubject(subjectId)
      
      if (response.success) {
        setSubjectApplications(response.applications || [])
      } else if (response.error && response.e?.response?.status === 404) {
        setSubjectApplications([])
        setError(null)
      } else {
        setError('Error al cargar las aplicaciones de la materia')
        setSubjectApplications([])
      }
    } catch (err) {
      setError('Error de conexión al obtener las aplicaciones de la materia')
      setSubjectApplications([])
      console.error('Error fetching subject applications:', err)
    } finally {
      setLoading(false)
    }
  }

  const clearUserApplications = () => {
    setUserApplications([])
    setError(null)
  }

  const clearSubjectApplications = () => {
    setSubjectApplications([])
    setError(null)
  }

  const clearError = () => {
    setError(null)
  }

  return {
    // Estados
    userApplications,
    subjectApplications,
    loading,
    error,
    
    // Funciones
    fetchApplicationsByUser,
    fetchApplicationsBySubject,
    
    // Limpiezas
    clearUserApplications,
    clearSubjectApplications,
    clearError
  }
}
