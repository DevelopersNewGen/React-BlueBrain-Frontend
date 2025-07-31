import { useState } from 'react'
import { updateApplicationStatus } from '../../services/api'

export const useApplicationAccept = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const updateStatus = async (applicationId, status, responseMessage = '') => {
    setLoading(true)
    setError(null)
    setSuccess(false)
    
    console.log('Hook: Updating status with:', { applicationId, status, responseMessage });
    
    try {
      const response = await updateApplicationStatus(applicationId, status, responseMessage)
      
      console.log('Hook: Response received:', response);
      
      if (response.error) {
        const errorMessage = response.message || response.e?.response?.data?.msg || 'Error al actualizar el estado de la aplicación'
        setError(errorMessage)
        return { 
          success: false, 
          error: errorMessage 
        }
      }
      
      if (response.success) {
        setSuccess(true)
        return { 
          success: true, 
          message: `Aplicación ${status === 'approved' ? 'aprobada' : 'rechazada'} exitosamente`,
          data: response.updatedApplication
        }
      } else {
        setError(response.msg || 'Error al actualizar el estado de la aplicación')
        return { 
          success: false, 
          error: response.msg || 'Error al actualizar el estado de la aplicación' 
        }
      }
    } catch (err) {
      console.error('Hook: Catch error:', err);
      const errorMessage = err.response?.data?.msg || err.message || 'Error de conexión al actualizar la aplicación'
      setError(errorMessage)
      return { 
        success: false, 
        error: errorMessage 
      }
    } finally {
      setLoading(false)
    }
  }

  const approveApplication = async (applicationId, responseMessage = '') => {
    return await updateStatus(applicationId, 'approved', responseMessage)
  }

  const rejectApplication = async (applicationId, responseMessage = '') => {
    return await updateStatus(applicationId, 'rejected', responseMessage)
  }

  const resetState = () => {
    setError(null)
    setSuccess(false)
    setLoading(false)
  }

  return {
    loading,
    error,
    success,
    updateStatus,
    approveApplication,
    rejectApplication,
    resetState
  }
}
