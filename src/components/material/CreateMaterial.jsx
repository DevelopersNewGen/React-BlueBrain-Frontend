import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress
} from '@mui/material';
import useCreateMaterial from '../../shared/hooks/useCreateMaterial';

const CreateMaterial = ({ open, onClose, onSuccess }) => {
  const {
    formData,
    subjects,
    loading,
    error,
    handleChange,
    handleSubmit,
    handleClose
  } = useCreateMaterial(open, onClose, onSuccess);

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="md" 
      fullWidth
      aria-labelledby="create-material-title"
      aria-describedby="create-material-description"
      disableRestoreFocus
      keepMounted={false}
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle id="create-material-title">Crear Nuevo Material</DialogTitle>
        <DialogContent id="create-material-description">
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            {error && <Alert severity="error">{error}</Alert>}
            
            <TextField
              name="title"
              label="Título"
              value={formData.title}
              onChange={handleChange}
              required
              fullWidth
              autoFocus
            />

            <TextField
              name="description"
              label="Descripción"
              value={formData.description}
              onChange={handleChange}
              required
              multiline
              rows={3}
              fullWidth
            />

            <FormControl required fullWidth>
              <InputLabel>Materia</InputLabel>
              <Select
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                label="Materia"
              >
                {subjects.length > 0 ? (
                  subjects.map((subject) => (
                    <MenuItem key={subject.sid || subject._id} value={subject.sid || subject._id}>
                      {subject.name}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>No hay materias disponibles</MenuItem>
                )}
              </Select>
            </FormControl>

            <FormControl required fullWidth>
              <InputLabel>Grado</InputLabel>
              <Select
                name="grade"
                value={formData.grade}
                onChange={handleChange}
                label="Grado"
              >
                <MenuItem value="4to">4to</MenuItem>
                <MenuItem value="5to">5to</MenuItem>
                <MenuItem value="6to">6to</MenuItem>
              </Select>
            </FormControl>

            <TextField
              name="fileUrl"
              label="URL del archivo"
              value={formData.fileUrl}
              onChange={handleChange}
              required
              fullWidth
              type="url"
              placeholder="https://ejemplo.com/archivo.pdf"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>
            Cancelar
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={loading}
            startIcon={loading && <CircularProgress size={20} />}
          >
            {loading ? 'Creando...' : 'Crear Material'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CreateMaterial;