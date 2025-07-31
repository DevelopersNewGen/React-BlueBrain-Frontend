import React, { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Avatar,
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar
} from '@mui/material'
import {
  Visibility,
  CheckCircle,
  Cancel,
  Schedule,
  Check,
  Close,
  ExpandMore
} from '@mui/icons-material'
import { useApplications } from '../../shared/hooks/useApplications'

const ApplicationsList = () => {
  const {
    applications,
    loading,
    error,
    updating,
    refreshApplications,
    updateStatus,
    resetAcceptState
  } = useApplications()

  const [descriptionDialog, setDescriptionDialog] = useState({ open: false, content: '', applicant: '' })
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'success'
      case 'rejected':
        return 'error'
      case 'pending':
      default:
        return 'warning'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle />
      case 'rejected':
        return <Cancel />
      case 'pending':
      default:
        return <Schedule />
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'approved':
        return 'Aprobada'
      case 'rejected':
        return 'Rechazada'
      case 'pending':
      default:
        return 'Pendiente'
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

  const handleViewDescription = (description, applicantName) => {
    setDescriptionDialog({
      open: true,
      content: description,
      applicant: applicantName
    })
  }

  const handleCloseDescription = () => {
    setDescriptionDialog({ open: false, content: '', applicant: '' })
  }

  const handleDirectAction = async (applicationId, action) => {
    console.log(`Direct action: ${action} for application:`, applicationId)
    console.log('Full application object:', applications.find(app => (app.aid || app._id) === applicationId))

    if (!applicationId) {
      console.error('No application ID provided')
      setSnackbar({
        open: true,
        message: 'Error: ID de aplicación no válido',
        severity: 'error'
      })
      return
    }

    try {
      const result = await updateStatus(applicationId, action, '')

      if (result.success) {
        setSnackbar({
          open: true,
          message: `Aplicación ${action === 'approved' ? 'aprobada' : 'rechazada'} exitosamente`,
          severity: 'success'
        })
        await refreshApplications()
      } else {
        setSnackbar({
          open: true,
          message: result.error || `Error al ${action === 'approved' ? 'aprobar' : 'rechazar'} la aplicación`,
          severity: 'error'
        })
      }
    } catch (error) {
      console.error('Error in direct action:', error)
      setSnackbar({
        open: true,
        message: 'Error de conexión',
        severity: 'error'
      })
    }
  }

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false })
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
        <Typography variant="body1" sx={{ ml: 2 }}>
          Cargando aplicaciones...
        </Typography>
      </Box>
    )
  }

  if (error) {
    return (
      <Alert
        severity="error"
        action={
          <Button color="inherit" size="small" onClick={refreshApplications}>
            Reintentar
          </Button>
        }
      >
        {error}
      </Alert>
    )
  }

  if (applications.length === 0) {
    return (
      <Box textAlign="center" py={4}>
        <Typography variant="h6" color="text.secondary">
          No hay aplicaciones registradas
        </Typography>
        <Button
          variant="outlined"
          onClick={refreshApplications}
          sx={{ mt: 2 }}
        >
          Actualizar
        </Button>
      </Box>
    )
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" component="h2">
          Aplicaciones de Tutoría
        </Typography>
        <Button
          variant="outlined"
          onClick={refreshApplications}
          disabled={loading}
        >
          Actualizar
        </Button>
      </Box>

      <TableContainer component={Paper} elevation={2}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'primary.main' }}>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                Aplicante
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                Materia
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                Descripción
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                Estado
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                Fecha
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                Evidencia
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                Acciones
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {applications.map((application) => (
              <TableRow
                key={application.aid || application._id || Math.random()}
                hover
                sx={{
                  cursor: 'pointer',
                  transition: 'background-color 0.3s ease, color 0.3s ease',
                  '&:nth-of-type(odd)': { backgroundColor: 'action.hover' },
                  '&:hover': {
                    backgroundColor: 'primary.blue',
                    color: 'common.blue',
                    '& .MuiTableCell-root': {
                      color: 'common.blue',
                    },
                    '& .MuiChip-root': {
                      borderColor: 'common.blue',
                      color: 'primary.blue',
                      backgroundColor: 'common.blue',
                      fontWeight: 'bold',
                    },
                    '& .zoom-icon': {
                      color: 'primary.blue',
                      backgroundColor: 'common.blue',
                      transform: 'scale(1.1)',
                      transition: 'transform 0.3s ease, background-color 0.3s ease, color 0.3s ease',
                      '&:hover': {
                        backgroundColor: 'primary.dark',
                        color: 'common.blue',
                        transform: 'scale(1.2)',
                      },
                    },
                  },
                }}
              >
                <TableCell>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Avatar
                      src={application.applicantId?.profilePicture}
                      sx={{ width: 40, height: 40 }}
                    >
                      {application.applicantId?.name?.charAt(0).toUpperCase()}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        {application.applicantId?.name || 'N/A'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {application.applicantId?.email || 'N/A'}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>

                <TableCell>
                  <Box>
                    <Typography variant="body2" fontWeight="medium">
                      {application.subject?.grade || 'N/A'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {application.subject?.description || 'N/A'}
                    </Typography>
                  </Box>
                </TableCell>

                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography
                      variant="body2"
                      sx={{
                        maxWidth: 150,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {application.description || 'Sin descripción'}
                    </Typography>
                    {application.description && (
                      <Tooltip title="Ver descripción completa">
                        <IconButton
                          size="small"
                          onClick={() => handleViewDescription(application.description, application.applicantId?.name)}
                        >
                          <ExpandMore />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                </TableCell>

                <TableCell>
                  <Chip
                    icon={getStatusIcon(application.status)}
                    label={getStatusText(application.status)}
                    color={getStatusColor(application.status)}
                    variant="outlined"
                    size="small"
                  />
                </TableCell>

                <TableCell>
                  <Typography variant="body2">
                    {formatDate(application.requestHour || application.createdAt)}
                  </Typography>
                </TableCell>

                <TableCell>
                  {application.evidence ? (
                    <Tooltip title="Ver evidencia">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleViewEvidence(application.evidence)}
                         className="zoom-icon"
                      >
                        <Visibility />
                      </IconButton>
                    </Tooltip>
                  ) : (
                    <Typography variant="caption" color="text.secondary">
                      Sin evidencia
                    </Typography>
                  )}
                </TableCell>

                <TableCell>
                  {application.status === 'pending' && (
                    <Box display="flex" gap={1}>
                      <Tooltip title="Aprobar aplicación">
                        <IconButton
                          size="small"
                          color="success"
                          onClick={() => handleDirectAction(application.aid || application._id, 'approved')}
                          disabled={updating}
                          className="zoom-icon"
                        >
                          <Check />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Rechazar aplicación">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDirectAction(application.aid || application._id, 'rejected')}
                          disabled={updating}
                          className="zoom-icon"
                        >
                          <Close />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  )}
                  {application.status !== 'pending' && (
                    <Typography variant="caption" color="text.secondary">
                      {application.status === 'approved' ? 'Aprobada' : 'Rechazada'}
                    </Typography>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={descriptionDialog.open}
        onClose={handleCloseDescription}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Descripción de {descriptionDialog.applicant}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
            {descriptionDialog.content}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDescription}>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default ApplicationsList
