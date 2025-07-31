import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  Typography,
  Input,
  FormControl,
  InputLabel,
  FormHelperText
} from '@mui/material';
import { SchoolOutlined, CloudUploadOutlined, CheckCircleOutline, ErrorOutline } from '@mui/icons-material';
import { motion } from 'framer-motion';

import { useApplicationRequest } from '../../shared/hooks/useApplicationRequest';

const ApplicationRequest = ({ open, onClose, subject }) => {
  const { submitApplication, loading, error, success, resetState } = useApplicationRequest();

  const [formData, setFormData] = useState({
    description: '',
    evidence: null
  });

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (success) {
      setTimeout(() => {
        handleClose();
      }, 2000);
    }
  }, [success]);

  useEffect(() => {
    if (open) {
      setFormData({
        description: '',
        evidence: null
      });
      setFormErrors({});
      resetState();
    }
  }, [open]);

  const handleClose = () => {
    if (!loading) {
      setFormData({
        description: '',
        evidence: null
      });
      setFormErrors({});
      resetState();
      onClose();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({
      ...prev,
      evidence: file
    }));
    if (formErrors.evidence) {
      setFormErrors(prev => ({
        ...prev,
        evidence: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.description.trim()) {
      errors.description = 'La descripción es requerida';
    } else if (formData.description.trim().length < 50) {
      errors.description = 'La descripción debe tener al menos 50 caracteres';
    }

    if (!formData.evidence) {
      errors.evidence = 'La evidencia es requerida';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const applicationData = {
      subject: subject?.sid,
      description: formData.description.trim(),
      evidence: formData.evidence,
      zoomAccount: 'No especificado'
    };

    await submitApplication(applicationData);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      disableEscapeKeyDown={loading}
      PaperProps={{
        sx: {
          borderRadius: 4,
          boxShadow: '0 15px 30px rgba(0,0,0,0.25)',
          overflow: 'hidden',
          background: 'linear-gradient(145deg, #e0f7fa 0%, #ffffff 100%)',
          border: '1px solid rgba(0,0,0,0.05)',
        }
      }}
      BackdropProps={{
        sx: {
          backdropFilter: 'blur(5px)',
          backgroundColor: 'rgba(0,0,0,0.5)',
        }
      }}
    >
      <DialogTitle sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        pb: 2,
        pt: 3,
        px: 4,
        borderBottom: '1px solid #e0e0e0',
        background: 'linear-gradient(90deg, #2563EB 0%, #3B82F6 100%)',
        color: 'white',
        fontWeight: 'bold',
      }}>
        <SchoolOutlined sx={{ fontSize: 32 }} />
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            Solicitud para ser Tutor
          </Typography>
          <Typography variant="subtitle1" sx={{ mt: 0.5, opacity: 0.9 }}>
            Materia: {subject?.name} ({subject?.code})
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 4 }}>
        <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <TextField
            name="description"
            label="¿Por qué quieres ser tutor de esta materia?"
            multiline
            rows={6}
            value={formData.description}
            onChange={handleChange}
            disabled={loading}
            placeholder="Describe tu experiencia, conocimientos y motivación para ser tutor de esta materia. Mínimo 50 caracteres."
            error={!!formErrors.description}
            helperText={
              formErrors.description ||
              `${formData.description.length}/50 caracteres mínimo`
            }
            fullWidth
            variant="outlined"
            sx={{
              borderRadius: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                transition: 'box-shadow 0.3s ease-in-out',
                '&.Mui-focused fieldset': {
                  borderColor: '#2563EB',
                  boxShadow: '0 0 0 3px rgba(37, 99, 235, 0.2)',
                },
              },
            }}
          />

          <FormControl fullWidth error={!!formErrors.evidence} sx={{ mt: 2 }}>
            <InputLabel shrink htmlFor="evidence-upload" sx={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#1E40AF' }}>
              Evidencia *
            </InputLabel>
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              border: '1px dashed #90CAF9',
              borderRadius: 2,
              p: 2,
              backgroundColor: '#F8FAFC',
              transition: 'all 0.3s ease',
              '&:hover': {
                borderColor: '#2563EB',
                backgroundColor: '#EBF5FF',
              }
            }}>
              <CloudUploadOutlined sx={{ fontSize: 40, color: '#2563EB' }} />
              <Input
                id="evidence-upload"
                type="file"
                onChange={handleFileChange}
                disabled={loading}
                inputProps={{ accept: "image/*,.pdf,.doc,.docx" }}
                sx={{ display: 'none' }}
              />
              <Button
                variant="outlined"
                component="label"
                htmlFor="evidence-upload"
                disabled={loading}
                sx={{
                  textTransform: 'none',
                  borderColor: '#2563EB',
                  color: '#2563EB',
                  '&:hover': {
                    backgroundColor: '#EBF5FF',
                    borderColor: '#1E40AF',
                  },
                  borderRadius: 1.5,
                  px: 3,
                  py: 1,
                  fontWeight: 'bold',
                }}
              >
                {formData.evidence ? 'Cambiar Archivo' : 'Seleccionar Archivo'}
              </Button>
              {formData.evidence && (
                <Typography variant="body2" color="text.primary" sx={{ flexGrow: 1, ml: 1 }}>
                  Archivo seleccionado: {formData.evidence.name}
                </Typography>
              )}
            </Box>
            <FormHelperText sx={{ mt: 1, ml: 0 }}>
              {formErrors.evidence ||
                "Sube un documento que demuestre tu conocimiento en la materia (Notas, Promedios, Certificados, etc.). Formatos: imágenes, PDF, Word."}
            </FormHelperText>
          </FormControl>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Alert
                severity="error"
                icon={<ErrorOutline fontSize="inherit" />}
                sx={{ borderRadius: 2, boxShadow: 3, mt: 2 }}
                variant="filled"
              >
                {error}
              </Alert>
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Alert
                severity="success"
                icon={<CheckCircleOutline fontSize="inherit" />}
                sx={{ borderRadius: 2, boxShadow: 3, mt: 2 }}
                variant="filled"
              >
                ¡Solicitud enviada exitosamente! El administrador revisará tu aplicación.
              </Alert>
            </motion.div>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, borderTop: '1px solid #e0e0e0', justifyContent: 'flex-end' }}>
        <Button
          onClick={handleClose}
          disabled={loading}
          variant="outlined"
          sx={{
            borderRadius: 2,
            px: 3,
            py: 1,
            fontWeight: 'bold',
            borderColor: '#607D8B',
            color: '#607D8B',
            '&:hover': {
              backgroundColor: '#ECEFF1',
              borderColor: '#455A64',
            },
            transition: 'all 0.3s ease',
          }}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={loading || success}
          variant="contained"
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
          sx={{
            background: 'linear-gradient(45deg, #2563EB 30%, #3B82F6 90%)',
            '&:hover': {
              background: 'linear-gradient(45deg, #1E40AF 30%, #2563EB 90%)',
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 15px rgba(0,0,0,0.2)',
            },
            borderRadius: 2,
            boxShadow: 3,
            px: 4,
            py: 1.5,
            fontWeight: 'bold',
            fontSize: '1rem',
            color: 'white',
            transition: 'all 0.3s ease',
          }}
        >
          {loading ? 'Enviando...' : 'Enviar Solicitud'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ApplicationRequest;
