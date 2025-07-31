import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Grid,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  CircularProgress,
  Container,
  Divider,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  School,
  Person,
  Schedule,
  Check,
  Close,
  CalendarToday,
  AccessTime,
  Description,
  Email,
  Phone,
  Visibility,
  CheckCircle,
  Cancel
} from '@mui/icons-material';
import toast from 'react-hot-toast';
import { usePrivateTutorials } from '../../shared/hooks/usePrivateTutorials';
import useLogin from '../../shared/hooks/useLogin';

export const TutorialRequest = () => {
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const [hasLoaded, setHasLoaded] = useState(false);

  const { userWithRole } = useLogin();
  const { 
    privateTutorials, 
    loading, 
    error, 
    refetch: refetchPrivate,
    acceptPrivateTutorialRequest,
    rejectPrivateTutorialRequest 
  } = usePrivateTutorials();

  useEffect(() => {
    if (userWithRole && 
        (userWithRole.role === 'TUTOR_ROLE' || userWithRole.role === 'TEACHER_ROLE') && 
        !hasLoaded && 
        !loading) {
      setHasLoaded(true);
      refetchPrivate();
    }
  }, [userWithRole, hasLoaded, loading, refetchPrivate]);

  const pendingRequests = privateTutorials.filter(tutorial => {
    const isForCurrentTutor = tutorial.tutor?.name === userWithRole?.name;
    const isPending = tutorial.status === 'PENDING';
    return isForCurrentTutor && isPending;
  });

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    setDialogOpen(true);
    setResponseMessage('');
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedRequest(null);
    setResponseMessage('');
  };

  const handleAcceptRequest = async () => {
    if (!selectedRequest) return;


    setActionLoading(true);
    try {
      const response = await acceptPrivateTutorialRequest(selectedRequest.ptid, {
        message: responseMessage
      });

      if (response.success) {
        toast.success('Solicitud aceptada exitosamente');
        handleCloseDialog();
        setHasLoaded(false);
        refetchPrivate();
      } else {
        toast.error('Error al aceptar la solicitud');
      }
    } catch (error) {
      toast.error('Error de conexión al aceptar la solicitud' + error.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectRequest = async () => {
    if (!selectedRequest) return;

    setActionLoading(true);
    try {
      const response = await rejectPrivateTutorialRequest(selectedRequest._id, {
        message: responseMessage || 'Solicitud rechazada'
      });

      if (response.success) {
        toast.success('Solicitud rechazada');
        handleCloseDialog();
        setHasLoaded(false);
        refetchPrivate();
      } else {
        toast.error('Error al rechazar la solicitud');
      }
    } catch (error) {
      toast.error('Error de conexión al rechazar la solicitud' + error.message);
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No especificada';
    try {
      return new Date(dateString).toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Fecha inválida';
    }
  };

  if (!userWithRole || (userWithRole.role !== 'TUTOR_ROLE' && userWithRole.role !== 'TEACHER_ROLE')) {
    return (
      <Container maxWidth="lg">
        <Alert severity="warning">
          Solo los tutores y profesores pueden acceder a esta sección.
        </Alert>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
          <Typography variant="body1" sx={{ ml: 2 }}>
            Cargando solicitudes de tutorías...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Alert severity="error">
          Error al cargar las solicitudes: {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Box mb={4}>
        <Typography variant="h4" component="h1" gutterBottom color="primary.main">
          Solicitudes de Tutorías Privadas
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Gestiona las solicitudes de tutorías privadas que los estudiantes han enviado
        </Typography>
      </Box>

      {pendingRequests.length === 0 ? (
        <Box textAlign="center" py={6}>
          <School sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" color="text.secondary" gutterBottom>
            No hay solicitudes pendientes
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Cuando los estudiantes soliciten tutorías privadas contigo, aparecerán aquí
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {pendingRequests.map((request) => (
            <Grid item xs={12} md={6} lg={4} key={request._id}>
              <Card 
                elevation={2} 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    elevation: 4,
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box display="flex" alignItems="center" gap={2} mb={2}>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      <Person />
                    </Avatar>
                    <Box flexGrow={1}>
                      <Typography variant="h6" component="h3">
                        {request.student?.name || 'Estudiante'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {request.student?.email}
                      </Typography>
                    </Box>
                    <Chip 
                      label="Pendiente" 
                      color="warning" 
                      size="small" 
                    />
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Box mb={2}>
                    <Typography variant="subtitle2" color="primary.main" gutterBottom>
                      <School sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle' }} />
                      {request.subject?.name || 'Materia no especificada'}
                    </Typography>
                    <Typography variant="body1" fontWeight="medium" gutterBottom>
                      {request.topic || 'Sin tema específico'}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}
                    >
                      {request.description || 'Sin descripción'}
                    </Typography>
                  </Box>

                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <CalendarToday fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(request.scheduledDate)}
                    </Typography>
                  </Box>

                  <Box display="flex" alignItems="center" gap={1} mb={2}>
                    <AccessTime fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      {request.duration || 60} minutos • {request.modalidad || 'Virtual'}
                    </Typography>
                  </Box>
                </CardContent>

                <CardActions sx={{ p: 2, pt: 0, justifyContent: 'space-between' }}>
                  <Button
                    variant="outlined"
                    startIcon={<Visibility />}
                    onClick={() => handleViewDetails(request)}
                    size="small"
                  >
                    Ver Detalles
                  </Button>
                  <Box display="flex" gap={1}>
                    <Tooltip title="Aceptar solicitud">
                      <IconButton 
                        color="success" 
                        onClick={() => handleViewDetails(request)}
                        size="small"
                      >
                        <CheckCircle />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Rechazar solicitud">
                      <IconButton 
                        color="error" 
                        onClick={() => handleViewDetails(request)}
                        size="small"
                      >
                        <Cancel />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog 
        open={dialogOpen} 
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2,
          background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
          color: 'white'
        }}>
          <School />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Detalles de la Solicitud de Tutoría
          </Typography>
          <IconButton 
            color="inherit" 
            onClick={handleCloseDialog}
            sx={{ p: 1 }}
          >
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 3 }}>
          {selectedRequest && (
            <Grid container spacing={3}>
              {/* Información del estudiante */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom color="primary.main">
                  Información del Estudiante
                </Typography>
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  <Avatar sx={{ width: 60, height: 60, bgcolor: 'primary.main' }}>
                    <Person fontSize="large" />
                  </Avatar>
                  <Box>
                    <Typography variant="h6">{selectedRequest.student?.name}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Email fontSize="small" />
                      {selectedRequest.student?.email}
                    </Typography>
                    {selectedRequest.student?.phone && (
                      <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Phone fontSize="small" />
                        {selectedRequest.student.phone}
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Grid>

              {/* Detalles de la tutoría */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom color="primary.main">
                  Detalles de la Tutoría
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">Materia</Typography>
                    <Typography variant="body1">{selectedRequest.subject?.name}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">Modalidad</Typography>
                    <Typography variant="body1">{selectedRequest.modalidad}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">Tema</Typography>
                    <Typography variant="body1">{selectedRequest.topic}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">Descripción</Typography>
                    <Typography variant="body1">{selectedRequest.description}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">Fecha y Hora</Typography>
                    <Typography variant="body1">{formatDate(selectedRequest.scheduledDate)}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">Duración</Typography>
                    <Typography variant="body1">{selectedRequest.duration} minutos</Typography>
                  </Grid>
                  {selectedRequest.notes && (
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="text.secondary">Notas Adicionales</Typography>
                      <Typography variant="body1">{selectedRequest.notes}</Typography>
                    </Grid>
                  )}
                </Grid>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom color="primary.main">
                  Mensaje de Respuesta (Opcional)
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  placeholder="Escribe un mensaje para el estudiante (horarios disponibles, preparación necesaria, etc.)"
                  value={responseMessage}
                  onChange={(e) => setResponseMessage(e.target.value)}
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 0, gap: 1 }}>
          <Button onClick={handleCloseDialog} variant="outlined">
            Cancelar
          </Button>
          <Button
            onClick={handleRejectRequest}
            variant="contained"
            color="error"
            disabled={actionLoading}
            startIcon={actionLoading ? <CircularProgress size={20} /> : <Cancel />}
          >
            Rechazar
          </Button>
          <Button
            onClick={handleAcceptRequest}
            variant="contained"
            color="success"
            disabled={actionLoading}
            startIcon={actionLoading ? <CircularProgress size={20} /> : <CheckCircle />}
          >
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};
