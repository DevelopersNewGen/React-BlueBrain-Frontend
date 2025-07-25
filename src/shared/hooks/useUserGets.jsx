import { useState, useEffect, useCallback } from 'react'
import { getAllUsers } from '../../services/api'

export const useUserGets = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await getAllUsers()
      console.log('getAllUsers →', res)
      if (!res.success) {
        setError(res.message || 'Error al cargar usuarios')
        setUsers([])
      } else {
        setUsers(res.data)
      }
    } catch {
      setError('Error inesperado al cargar usuarios')
      setUsers([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  return { users, loading, error, refetch: fetchUsers }
}