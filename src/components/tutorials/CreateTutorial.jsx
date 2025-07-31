import React, { useState } from 'react';
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Divider
} from '@mui/material';
import {
  Add,
  School,
  Topic,
  Description,
  AccessTime,
  Visibility,
  Save
} from '@mui/icons-material';
import { useTutorials } from '../../shared/hooks/useTutorials';
import { useSubjectGets } from '../../shared/hooks/useSubjectGets';

export const CreateTutorial = ({ open, onClose }) => {
  const { createNewTutorial, creating } = useTutorials();
  const { subjects, loading: loadingSubjects } = useSubjectGets();
  
  const [formData, setFormData] = useState({
    topic: '',
    description: '',
    subject: '',
    access: 'PUBLIC',
    startTime: '',
    endTime: ''
  });
  
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [success, setSuccess] = useState(false);

  React.useEffect(() => {
    if (open) {
      setFormData({
        topic: '',
        description: '',
        subject: '',
        access: 'PUBLIC',
        startTime: '',
        endTime: ''
      });
      setErrors({});
      setSubmitError('');
      setSuccess(false);
    }
  }, [open]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.topic.trim()) {
      newErrors.topic = 'El tema es requerido';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es requerida';
    }

    if (!formData.subject) {
      newErrors.subject = 'La materia es requerida';
    }

    if (!formData.startTime) {
      newErrors.startTime = 'La fecha de inicio es requerida';
    }

    if (!formData.endTime) {
      newErrors.endTime = 'La fecha de fin es requerida';
    }

    if (formData.startTime && formData.endTime) {
      const start = new Date(formData.startTime);
      const end = new Date(formData.endTime);
      const now = new Date();

      if (start <= now) {
        newErrors.startTime = 'La fecha de inicio debe ser futura';
      }

      if (end <= start) {
        newErrors.endTime = 'La fecha de fin debe ser posterior a la de inicio';
      }

      const diffDays = (end - start) / (1000 * 60 * 60 * 24);
      if (diffDays < 1) {
        newErrors.endTime = 'El período debe ser de al menos 1 día';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field) => (event) => {
    const value = event.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleSubmit = async () => {
    setSubmitError('');

    if (!validateForm()) {
      return;
    }

    try {
      const dataToSend = {
        ...formData,
        startTime: new Date(formData.startTime).toISOString(),
        endTime: new Date(formData.endTime).toISOString()
      };
      
      const result = await createNewTutorial(dataToSend);

      if (result && result.success) {
        setSuccess(true);
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        if (result && result.error && typeof result.error === 'string' && result.error.includes('not a teacher or tutor')) {
          setSubmitError('No eres profesor o tutor de esta materia. Solo puedes crear tutorías para materias donde tienes estos roles.');
        } else if (result && result.e && result.e.response) {
          const errorMessage = result.e.response.data?.message || result.e.response.data?.error || 'Error del servidor';
          setSubmitError(errorMessage);
        } else {
          setSubmitError(result?.error || result?.message || 'Error desconocido al crear la tutoría');
        }
      }
    } catch (error) {
      setSubmitError('Error de conexión' + error.message);
    }
  };

  const handleClose = () => {
    if (!creating) {
      onClose();
    }
  };

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
          <Add color="primary" />
          <Typography variant="h6">
            Crear Nueva Tutoría
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        {success ? (
          <Box textAlign="center" py={4}>
            <Typography variant="h6" color="success.main" gutterBottom>
              ¡Tutoría Creada Exitosamente!
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Los estudiantes podrán solicitar sesiones de esta tutoría
            </Typography>
          </Box>
        ) : (
          <Box>
            <Typography variant="body2" color="text.secondary" paragraph>
              Completa la información para crear una nueva tutoría que los estudiantes puedan solicitar.
              Solo puedes crear tutorías para materias en las que estás inscrito como tutor o profesor.
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Topic color="primary" />
                  Información Básica
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Tema de la Tutoría"
                  value={formData.topic}
                  onChange={handleInputChange('topic')}
                  error={!!errors.topic}
                  helperText={errors.topic}
                  placeholder="Ej: Cálculo Diferencial - Límites y Derivadas"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Descripción"
                  value={formData.description}
                  onChange={handleInputChange('description')}
                  error={!!errors.description}
                  helperText={errors.description}
                  placeholder="Describe los temas que se cubrirán en esta tutoría..."
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={!!errors.subject}>
                  <InputLabel>Materia</InputLabel>
                  <Select
                    value={formData.subject}
                    onChange={handleInputChange('subject')}
                    label="Materia"
                    disabled={loadingSubjects}
                  >
                    {subjects.map((subject) => (
                      <MenuItem key={subject._id || subject.sid} value={subject.sid}>
                        {subject.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.subject && <FormHelperText>{errors.subject}</FormHelperText>}
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Tipo de Acceso</InputLabel>
                  <Select
                    value={formData.access}
                    onChange={handleInputChange('access')}
                    label="Tipo de Acceso"
                  >
                    <MenuItem value="PUBLIC">Pública - Se crea automáticamente enlace de Teams</MenuItem>
                    <MenuItem value="PRIVATE">Privada - Sesiones individuales por solicitud</MenuItem>
                  </Select>
                  <FormHelperText>
                    {formData.access === 'PUBLIC' 
                      ? 'Los estudiantes se unen directamente, se genera enlace de Microsoft Teams'
                      : 'Los estudiantes solicitan sesiones específicas que debes aprobar'
                    }
                  </FormHelperText>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AccessTime color="primary" />
                  Período de Disponibilidad
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Define el período durante el cual los estudiantes pueden solicitar sesiones de esta tutoría.
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Fecha y Hora de Inicio"
                  type="datetime-local"
                  value={formData.startTime}
                  onChange={handleInputChange('startTime')}
                  error={!!errors.startTime}
                  helperText={errors.startTime}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    min: new Date().toISOString().slice(0, 16)
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Fecha y Hora de Fin"
                  type="datetime-local"
                  value={formData.endTime}
                  onChange={handleInputChange('endTime')}
                  error={!!errors.endTime}
                  helperText={errors.endTime}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    min: formData.startTime || new Date().toISOString().slice(0, 16)
                  }}
                />
              </Grid>
            </Grid>

            {submitError && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {submitError}
              </Alert>
            )}

            <Box mt={3} p={2} bgcolor="info.light" borderRadius={1}>
              <Typography variant="body2" color="info.contrastText">
                <strong>Nota:</strong> Solo puedes crear tutorías para materias en las que estás inscrito. 
                Una vez creada, los estudiantes podrán solicitar sesiones individuales de 1 hora dentro del período que definas.
                {formData.access === 'PUBLIC' && (
                  <Typography component="span" sx={{ display: 'block', mt: 1 }}>
                    <strong>Tutoría Pública:</strong> Se creará automáticamente un enlace de Microsoft Teams para las sesiones virtuales.
                    La creación puede tardar unos segundos mientras se configura el enlace.
                  </Typography>
                )}
              </Typography>
            </Box>
          </Box>
        )}
      </DialogContent>

      {!success && (
        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={handleClose} 
            disabled={creating}
          >
            Cancelar
          </Button>
          <Button 
            variant="contained" 
            onClick={handleSubmit}
            disabled={creating}
            startIcon={creating ? <CircularProgress size={20} /> : <Save />}
          >
            {creating ? (
              formData.access === 'PUBLIC' 
                ? 'Creando y configurando Teams...' 
                : 'Creando...'
            ) : 'Crear Tutoría'}
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};
