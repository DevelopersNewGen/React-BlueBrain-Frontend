import { useState } from 'react'
import { requestTutor } from '../../services/api'

export const useApplicationRequest = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const submitApplication = async (applicationData) => {
    try {
      setLoading(true)
      setError(null)
      setSuccess(false)

      const formData = new FormData()
      formData.append('subject', applicationData.subject)
      formData.append('description', applicationData.description)
      formData.append('zoomAccount', applicationData.zoomAccount || 'No especificado')
      
      if (applicationData.evidence) {
        formData.append('evidence', applicationData.evidence)
      }

      const result = await requestTutor(formData)

      if (result.success) {
        setSuccess(true)
        return { success: true, data: result }
      } else {
        setError(result.msg || 'Error al enviar la solicitud')
        return { success: false, error: result.msg }
      }
    } catch (err) {
      console.error('Error en submitApplication:', err)
      let errorMessage = 'Error al enviar la solicitud'
      
      if (err.response?.status === 404) {
        errorMessage = 'Error 404: La ruta del servidor no está disponible. Verifica que el backend esté configurado correctamente.'
      } else if (err.response?.data?.msg) {
        errorMessage = err.response.data.msg
      } else if (err.message) {
        errorMessage = err.message
      }
      
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  const resetState = () => {
    setError(null)
    setSuccess(false)
    setLoading(false)
  }

  return {
    submitApplication,
    loading,
    error,
    success,
    resetState
  }
}

export default useApplicationRequest
