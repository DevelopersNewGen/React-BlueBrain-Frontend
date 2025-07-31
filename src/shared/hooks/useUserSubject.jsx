import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getSubjectUsers } from '../../services/api'

const useSubjectUsers = () => {
  const { subjectId } = useParams()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!subjectId) return

    setLoading(true)
    setError(null)

    getSubjectUsers(subjectId)
      .then(res => {
        if (res.error) {
          setError(res.e || 'Error al cargar usuarios')
        } else {
          setUsers(res.users || [])
        }
      })
      .catch(e => setError(e.message || 'Error inesperado'))
      .finally(() => setLoading(false))
  }, [subjectId])

  return { users, loading, error }
}

export default useSubjectUsers