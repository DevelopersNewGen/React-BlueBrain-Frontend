import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Alert,
  CircularProgress,
  Grid,
  Chip,
  Avatar,
  Divider
} from '@mui/material';
import {
  Schedule,
  Person,
  School,
  AccessTime,
  CalendarToday
} from '@mui/icons-material';
import { useTutorials } from '../../shared/hooks/useTutorials';

export const RequestTutorial = ({ open, onClose, tutorial }) => {
  const { requestExistingTutorial, requesting } = useTutorials();
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (open) {
      setSelectedDate('');
      setSelectedTime('');
      setError('');
      setSuccess(false);
    }
  }, [open]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'INCOURSE':
        return 'success';
      case 'COMPLETED':
        return 'info';
      case 'CANCELLED':
        return 'error';
      case 'PENDING':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'INCOURSE':
        return 'En Curso';
      case 'COMPLETED':
        return 'Completada';
      case 'CANCELLED':
        return 'Cancelada';
      case 'PENDING':
        return 'Pendiente';
      default:
        return status;
    }
  };

  const getAccessText = (access) => {
    return access === 'PRIVATE' ? 'Privada' : 'Pública';
  };

  const getAccessColor = (access) => {
    return access === 'PRIVATE' ? 'warning' : 'success';
  };

  const validateTimes = () => {
    if (tutorial.access === 'PRIVATE') {
      if (!selectedDate || !selectedTime) {
        setError('Por favor selecciona fecha y hora para la sesión');
        return false;
      }

      const startDateTime = new Date(`${selectedDate}T${selectedTime}`);
      const now = new Date();

      if (startDateTime <= now) {
        setError('La fecha y hora de inicio debe ser futura');
        return false;
      }

      const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000);

      const tutorialStart = new Date(tutorial?.startTime);
      const tutorialEnd = new Date(tutorial?.endTime);

      if (startDateTime < tutorialStart || endDateTime > tutorialEnd) {
        setError('La sesión debe estar dentro del período de la tutoría');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async () => {
    setError('');

    if (!validateTimes()) {
      return;
    }

    try {
      let requestData = {};

      if (tutorial.access === 'PRIVATE') {
        const startDateTime = new Date(`${selectedDate}T${selectedTime}`);
        const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000);

        requestData = {
          startTime: startDateTime.toISOString(),
          endTime: endDateTime.toISOString()
        };
      } else {
        requestData = {
          startTime: tutorial.startTime,
          endTime: tutorial.endTime
        };
      }

      const result = await requestExistingTutorial(tutorial.tid, requestData);

      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        setError(result.error || 'Error al solicitar la tutoría');
      }
    } catch {
      setError('Error de conexión');
    }
  };

  const handleClose = () => {
    if (!requesting) {
      onClose();
    }
  };

  if (!tutorial) {
    return null;
  }

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { minHeight: '600px' }
      }}
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={2}>
          <Schedule color="primary" />
          <Typography variant="h6">
            Solicitar Tutoría
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        {success ? (
          <Box textAlign="center" py={4}>
            <Typography variant="h6" color="success.main" gutterBottom>
              ¡Solicitud Enviada Exitosamente!
            </Typography>
            <Typography variant="body2" color="text.secondary">
              El tutor será notificado de tu solicitud
            </Typography>
          </Box>
        ) : (
          <Box>
            <Box mb={3} p={2} bgcolor="grey.50" borderRadius={2}>
              <Typography variant="h6" gutterBottom color="primary.main">
                {tutorial.topic}
              </Typography>
              
              <Typography variant="body2" color="text.secondary" paragraph>
                {tutorial.description}
              </Typography>

              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Person fontSize="small" color="action" />
                    <Typography variant="body2">
                      <strong>Host:</strong> {tutorial.host?.name || 'N/A'}
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <School fontSize="small" color="action" />
                    <Typography variant="body2">
                      <strong>Materia:</strong> {tutorial.subject?.name || 'N/A'}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="body2">
                      <strong>Estado:</strong>
                    </Typography>
                    <Chip
                      label={getStatusText(tutorial.status)}
                      color={getStatusColor(tutorial.status)}
                      size="small"
                      variant="outlined"
                    />
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="body2">
                      <strong>Acceso:</strong>
                    </Typography>
                    <Chip
                      label={getAccessText(tutorial.access)}
                      color={getAccessColor(tutorial.access)}
                      size="small"
                      variant="outlined"
                    />
                  </Box>
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />

              <Box>
                <Typography variant="body2" color="text.secondary">
                  <strong>Período de la tutoría:</strong>
                </Typography>
                <Typography variant="body2">
                  {formatDate(tutorial.startTime)} - {formatDate(tutorial.endTime)}
                </Typography>
              </Box>
            </Box>

            <Box>
              <Typography variant="h6" gutterBottom>
                {tutorial.access === 'PRIVATE' ? 'Programa tu sesión (1 hora)' : 'Solicitar Acceso'}
              </Typography>
              
              <Typography variant="body2" color="text.secondary" paragraph>
                {tutorial.access === 'PRIVATE' 
                  ? 'Selecciona la fecha y hora de inicio. La sesión durará automáticamente 1 hora.'
                  : 'Envía tu solicitud para unirte a esta tutoría pública. El tutor coordinará los horarios.'
                }
              </Typography>

              {tutorial.access === 'PRIVATE' && (
                <>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Fecha"
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        inputProps={{
                          min: new Date().toISOString().split('T')[0]
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Hora de Inicio"
                        type="time"
                        value={selectedTime}
                        onChange={(e) => setSelectedTime(e.target.value)}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </Grid>
                  </Grid>

                  {selectedTime && (
                    <Box mt={2} p={2} bgcolor="success.light" borderRadius={1}>
                      <Typography variant="body2" color="success.contrastText">
                        <strong>Duración:</strong> {selectedTime} - {
                          selectedTime ? 
                          new Date(`2000-01-01T${selectedTime}`).toLocaleTimeString('es-ES', {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: false
                          }).split(':').map((part, index) => {
                            if (index === 0) {
                              const hour = parseInt(part) + 1;
                              return hour.toString().padStart(2, '0');
                            }
                            return part;
                          }).join(':')
                          : ''
                        } (1 hora)
                      </Typography>
                    </Box>
                  )}
                </>
              )}

              {tutorial.access === 'PUBLIC' && (
                <Box mt={2} p={2} bgcolor="primary.light" borderRadius={1}>
                  <Typography variant="body2" color="primary.contrastText">
                    <strong>Tutoría Pública:</strong> Al unirte a esta tutoría, tendrás acceso durante 
                    todo el período establecido. Se creará automáticamente un enlace de Microsoft Teams 
                    para las sesiones virtuales. El tutor coordinará los horarios específicos.
                  </Typography>
                </Box>
              )}

              {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {error}
                </Alert>
              )}

              <Box mt={2} p={2} bgcolor="info.light" borderRadius={1}>
                <Typography variant="body2" color="info.contrastText">
                  <strong>Nota:</strong> Tu solicitud será enviada al tutor para su aprobación. 
                  Recibirás una notificación cuando sea {tutorial.access === 'PRIVATE' ? 'aceptada o rechazada' : 'procesada'}.
                </Typography>
              </Box>
            </Box>
          </Box>
        )}
      </DialogContent>

      {!success && (
        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={handleClose} 
            disabled={requesting}
          >
            Cancelar
          </Button>
          <Button 
            variant="contained" 
            onClick={handleSubmit}
            disabled={requesting}
            startIcon={requesting && <CircularProgress size={20} />}
          >
            {requesting 
              ? 'Enviando...' 
              : tutorial.access === 'PRIVATE' 
                ? 'Solicitar Sesión' 
                : 'Unirse a Tutoría'
            }
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};
