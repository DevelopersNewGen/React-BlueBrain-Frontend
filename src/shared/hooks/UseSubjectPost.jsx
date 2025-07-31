import { useState } from 'react'
import { createSubject } from '../../services/api'

export const useSubjectPost = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [subject, setSubject] = useState(null)
  const [success, setSuccess] = useState(false)

  const postSubject = async formData => {
    setLoading(true)
    setError(null)
    setSuccess(false)
    try {
      const response = await createSubject(formData)
      if (response.error) {
        const msg =
          response.e?.response?.data?.message || 'Error al crear la materia'
        setError(msg)
        return { error: true, message: msg }
      }
      setSubject(response.data)
      setSuccess(true)
      return { error: false, data: response.data }
    } catch (err) {
      setError('Error inesperado al crear la materia')
      return { error: true, message: 'Error inesperado al crear la materia' }
    } finally {
      setLoading(false)
    }
  }

  return {
    postSubject,
    loading,
    error,
    success,
    subject
  }
}