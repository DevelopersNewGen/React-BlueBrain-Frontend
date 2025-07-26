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
  School,
  Description,
  CalendarToday,
  Visibility,
  Person
} from '@mui/icons-material'
import { useApplicationFilters } from '../../shared/hooks/useApplicationFilters'
import { getAllSubjects } from '../../services/api'

const ApplicationsBySubject = () => {
  const {
    subjectApplications,
    loading,
    error,
    fetchApplicationsBySubject,
    clearSubjectApplications,
    clearError
  } = useApplicationFilters()

  const [subjects, setSubjects] = useState([])
  const [selectedSubject, setSelectedSubject] = useState(null)
  const [loadingSubjects, setLoadingSubjects] = useState(false)

  // Cargar materias al montar el componente
  useEffect(() => {
    const loadSubjects = async () => {
      setLoadingSubjects(true)
      try {
        const response = await getAllSubjects()
        
        // Manejar todas las posibles estructuras de respuesta
        let subjectsData = []
        
        if (response) {
          // Caso 1: response.subjects
          if (response.subjects && Array.isArray(response.subjects)) {
            subjectsData = response.subjects
          }
          // Caso 2: response.data.subjects
          else if (response.data && response.data.subjects && Array.isArray(response.data.subjects)) {
            subjectsData = response.data.subjects
          }
          // Caso 3: response.data directo (si subjects está en data)
          else if (response.data && Array.isArray(response.data)) {
            subjectsData = response.data
          }
          // Caso 4: response es directamente un array
          else if (Array.isArray(response)) {
            subjectsData = response
          }
          // Caso 5: response.success con otra estructura
          else if (response.success && response.data) {
            if (Array.isArray(response.data)) {
              subjectsData = response.data
            } else if (response.data.subjects) {
              subjectsData = response.data.subjects
            }
          }
        }
        
        setSubjects(subjectsData || [])
        
      } catch (err) {
        console.error('Error loading subjects:', err)
        setSubjects([])
      } finally {
        setLoadingSubjects(false)
      }
    }

    loadSubjects()
  }, [])

  const handleSubjectSelect = (event, subject) => {
    setSelectedSubject(subject)
    clearError()
    
    if (subject) {
      // Usar el ID correcto dependiendo de la estructura
      const subjectId = subject._id || subject.sid || subject.id
      
      if (subjectId) {
        fetchApplicationsBySubject(subjectId)
      }
    } else {
      clearSubjectApplications()
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
        Aplicaciones por Materia
      </Typography>

      {/* Selector de materia */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Autocomplete
          options={subjects}
          getOptionLabel={(subject) => {
            return subject ? `${subject.grade || 'Sin grado'} - ${subject.description || 'Sin descripción'}` : ''
          }}
          value={selectedSubject}
          onChange={handleSubjectSelect}
          loading={loadingSubjects}
          noOptionsText={loadingSubjects ? "Cargando materias..." : "No hay materias disponibles"}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Seleccionar materia"
              placeholder="Buscar por grado o descripción..."
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {loadingSubjects ? <CircularProgress color="inherit" size={20} /> : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
          renderOption={(props, subject) => {
            return (
              <Box component="li" {...props}>
                <School sx={{ mr: 2, color: 'primary.main' }} />
                <Box>
                  <Typography variant="body2" fontWeight="medium">
                    {subject.grade || 'Sin grado'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {subject.description || 'Sin descripción'}
                  </Typography>
                </Box>
              </Box>
            )
          }}
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

      {selectedSubject && subjectApplications.length === 0 && !loading && !error && (
        <Alert severity="info" sx={{ mb: 2 }}>
          La materia "{selectedSubject.grade}" no tiene aplicaciones registradas.
        </Alert>
      )}

      {subjectApplications.length > 0 && (
        <Grid container spacing={2}>
          {subjectApplications.map((application) => (
            <Grid item xs={12} md={6} key={application.aid || application._id}>
              <Card elevation={2}>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Avatar 
                        src={application.applicantId?.profilePicture} 
                        sx={{ width: 40, height: 40 }}
                      >
                        {application.applicantId?.name?.charAt(0).toUpperCase() || 'U'}
                      </Avatar>
                      <Box>
                        <Typography variant="h6" component="h4">
                          {application.applicantId?.name || 'Usuario no disponible'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {application.applicantId?.email || 'Email no disponible'}
                        </Typography>
                      </Box>
                    </Box>
                    <Chip
                      icon={getStatusIcon(application.status)}
                      label={getStatusText(application.status)}
                      color={getStatusColor(application.status)}
                      variant="outlined"
                      size="small"
                    />
                  </Box>

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

export default ApplicationsBySubject
