import { useState } from 'react'
import { updateSubject } from '../../services/api'

export const useSubjectPut = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [subject, setSubject] = useState(null)
  const [success, setSuccess] = useState(false)

  const putSubject = async (sid, subjectData) => {
    console.log('useSubjectPut: Starting update for sid:', sid)
    console.log('useSubjectPut: Data to update:', subjectData)
    
    setLoading(true)
    setError(null)
    setSuccess(false)
    try {
      console.log('Sending PUT request to backend for subject:', sid)
      const response = await updateSubject(sid, subjectData)
      console.log('Backend response:', response)
      
      if (response.error) {
        console.log('Backend returned error:', response)
        const msg =
          response.e?.response?.data?.message || 'Error al actualizar la materia'
        setError(msg)
        return { error: true, message: msg }
      }
      
      console.log('Subject updated successfully, response data:', response.data)
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