import React from 'react';
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
  DialogActions
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  OpenInNew as OpenIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import CreateMaterial from '../../components/material/CreateMaterial';
import EditMaterial from '../../components/material/EditMaterial';
import useLogin from '../../shared/hooks/useLogin';
import useMaterialPage from '../../shared/hooks/useMaterialPage';
import Navbar from '../../components/Navbar';

const MaterialPage = () => {
  const { user } = useLogin();
  const navigate = useNavigate();
  
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

  const canManageMaterials = user?.role === 'ADMIN_ROLE' || user?.role === 'TEACHER_ROLE';

  return (
    <>
      <Navbar user={user} navigate={navigate} />
      
      {loading ? (
        <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Container>
      ) : (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h4" component="h1">
              Materiales Educativos
            </Typography>
            {canManageMaterials && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleCreateDialogOpen}
              >
                Crear Material
              </Button>
            )}
          </Box>

          {error && (
            <Alert 
              severity="error" 
              sx={{ mb: 3 }}
              onClose={clearError}
            >
              {error}
            </Alert>
          )}

          <Box 
            sx={{ 
              display: 'grid',
              gridTemplateColumns: {
                xs: 'repeat(1, 1fr)',
                md: 'repeat(2, 1fr)', 
                lg: 'repeat(3, 1fr)'
              },
              gap: 3
            }}
          >
            {materials.map((material) => (
              <Card key={material.mid} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    {material.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {material.description}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <Chip 
                      label={material.grade} 
                      color="primary" 
                      size="small" 
                    />
                    {material.subject?.name && (
                      <Chip 
                        label={material.subject.name} 
                        color="secondary" 
                        size="small" 
                      />
                    )}
                  </Box>
                  {material.uploaderId?.name && (
                    <Typography variant="caption" color="text.secondary">
                      Subido por: {material.uploaderId.name}
                    </Typography>
                  )}
                </CardContent>
                <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                  <Button
                    size="small"
                    startIcon={<OpenIcon />}
                    onClick={() => window.open(material.fileUrl, '_blank')}
                  >
                    Ver Material
                  </Button>
                  {canManageMaterials && (
                    <Box>
                      <IconButton 
                        size="small" 
                        color="primary"
                        onClick={() => handleEditDialogOpen(material)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        color="error"
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
            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <Typography variant="h6" color="text.secondary">
                No hay materiales disponibles
              </Typography>
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
          >
            <DialogTitle id="delete-dialog-title">
              Confirmar eliminación
            </DialogTitle>
            <DialogContent id="delete-dialog-description">
              ¿Estás seguro de que deseas eliminar el material "{deleteDialog.material?.title}"?
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDeleteDialogClose}>
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