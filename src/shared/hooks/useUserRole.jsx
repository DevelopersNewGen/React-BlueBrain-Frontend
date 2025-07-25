import { useState, useEffect, useCallback } from 'react'
import { getUserRoleByUid } from '../../services/api'

export const useUserRole = (uid) => {
  const [role, setRole] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchRole = useCallback(async () => {
    if (!uid) return
    setLoading(true)
    setError(null)
    try {
      const res = await getUserRoleByUid(uid)
      if (!res.success) {
        setError(res.message || 'Error al obtener rol de usuario')
      } else {
        setRole(res.data?.role ?? null)
      }
    } catch {
      setError('Error inesperado al obtener rol de usuario')
    } finally {
      setLoading(false)
    }
  }, [uid])

  useEffect(() => {
    fetchRole()
  }, [fetchRole])

  return { role, loading, error, refetch: fetchRole }
}