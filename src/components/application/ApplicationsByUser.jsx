import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Avatar,
  CircularProgress,
  Alert,
  Button,
  TextField,
  Autocomplete,
  Grid,
  Paper,
  Divider
} from '@mui/material'
import {
  CheckCircle,
  Cancel,
  Schedule,
  Person,
  Description,
  CalendarToday,
  Visibility
} from '@mui/icons-material'
import { useApplicationFilters } from '../../shared/hooks/useApplicationFilters'
import { getAllUsers } from '../../services/api'

const ApplicationsByUser = () => {
  const {
    userApplications,
    loading,
    error,
    fetchApplicationsByUser,
    clearUserApplications,
    clearError
  } = useApplicationFilters()

  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [loadingUsers, setLoadingUsers] = useState(false)

  // Cargar usuarios al montar el componente
  useEffect(() => {
    const loadUsers = async () => {
      setLoadingUsers(true)
      try {
        const response = await getAllUsers()
        if (response.success) {
          setUsers(response.data || [])
        }
      } catch (err) {
        console.error('Error loading users:', err)
      } finally {
        setLoadingUsers(false)
      }
    }

    loadUsers()
  }, [])

  const handleUserSelect = (event, user) => {
    setSelectedUser(user)
    clearError()
    
    if (user) {
      fetchApplicationsByUser(user.uid || user._id)
    } else {
      clearUserApplications()
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'success'
      case 'rejected': return 'error'
      case 'pending':
      default: return 'warning'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return <CheckCircle />
      case 'rejected': return <Cancel />
      case 'pending':
      default: return <Schedule />
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'approved': return 'Aprobada'
      case 'rejected': return 'Rechazada'
      case 'pending':
      default: return 'Pendiente'
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleViewEvidence = (evidenceUrl) => {
    if (evidenceUrl) {
      window.open(evidenceUrl, '_blank')
    }
  }

  return (
    <Box>
      <Typography variant="h6" component="h3" gutterBottom>
        Aplicaciones por Usuario
      </Typography>

      {/* Selector de usuario */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Autocomplete
          options={users}
          getOptionLabel={(user) => `${user.name} (${user.email})`}
          value={selectedUser}
          onChange={handleUserSelect}
          loading={loadingUsers}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Seleccionar usuario"
              placeholder="Buscar por nombre o email..."
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {loadingUsers ? <CircularProgress color="inherit" size={20} /> : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
          renderOption={(props, user) => (
            <Box component="li" {...props}>
              <Avatar 
                src={user.profilePicture} 
                sx={{ width: 32, height: 32, mr: 2 }}
              >
                {user.name?.charAt(0).toUpperCase()}
              </Avatar>
              <Box>
                <Typography variant="body2" fontWeight="medium">
                  {user.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {user.email} • {user.role}
                </Typography>
              </Box>
            </Box>
          )}
        />
      </Paper>

      {/* Resultados */}
      {loading && (
        <Box display="flex" justifyContent="center" alignItems="center" py={4}>
          <CircularProgress />
          <Typography variant="body1" sx={{ ml: 2 }}>
            Cargando aplicaciones...
          </Typography>
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {selectedUser && userApplications.length === 0 && !loading && !error && (
        <Alert severity="info" sx={{ mb: 2 }}>
          {selectedUser.name} no ha aplicado a ningún curso.
        </Alert>
      )}

      {userApplications.length > 0 && (
        <Grid container spacing={2}>
          {userApplications.map((application) => (
            <Grid item xs={12} md={6} key={application.aid || application._id}>
              <Card elevation={2}>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Typography variant="h6" component="h4">
                      {application.subject?.grade || 'Materia no disponible'}
                    </Typography>
                    <Chip
                      icon={getStatusIcon(application.status)}
                      label={getStatusText(application.status)}
                      color={getStatusColor(application.status)}
                      variant="outlined"
                      size="small"
                    />
                  </Box>

                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {application.subject?.description || 'Sin descripción'}
                  </Typography>

                  <Divider sx={{ my: 2 }} />

                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <Description fontSize="small" color="action" />
                    <Typography variant="body2" fontWeight="medium">
                      Descripción:
                    </Typography>
                  </Box>
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ 
                      mb: 2,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical'
                    }}
                  >
                    {application.description || 'Sin descripción'}
                  </Typography>

                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <CalendarToday fontSize="small" color="action" />
                    <Typography variant="caption" color="text.secondary">
                      {formatDate(application.requestHour || application.createdAt)}
                    </Typography>
                  </Box>

                  {application.evidence && (
                    <Button
                      size="small"
                      startIcon={<Visibility />}
                      onClick={() => handleViewEvidence(application.evidence)}
                      sx={{ mt: 1 }}
                    >
                      Ver evidencia
                    </Button>
                  )}

                  {application.responseMessage && (
                    <Box sx={{ mt: 2, p: 1, backgroundColor: 'action.hover', borderRadius: 1 }}>
                      <Typography variant="caption" fontWeight="medium">
                        Respuesta:
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {application.responseMessage}
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  )
}

export default ApplicationsByUser
