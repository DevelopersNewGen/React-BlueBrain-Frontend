import { useState } from 'react'
import { addTeacherToSubject as apiAddTeacherToSubject } from '../../services/api'

export const useSubjectAddTeacher = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [data, setData] = useState(null)

  const addTeacher = async (sid, teacherId) => {
    setLoading(true)
    setError(null)
    setSuccess(false)
    try {
      const response = await apiAddTeacherToSubject(sid, { teacherId })
      if (response.error) {
        const msg =
          response.e?.response?.data?.message ||
          'Error al agregar profesor a la materia'
        setError(msg)
        return { error: true, message: msg }
      }
      setData(response.data)
      setSuccess(true)
      return { error: false, data: response.data }
    } catch (err) {
      setError('Error inesperado al agregar profesor a la materia')
      return {
        error: true,
        message: 'Error inesperado al agregar profesor a la materia'
      }
    } finally {
      setLoading(false)
    }
  }

  return {
    addTeacher,
    loading,
    error,
    success,
    data
  }
}