import React, { useState, useEffect } from 'react';
import { useSubjectGets } from '../../shared/hooks/useSubjectGets';
import { useSubjectPost } from '../../shared/hooks/UseSubjectPost';
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  Avatar,
  CircularProgress,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Checkbox,
  FormControlLabel,
  Snackbar
} from '@mui/material';
import Navbar from '../Navbar';

const SubjectList = () => {
  const { subjects, loading, error, refetch } = useSubjectGets();
  const { postSubject, loading: posting, error: postError, success: postSuccess } = useSubjectPost();

  const [open, setOpen] = useState(false);
  const [formValues, setFormValues] = useState({
    name: '',
    code: '',
    grade: '',
    img: '',
    status: true,
    description: ''
  });

  useEffect(() => {
    if (postSuccess) {
      setOpen(false);
      refetch();
      setFormValues({ name: '', code: '', grade: '', img: '', status: true, description: '' });
    }
  }, [postSuccess, refetch]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setFormValues(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };
  const handleSubmit = async () => {
    const formData = new FormData();
    Object.entries(formValues).forEach(([key, val]) => formData.append(key, val));
    await postSubject(formData);
  };

  return (
    <>
      <Navbar />
      <Box p={4}>
        <Button variant="contained" color="primary" onClick={handleOpen}>
          Agregar Materia
        </Button>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Box m={4}>
          <Alert severity="error">
            {error}
            <Box mt={2}>
              <Typography
                component="span"
                color="primary"
                sx={{ cursor: 'pointer', textDecoration: 'underline' }}
                onClick={refetch}
              >
                Reintentar
              </Typography>
            </Box>
          </Alert>
        </Box>
      ) : (!Array.isArray(subjects) || subjects.length === 0) ? (
        <Box m={4}>
          <Alert severity="info">No hay materias registradas.</Alert>
        </Box>
      ) : (
        <Box p={4}>
          <Typography variant="h4" gutterBottom>
            Lista de Materias
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Imagen</TableCell>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Código</TableCell>
                  <TableCell>Grado</TableCell>
                  <TableCell>Docentes</TableCell>
                  <TableCell>Estado</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.isArray(subjects) && subjects.map((subj) => (
                  <TableRow key={subj.sid}>
                    <TableCell>
                      <Avatar src={subj.img} alt={subj.name} />
                    </TableCell>
                    <TableCell>{subj.name}</TableCell>
                    <TableCell>{subj.code}</TableCell>
                    <TableCell>{subj.grade}</TableCell>
                    <TableCell>{subj.teachers?.length || 0}</TableCell>
                    <TableCell>
                      {subj.status ? 'Activo' : 'Inactivo'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      <Dialog open={open} onClose={!posting ? handleClose : null}>
        <DialogTitle>Crear Materia</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Nombre"
            name="name"
            fullWidth
            value={formValues.name}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Código"
            name="code"
            fullWidth
            value={formValues.code}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Grado"
            name="grade"
            fullWidth
            value={formValues.grade}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Descripción"
            name="description"
            fullWidth
            multiline
            rows={3}
            value={formValues.description}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="URL Imagen"
            name="img"
            fullWidth
            value={formValues.img}
            onChange={handleChange}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={formValues.status}
                onChange={handleChange}
                name="status"
              />
            }
            label="Activo"
          />
          {postError && (
            <Box mt={2}>
              <Alert severity="error">{postError}</Alert>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={posting}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} variant="contained" disabled={posting}>
            {posting ? <CircularProgress size={24} /> : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={postSuccess}
        autoHideDuration={3000}
        onClose={handleClose}
      >
        <Alert severity="success">Materia creada exitosamente</Alert>
      </Snackbar>
    </>
  );
};

export default SubjectList;