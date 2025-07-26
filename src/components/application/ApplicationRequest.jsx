import React, { useState, useEffect } from 'react'
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
} from '@mui/material'
import { useApplicationRequest } from '../../shared/hooks/useApplicationRequest'

const ApplicationRequest = ({ open, onClose, subject }) => {
  const { submitApplication, loading, error, success, resetState } = useApplicationRequest()
  
  const [formData, setFormData] = useState({
    description: '',
    evidence: null
  })
  
  const [formErrors, setFormErrors] = useState({})

  useEffect(() => {
    if (success) {
      setTimeout(() => {
        handleClose()
      }, 2000)
    }
  }, [success])

  useEffect(() => {
    if (open) {
      setFormData({
        description: '',
        evidence: null
      })
      setFormErrors({})
      resetState()
    }
  }, [open])

  const handleClose = () => {
    if (!loading) {
      setFormData({
        description: '',
        evidence: null
      })
      setFormErrors({})
      resetState()
      onClose()
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    
    setFormData(prev => ({
      ...prev, 
      [name]: value
    }))
    
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    setFormData(prev => ({
      ...prev,
      evidence: file
    }))
  
    if (formErrors.evidence) {
      setFormErrors(prev => ({
        ...prev,
        evidence: ''
      }))
    }
  }

  const validateForm = () => {
    const errors = {}
    
    if (!formData.description.trim()) {
      errors.description = 'La descripción es requerida'
    } else if (formData.description.trim().length < 50) {
      errors.description = 'La descripción debe tener al menos 50 caracteres'
    }
    
    if (!formData.evidence) {
      errors.evidence = 'La evidencia es requerida'
    }
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) {
      return
    }

    const applicationData = {
      subject: subject?.sid,
      description: formData.description.trim(),
      evidence: formData.evidence,
      zoomAccount: 'No especificado'
    }

    await submitApplication(applicationData)
  }

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      disableEscapeKeyDown={loading}
    >
      <DialogTitle>
        <Typography variant="h5" component="div">
          Solicitud para ser Tutor
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 1 }}>
          Materia: {subject?.name} ({subject?.code})
        </Typography>
      </DialogTitle>
      
      <DialogContent dividers>
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
          />

          <FormControl fullWidth error={!!formErrors.evidence}>
            <InputLabel shrink htmlFor="evidence-upload">
              Evidencia *
            </InputLabel>
            <Input
              id="evidence-upload"
              type="file"
              onChange={handleFileChange}
              disabled={loading}
              inputProps={{
                accept: "image/*,.pdf,.doc,.docx"
              }}
              sx={{ mt: 2 }}
            />
            <FormHelperText>
              {formErrors.evidence || 
               "Sube un documento que demuestre tu conocimiento en la materia (Notas, Promedios, Certificados, etc..). Formatos: imágenes, PDF, Word"}
            </FormHelperText>
            {formData.evidence && (
              <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
                Archivo seleccionado: {formData.evidence.name}
              </Typography>
            )}
          </FormControl>

          {error && (
            <Alert severity="error">
              {error}
            </Alert>
          )}
          
          {success && (
            <Alert severity="success">
              ¡Solicitud enviada exitosamente! El administrador revisará tu aplicación.
            </Alert>
          )}
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ p: 3 }}>
        <Button 
          onClick={handleClose} 
          disabled={loading}
          variant="outlined"
        >
          Cancelar
        </Button>
        <Button 
          onClick={handleSubmit} 
          disabled={loading || success}
          variant="contained"
          startIcon={loading ? <CircularProgress size={24} /> : null}
        >
          {loading ? 'Enviando...' : 'Enviar Solicitud'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ApplicationRequest
