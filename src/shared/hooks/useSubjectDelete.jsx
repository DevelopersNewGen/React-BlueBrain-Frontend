import { useState } from 'react'
import { deleteSubject } from '../../services/api'

export const useSubjectDelete = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const removeSubject = async (sid) => {
    setLoading(true)
    setError(null)
    setSuccess(false)
    try {
      const response = await deleteSubject(sid)
      if (response.error) {
        const msg = response.e?.response?.data?.message || 'Error al eliminar la materia'
        setError(msg)
        return { error: true, message: msg }
      }
      setSuccess(true)
      return { error: false }
    } catch (err) {
      setError('Error inesperado al eliminar la materia')
      return { error: true, message: 'Error inesperado al eliminar la materia' }
    } finally {
      setLoading(false)
    }
  }

  return {
    removeSubject,
    loading,
    error,
    success
  }
}