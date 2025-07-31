import React, { useState } from 'react';
import {
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Box,
  Chip,
  IconButton,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  OpenInNew as OpenIcon
} from '@mui/icons-material';
import CreateMaterial from '../../components/material/CreateMaterial';
import EditMaterial from '../../components/material/EditMaterial';
import useLogin from '../../shared/hooks/useLogin';
import useMaterialPage from '../../shared/hooks/useMaterialPage';
import { useSubjectGets } from '../../shared/hooks/useSubjectGets';
import Navbar from '../../components/Navbar';

const MaterialPage = () => {
  const { user, userWithRole } = useLogin();
  
  const [selectedSubject, setSelectedSubject] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  const { subjects, loading: loadingSubjects, error: subjectsError } = useSubjectGets();
  
  const {
    materials,
    loading,
    error,
    createDialogOpen,
    editDialog,
    deleteDialog,
    handleDelete,
    handleCreateDialogOpen,
    handleCreateDialogClose,
    handleEditDialogOpen,
    handleEditDialogClose,
    handleDeleteDialogOpen,
    handleDeleteDialogClose,
    handleCreateSuccess,
    handleEditSuccess,
    clearError
  } = useMaterialPage();

  const canManageMaterials = userWithRole?.role === 'ADMIN_ROLE' || userWithRole?.role === 'TEACHER_ROLE';

  const filteredMaterials = materials.filter(material => {
    const matchesSubject = selectedSubject ? material.subject?._id === selectedSubject : true;
    
    const matchesSearch = searchTerm 
      ? material.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        material.description?.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    
    return matchesSubject && matchesSearch;
  });

  const handleSubjectChange = (event) => {
    setSelectedSubject(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <>
      <Navbar user={user} userWithRole={userWithRole} />
      
      {loading ? (
        <Container sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
          <CircularProgress color="primary" size={50} />
        </Container>
      ) : (
        <Container maxWidth="lg" sx={{ mt: 5, mb: 8 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography 
              variant="h4" 
              component="h1"
              sx={{ fontWeight: 'bold', color: '#0D47A1' /* azul intenso */, letterSpacing: 1 }}
            >
              Materiales Educativos
            </Typography>
            {canManageMaterials && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleCreateDialogOpen}
                sx={{ 
                  backgroundColor: '#1976d2', 
                  '&:hover': { backgroundColor: '#1565c0' },
                  boxShadow: '0 3px 6px rgba(25, 118, 210, 0.4)'
                }}
              >
                Crear Material
              </Button>
            )}
          </Box>

          <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            <TextField
              label="Buscar por nombre"
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={handleSearchChange}
              sx={{ minWidth: 250 }}
              placeholder="Buscar materiales..."
            />
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel id="subject-filter-label">Filtrar por materia</InputLabel>
              <Select
                labelId="subject-filter-label"
                id="subject-filter"
                value={selectedSubject}
                label="Filtrar por materia"
                onChange={handleSubjectChange}
                disabled={loadingSubjects}
                size="small"
              >
                <MenuItem value="">
                  <em>Todas las materias</em>
                </MenuItem>
                {subjects.map((subject) => (
                  <MenuItem key={subject.sid} value={subject.sid}>
                    {subject.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {loadingSubjects && <Typography sx={{ ml: 2 }}>Cargando materias...</Typography>}
          </Box>

          {error && (
            <Alert 
              severity="error" 
              sx={{ mb: 3, fontWeight: 'medium', fontSize: '1rem' }}
              onClose={clearError}
            >
              {error}
            </Alert>
          )}

          {subjectsError && (
            <Alert 
              severity="warning" 
              sx={{ mb: 3 }}
            >
              Error al cargar materias: {subjectsError}
            </Alert>
          )}

          <Box 
            sx={{ 
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)'
              },
              gap: 4
            }}
          >
            {filteredMaterials.map((material) => (
              <Card key={material.mid} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    {material.title}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ mb: 2, minHeight: 48, lineHeight: 1.4 }}
                  >
                    {material.description || 'Sin descripción disponible'}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                    <Chip 
                      label={material.grade} 
                      color="primary" 
                      size="small"
                      sx={{ fontWeight: '600' }}
                    />
                    {material.subject?.name && (
                      <Chip 
                        label={material.subject.name} 
                        color="secondary" 
                        size="small" 
                        sx={{ fontWeight: '600' }}
                      />
                    )}
                  </Box>
                  {material.uploaderId?.name && (
                    <Typography 
                      variant="caption" 
                      color="text.secondary" 
                      sx={{ fontStyle: 'italic' }}
                    >
                      Subido por: {material.uploaderId.name}
                    </Typography>
                  )}
                </CardContent>

                <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                  <Button
                    size="small"
                    startIcon={<OpenIcon />}
                    onClick={() => window.open(material.fileUrl, '_blank')}
                    sx={{
                      color: '#0D47A1',
                      fontWeight: '600',
                      '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.1)' }
                    }}
                  >
                    Ver Material
                  </Button>

                  {canManageMaterials && (
                    <Box>
                      <IconButton 
                        size="small" 
                        color="primary"
                        aria-label={`Editar material ${material.title}`}
                        onClick={() => handleEditDialogOpen(material)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        color="error"
                        aria-label={`Eliminar material ${material.title}`}
                        onClick={() => handleDeleteDialogOpen(material)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  )}
                </CardActions>
              </Card>
            ))}
          </Box>

          {materials.length === 0 && !loading && (
            <Box sx={{ textAlign: 'center', mt: 6 }}>
              <Typography variant="h6" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                No hay materiales disponibles
              </Typography>
              {(selectedSubject || searchTerm) && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Intenta cambiar los filtros o buscar con otros términos
                </Typography>
              )}
            </Box>
          )}

          <CreateMaterial
            open={createDialogOpen}
            onClose={handleCreateDialogClose}
            onSuccess={handleCreateSuccess}
          />

          <EditMaterial
            open={editDialog.open}
            onClose={handleEditDialogClose}
            onSuccess={handleEditSuccess}
            material={editDialog.material}
          />

          <Dialog
            open={deleteDialog.open}
            onClose={handleDeleteDialogClose}
            aria-labelledby="delete-dialog-title"
            aria-describedby="delete-dialog-description"
            sx={{
              '& .MuiDialog-paper': {
                borderRadius: 3,
                padding: 2,
                boxShadow: '0 8px 24px rgba(0, 71, 171, 0.3)'
              }
            }}
          >
            <DialogTitle id="delete-dialog-title" sx={{ color: '#d32f2f', fontWeight: 'bold' }}>
              Confirmar eliminación
            </DialogTitle>
            <DialogContent id="delete-dialog-description" sx={{ fontSize: '1rem' }}>
              ¿Estás seguro de que deseas eliminar el material "{deleteDialog.material?.title}"?
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDeleteDialogClose} variant="outlined">
                Cancelar
              </Button>
              <Button 
                color="error" 
                variant="contained"
                onClick={() => handleDelete(deleteDialog.material.mid)}
              >
                Eliminar
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
      )}
    </>
  );
};

export default MaterialPage;