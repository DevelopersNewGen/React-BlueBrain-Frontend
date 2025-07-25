import React, { useState, useEffect } from 'react'
import { useSubjectGets } from '../../shared/hooks/useSubjectGets'
import { useSubjectPost } from '../../shared/hooks/UseSubjectPost'
import { useSubjectPut } from '../../shared/hooks/useSubjectPut'
import { useSubjectDelete } from '../../shared/hooks/useSubjectDelete'
import { useSubjectAddTeacher } from '../../shared/hooks/useSubjectAddTeacher'
import { useUserGets } from '../../shared/hooks/useUserGets'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import EditIcon from '@mui/icons-material/Edit'
import VisibilityIcon from '@mui/icons-material/Visibility'
import DeleteIcon from '@mui/icons-material/Delete'
import Navbar from '../Navbar'
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
  Snackbar,
  IconButton,
  Autocomplete
} from '@mui/material'

const SubjectList = () => {
  const { subjects, loading, error, refetch } = useSubjectGets()
  const { postSubject, loading: posting, error: postError, success: postSuccess } = useSubjectPost()
  const { putSubject, loading: putting, error: putError, success: putSuccess } = useSubjectPut()
  const { removeSubject, loading: deleting, error: deleteError, success: deleteSuccess } = useSubjectDelete()
  const { addTeacher, loading: addingTeacher, error: addTeacherError, success: addTeacherSuccess } = useSubjectAddTeacher()
  const { users, loading: usersLoading, error: usersError, refetch: refetchUsers } = useUserGets()

  const teachersList = Array.isArray(users)
    ? users.filter(u => u.role === 'TEACHER_ROLE')
    : []

  const [selectedTeacher, setSelectedTeacher] = useState(null)
  const [open, setOpen] = useState(false)
  const [formValues, setFormValues] = useState({
    name: '',
    code: '',
    grade: '',
    img: '',
    status: true,
    description: ''
  })
  const [editOpen, setEditOpen] = useState(false)
  const [editSid, setEditSid] = useState(null)
  const [editFormValues, setEditFormValues] = useState({
    name: '',
    code: '',
    grade: '',
    img: '',
    status: true,
    description: ''
  })
  const [viewOpen, setViewOpen] = useState(false)
  const [viewSubject, setViewSubject] = useState(null)
  const [addTeacherOpen, setAddTeacherOpen] = useState(false)
  const [addTeacherSid, setAddTeacherSid] = useState(null)

  useEffect(() => {
    if (postSuccess) {
      setOpen(false)
      refetch()
      setFormValues({ name: '', code: '', grade: '', img: '', status: true, description: '' })
    }
  }, [postSuccess, refetch])

  useEffect(() => {
    if (putSuccess) {
      setEditOpen(false)
      refetch()
      setEditSid(null)
    }
  }, [putSuccess, refetch])

  useEffect(() => {
    if (addTeacherSuccess) {
      setAddTeacherOpen(false)
      setSelectedTeacher(null)
      refetch()
    }
  }, [addTeacherSuccess, refetch])

  useEffect(() => {
    if (deleteSuccess) {
      refetch()
    }
  }, [deleteSuccess, refetch])

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const handleChange = e => {
    const { name, value, type, checked } = e.target
    setFormValues(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }
  const handleSubmit = async () => {
    const formData = new FormData()
    Object.entries(formValues).forEach(([key, val]) => formData.append(key, val))
    await postSubject(formData)
  }

  const handleEditOpen = subj => {
    setEditSid(subj.sid)
    setEditFormValues({
      name: subj.name || '',
      code: subj.code || '',
      grade: subj.grade || '',
      img: subj.img || '',
      status: subj.status ?? true,
      description: subj.description || ''
    })
    setEditOpen(true)
  }
  const handleEditClose = () => setEditOpen(false)
  const handleEditChange = e => {
    const { name, value, type, checked } = e.target
    setEditFormValues(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }
  const handleEditSubmit = async () => {
    const formData = new FormData()
    Object.entries(editFormValues).forEach(([key, val]) => formData.append(key, val))
    await putSubject(editSid, formData)
  }

  const handleViewOpen = subj => {
    setViewSubject(subj)
    setViewOpen(true)
  }
  const handleViewClose = () => setViewOpen(false)

  const handleDelete = async sid => {
    if (!window.confirm('¿Estás seguro de eliminar esta materia?')) return
    await removeSubject(sid)
  }

  const handleAddTeacherOpen = sid => {
    setAddTeacherSid(sid)
    setSelectedTeacher(null)
    setAddTeacherOpen(true)
    refetchUsers()
  }
  const handleAddTeacherClose = () => setAddTeacherOpen(false)

  const handleAddTeacherSubmit = async () => {
    const teacherId = selectedTeacher?._id || selectedTeacher?.uid
    await addTeacher(addTeacherSid, teacherId)
  }

  return (
    <>
      <Navbar />
      <Box p={4}>
        <Button variant="contained" onClick={handleOpen}>
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
      ) : !Array.isArray(subjects) || subjects.length === 0 ? (
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
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {subjects.map(subj => (
                  <TableRow key={subj.sid}>
                    <TableCell>
                      <Avatar src={subj.img} alt={subj.name} />
                    </TableCell>
                    <TableCell>{subj.name}</TableCell>
                    <TableCell>{subj.code}</TableCell>
                    <TableCell>{subj.grade}</TableCell>
                    <TableCell>{subj.teachers?.length || 0}</TableCell>
                    <TableCell>{subj.status ? 'Activo' : 'Inactivo'}</TableCell>
                    <TableCell>
                      <IconButton size="small" onClick={() => handleViewOpen(subj)}>
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleEditOpen(subj)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleAddTeacherOpen(subj.sid)}>
                        <PersonAddIcon />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDelete(subj.sid)} disabled={deleting}>
                        <DeleteIcon />
                      </IconButton>
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
          <TextField margin="dense" label="Nombre" name="name" fullWidth value={formValues.name} onChange={handleChange} />
          <TextField margin="dense" label="Código" name="code" fullWidth value={formValues.code} onChange={handleChange} />
          <TextField margin="dense" label="Grado" name="grade" fullWidth value={formValues.grade} onChange={handleChange} />
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
          <TextField margin="dense" label="URL Imagen" name="img" fullWidth value={formValues.img} onChange={handleChange} />
          <FormControlLabel control={<Checkbox checked={formValues.status} onChange={handleChange} name="status" />} label="Activo" />
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
      <Dialog open={editOpen} onClose={!putting ? handleEditClose : null}>
        <DialogTitle>Editar Materia</DialogTitle>
        <DialogContent>
          <TextField margin="dense" label="Nombre" name="name" fullWidth value={editFormValues.name} onChange={handleEditChange} />
          <TextField margin="dense" label="Código" name="code" fullWidth value={editFormValues.code} onChange={handleEditChange} />
          <TextField margin="dense" label="Grado" name="grade" fullWidth value={editFormValues.grade} onChange={handleEditChange} />
          <TextField
            margin="dense"
            label="Descripción"
            name="description"
            fullWidth
            multiline
            rows={3}
            value={editFormValues.description}
            onChange={handleEditChange}
          />
          <TextField margin="dense" label="URL Imagen" name="img" fullWidth value={editFormValues.img} onChange={handleEditChange} />
          <FormControlLabel control={<Checkbox checked={editFormValues.status} onChange={handleEditChange} name="status" />} label="Activo" />
          {putError && (
            <Box mt={2}>
              <Alert severity="error">{putError}</Alert>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose} disabled={putting}>
            Cancelar
          </Button>
          <Button onClick={handleEditSubmit} variant="contained" disabled={putting}>
            {putting ? <CircularProgress size={24} /> : 'Guardar'}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={viewOpen} onClose={handleViewClose}>
        <DialogTitle>Detalle Materia</DialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom>Nombre: {viewSubject?.name}</Typography>
          <Typography gutterBottom>Código: {viewSubject?.code}</Typography>
          <Typography gutterBottom>Grado: {viewSubject?.grade}</Typography>
          <Typography gutterBottom>Descripción: {viewSubject?.description}</Typography>
          <Typography gutterBottom>Estado: {viewSubject?.status ? 'Activo' : 'Inactivo'}</Typography>
          {viewSubject?.img && (
            <Box mt={2} display="flex" justifyContent="center">
              <Avatar src={viewSubject.img} alt={viewSubject.name} sx={{ width: 100, height: 100 }} />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleViewClose}>Cerrar</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={addTeacherOpen} onClose={!addingTeacher ? handleAddTeacherClose : null}>
        <DialogTitle>Agregar Profesor a Materia</DialogTitle>
        <DialogContent>
          {usersError && <Alert severity="error">{usersError}</Alert>}
          <Autocomplete
            options={teachersList}
            getOptionLabel={opt => opt.name}
            loading={usersLoading}
            noOptionsText={usersLoading ? 'Cargando...' : 'No hay profesores'}
            value={selectedTeacher}
            onOpen={() => refetchUsers()}
            onChange={(_, v) => setSelectedTeacher(v)}
            renderInput={params => <TextField {...params} label="Selecciona Profesor" margin="dense" fullWidth />}
            disabled={addingTeacher}
          />
          {!usersLoading && teachersList.length === 0 && (
            <Box mt={2}>
              <Alert severity="info">No se encontraron profesores para asignar.</Alert>
            </Box>
          )}
          {addTeacherError && <Alert severity="error">{addTeacherError}</Alert>}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddTeacherClose} disabled={addingTeacher}>
            Cancelar
          </Button>
          <Button onClick={handleAddTeacherSubmit} variant="contained" disabled={addingTeacher || !selectedTeacher}>
            {addingTeacher ? <CircularProgress size={24} /> : 'Agregar'}
          </Button>
        </DialogActions>
      </Dialog>
      {deleteError && (
        <Box mt={2}>
          <Alert severity="error">{deleteError}</Alert>
        </Box>
      )}
      <Snackbar open={postSuccess || putSuccess || deleteSuccess} autoHideDuration={3000} onClose={() => {}}>
        <Alert severity="success">
          {postSuccess
            ? 'Materia creada exitosamente'
            : putSuccess
            ? 'Materia actualizada exitosamente'
            : 'Materia eliminada exitosamente'}
        </Alert>
      </Snackbar>
    </>
  )
}

export default SubjectList