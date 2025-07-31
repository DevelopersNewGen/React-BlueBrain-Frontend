import { useState } from 'react'
import { updateSubject } from '../../services/api'

export const useSubjectPut = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [subject, setSubject] = useState(null)
  const [success, setSuccess] = useState(false)

  const putSubject = async (sid, subjectData) => {
    
    setLoading(true)
    setError(null)
    setSuccess(false)
    try {
      const response = await updateSubject(sid, subjectData)
      
      if (response.error) {
        const msg =
          response.e?.response?.data?.message || 'Error al actualizar la materia'
        setError(msg)
        return { error: true, message: msg }
      }
      
      setSubject(response.data)
      setSuccess(true)
      return { error: false, data: response.data }
    } catch (err) {
      console.error('Error updating subject:', err)
      setError('Error inesperado al actualizar la materia')
      return { error: true, message: 'Error inesperado al actualizar la materia' }
    } finally {
      setLoading(false)
    }
  }

  const resetSuccess = () => {
    setSuccess(false)
  }

  return {
    putSubject,
    loading,
    error,
    success,
    subject,
    resetSuccess
  }
}