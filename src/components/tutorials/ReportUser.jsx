import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Typography,
  Box
} from '@mui/material';
import { useReport } from '../../shared/hooks/useReport';

export const ReportUser = ({ open, onClose, userToReport, subjectId }) => {
  const { loading, error, success, submitReport, clearMessages } = useReport();
  
  const [formData, setFormData] = useState({
    reason: '',
    details: ''
  });

  const reasonOptions = [
    { value: 'inappropriate_behavior', label: 'Comportamiento inapropiado' },
    { value: 'harassment', label: 'Acoso o intimidación' },
    { value: 'spam', label: 'Spam o contenido irrelevante' },
    { value: 'offensive_language', label: 'Lenguaje ofensivo' },
    { value: 'academic_dishonesty', label: 'Deshonestidad académica' },
    { value: 'violation_rules', label: 'Violación de normas' },
    { value: 'other', label: 'Otro' }
  ];

  const handleInputChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!formData.reason || !formData.details.trim()) {
      return;
    }

    const selectedReason = reasonOptions.find(option => option.value === formData.reason);
    const reasonLabel = selectedReason ? selectedReason.label : formData.reason;

    const reportData = {
      reportTo: userToReport,
      reason: reasonLabel, 
      relatedSubject: subjectId,
      details: formData.details.trim()
    };

    const result = await submitReport(reportData);
    
    if (result.success) {
      setTimeout(() => {
        handleClose();
      }, 2000);
    }
  };

  const handleClose = () => {
    setFormData({ reason: '', details: '' });
    clearMessages();
    onClose();
  };

  const isFormValid = formData.reason && formData.details.trim().length >= 10;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      aria-labelledby="report-user-dialog-title"
    >
      <DialogTitle id="report-user-dialog-title">
        Reportar Usuario
      </DialogTitle>
      
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Estás reportando a: <strong>{userToReport?.name || userToReport?.displayName || 'Usuario'}</strong>
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Reporte enviado exitosamente. Será revisado por los administradores.
            </Alert>
          )}

          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel id="reason-label">Motivo del reporte *</InputLabel>
            <Select
              labelId="reason-label"
              value={formData.reason}
              label="Motivo del reporte *"
              onChange={handleInputChange('reason')}
              disabled={loading || success}
            >
              {reasonOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            multiline
            rows={4}
            label="Detalles del reporte *"
            placeholder="Describe detalladamente la situación que motiva el reporte..."
            value={formData.details}
            onChange={handleInputChange('details')}
            disabled={loading || success}
            helperText={`${formData.details.length}/500 caracteres (mínimo 10)`}
            inputProps={{ maxLength: 500 }}
            error={formData.details.length > 0 && formData.details.length < 10}
          />

          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            * Campos obligatorios. El reporte será revisado por los administradores.
          </Typography>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button 
            onClick={handleClose}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="error"
            disabled={!isFormValid || loading || success}
            startIcon={loading && <CircularProgress size={20} />}
          >
            {loading ? 'Enviando...' : 'Enviar Reporte'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
