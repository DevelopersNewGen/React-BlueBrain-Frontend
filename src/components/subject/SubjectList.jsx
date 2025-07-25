import React, { useState, useEffect } from 'react'
import { useSubjectGets } from '../../shared/hooks/useSubjectGets'
import { useSubjectPost } from '../../shared/hooks/UseSubjectPost'
import { useSubjectPut } from '../../shared/hooks/useSubjectPut'
import { useSubjectDelete } from '../../shared/hooks/useSubjectDelete'
import { useSubjectAddTeacher } from '../../shared/hooks/useSubjectAddTeacher'
import { useUserGets } from '../../shared/hooks/useUserGets'
import DeleteIcon from '@mui/icons-material/Delete'
import Navbar from '../Navbar'
import { Box, Typography, Avatar, CircularProgress, Alert, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Checkbox, FormControlLabel, Snackbar, IconButton, Autocomplete, Menu, MenuItem, Card, CardHeader, CardContent, CardActions, Grid } from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import useSubjectRemoveTeacher from '../../shared/hooks/useSubjectRemoveTeacher'
import useSubjectRemoveTutor from '../../shared/hooks/useSubjectRemoveTutor'

const SubjectList = () => {
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}')
  const role = currentUser.role
  console.log('User role:', role)  
  const isAdminOrTeacher = ['ADMIN_ROLE', 'TEACHER_ROLE', 'ADMIN', 'TEACHER']
    .includes((role || '').toUpperCase())

  const { subjects, loading, error, refetch } = useSubjectGets()
  const { postSubject, loading: posting, error: postError, success: postSuccess } = useSubjectPost()
  const { putSubject, loading: putting, error: putError, success: putSuccess } = useSubjectPut()
  const { removeSubject, loading: deleting, error: deleteError, success: deleteSuccess } = useSubjectDelete()
  const { addTeacher, loading: addingTeacher, error: addTeacherError, success: addTeacherSuccess } = useSubjectAddTeacher()
  const { users, loading: usersLoading, error: usersError, refetch: refetchUsers } = useUserGets()
  const { removeTeacher, loading: removingTeacher, error: removeTeacherError, response: removeTeacherResponse } = useSubjectRemoveTeacher()
  const { removeTutor, loading: removingTutorTutor, error: removeTutorError, response: removeTutorResponse } = useSubjectRemoveTutor()

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
  const [menuAnchorEl, setMenuAnchorEl] = useState(null)
  const [menuSubject, setMenuSubject] = useState(null)

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

  const handleRemoveTeacher = async (sid, teacherId) => {
    if (!window.confirm('¿Eliminar este profesor de la materia?')) return
    await removeTeacher(sid, teacherId)
  }

  const handleRemoveTutor = async (sid, tutorId) => {
    if (!window.confirm('¿Eliminar este tutor de la materia?')) return
    await removeTutor(sid, tutorId)
  }

  useEffect(() => {
    if (removeTeacherResponse?.success) {
      refetch()
      setViewOpen(false)
    }
  }, [removeTeacherResponse, refetch])

  useEffect(() => {
    if (removeTutorResponse?.success) {
      refetch()
      setViewOpen(false)
    }
  }, [removeTutorResponse, refetch])

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

  const handleMenuOpen = (e, subj) => {
    setMenuAnchorEl(e.currentTarget)
    setMenuSubject(subj)
  }
  const handleMenuClose = () => {
    setMenuAnchorEl(null)
    setMenuSubject(null)
  }

  return (
    <>
      <Navbar />
      <Box p={4}>
        { isAdminOrTeacher &&
          <Button variant="contained" onClick={handleOpen}>
            Agregar Materia
          </Button>
        }
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
          <Grid container spacing={2} justifyContent="center">
            {subjects.map(subj => (
              <Grid item
                key={subj.sid}
                xs={12}
                sm={6}
                md={20}
                lg={9}
              >
                <Card
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: 260,
                    width: 300,
                    position: 'relative',
                    p: 1
                  }}
                >
                  <CardHeader
                    avatar={<Avatar src={subj.img} alt={subj.name} />}
                    title={subj.name}
                    subheader={`Código: ${subj.code}`}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="body2" gutterBottom>
                      Grado: {subj.grade}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      Docentes: {subj.teachers?.length || 0}
                    </Typography>
                    <Typography variant="body2">
                      Estado: {subj.status ? 'Activo' : 'Inactivo'}
                    </Typography>
                  </CardContent>
                  <CardActions
                    sx={{
                      position: 'absolute',
                      bottom: 8,
                      right: 8,
                      p: 0
                    }}
                  >
                    <IconButton
                      size="large"
                      onClick={e => handleMenuOpen(e, subj)}
                    >
                      <MoreVertIcon fontSize="large" />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
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
      <Dialog
        open={viewOpen}
        onClose={handleViewClose}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Detalle Materia</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} alignItems="flex-start">
            {/* Imagen grande a la izquierda */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader title="Imagen de la Materia" />
                <CardContent sx={{ display: 'flex', justifyContent: 'center' }}>
                  {viewSubject?.img && (
                    <Avatar
                      src={viewSubject.img}
                      alt={viewSubject.name}
                      variant="square"
                      sx={{
                        width: '100%',
                        height: 300,
                        objectFit: 'contain'
                      }}
                    />
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Columna de información y asignaciones */}
            <Grid item xs={12} md={6}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Card>
                    <CardHeader title="Información General" />
                    <CardContent>
                      <Typography gutterBottom><strong>Nombre:</strong> {viewSubject?.name}</Typography>
                      <Typography gutterBottom><strong>Código:</strong> {viewSubject?.code}</Typography>
                      <Typography gutterBottom><strong>Grado:</strong> {viewSubject?.grade}</Typography>
                      <Typography gutterBottom><strong>Descripción:</strong> {viewSubject?.description}</Typography>
                      <Typography gutterBottom><strong>Estado:</strong> {viewSubject?.status ? 'Activo' : 'Inactivo'}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12}>
                  <Card>
                    <CardHeader title={`Docentes Asignados (${viewSubject?.teachers?.length || 0})`} />
                    <CardContent>
                      {viewSubject?.teachers?.length > 0
                        ? viewSubject.teachers.map(t => (
                            <Box key={t._id} display="flex" justifyContent="space-between" mb={1}>
                              <Typography>{t.name}</Typography>
                              {isAdminOrTeacher && (
                                <IconButton size="small" onClick={() => handleRemoveTeacher(viewSubject.sid, t._id)} disabled={removingTeacher}>
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              )}
                            </Box>
                          ))
                        : <Typography>No hay docentes asignados.</Typography>
                      }
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12}>
                  <Card>
                    <CardHeader title={`Tutores Asignados (${viewSubject?.tutors?.length || 0})`} />
                    <CardContent>
                      {viewSubject?.tutors?.length > 0
                        ? viewSubject.tutors.map(t => (
                            <Box key={t._id} display="flex" justifyContent="space-between" mb={1}>
                              <Typography>{t.name}</Typography>
                              {isAdminOrTeacher && (
                                <IconButton size="small" onClick={() => handleRemoveTutor(viewSubject.sid, t._id)} disabled={removingTutorTutor}>
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              )}
                            </Box>
                          ))
                        : <Typography>No hay tutores asignados.</Typography>
                      }
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          {/* Errores */}
          {removeTeacherError && (
            <Box mt={2}>
              <Alert severity="error">{removeTeacherError}</Alert>
            </Box>
          )}
          {removeTutorError && (
            <Box mt={2}>
              <Alert severity="error">{removeTutorError.message || removeTutorError}</Alert>
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
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => { handleViewOpen(menuSubject); handleMenuClose() }}>
          Ver detalles
        </MenuItem>
        { isAdminOrTeacher && <>
          <MenuItem onClick={() => { handleEditOpen(menuSubject); handleMenuClose() }}>
            Editar
          </MenuItem>
          <MenuItem onClick={() => { handleAddTeacherOpen(menuSubject.sid); handleMenuClose() }}>
            Agregar profesor
          </MenuItem>
          <MenuItem onClick={() => { handleViewOpen(menuSubject); handleMenuClose() }}>
            Eliminar profesor
          </MenuItem>
          <MenuItem onClick={() => { handleDelete(menuSubject.sid); handleMenuClose() }}>
            Eliminar materia
          </MenuItem>
        </> }
      </Menu>
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

export default SubjectList