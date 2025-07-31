import { useState, useEffect } from 'react'
import { getAllApplications } from '../../services/api'
import { useApplicationAccept } from './useApplicationAccept'

export const useApplications = () => {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  const { 
    loading: updating, 
    approveApplication, 
    rejectApplication,
    resetState: resetAcceptState
  } = useApplicationAccept()

  const fetchApplications = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await getAllApplications()
      
      if (response.success) {
        setApplications(response.applications || [])
      } else {
        setError('Error al cargar las aplicaciones')
      }
    } catch (err) {
      setError('Error de conexión al obtener las aplicaciones')
      console.error('Error fetching applications:', err)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (applicationId, status, responseMessage = '') => {
    let result
    
    if (status === 'approved') {
      result = await approveApplication(applicationId, responseMessage)
    } else {
      result = await rejectApplication(applicationId, responseMessage)
    }
    
    if (result.success) {
      // Actualizar la aplicación en el estado local
      setApplications(prev => 
        prev.map(app => 
          (app._id === applicationId || app.aid === applicationId)
            ? { ...app, status, responseMessage }
            : app
        )
      )
    }
    
    return result
  }

  const refreshApplications = () => {
    fetchApplications()
  }

  useEffect(() => {
    fetchApplications()
  }, [])

  return {
    applications,
    loading,
    error,
    updating,
    refreshApplications,
    updateStatus,
    resetAcceptState
  }
}
