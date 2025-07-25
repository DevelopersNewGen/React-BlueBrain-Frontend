import React, { useState, useEffect } from 'react';
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
  Grid,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  OpenInNew as OpenIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getAllMaterials, deleteMaterial } from '../../services/api';
import CreateMaterial from '../../components/material/CreateMaterial';
import useLogin from '../../shared/hooks/useLogin';
import Navbar from '../../components/Navbar';

const MaterialPage = () => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, material: null });
  const { user } = useLogin();
  const navigate = useNavigate();

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      setLoading(true);
      const response = await getAllMaterials();
      if (response.success) {
        setMaterials(response.materials || []);
      } else {
        setError('Error al cargar los materiales');
      }
    } catch (error) {
      setError('Error al cargar los materiales');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (materialId) => {
    try {
      const response = await deleteMaterial(materialId);
      if (response.success) {
        fetchMaterials();
        setDeleteDialog({ open: false, material: null });
      } else {
        setError('Error al eliminar el material');
      }
    } catch (error) {
      setError('Error al eliminar el material');
    }
  };

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
                onClick={() => setCreateDialogOpen(true)}
              >
                Crear Material
              </Button>
            )}
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Grid container spacing={3}>
            {materials.map((material) => (
              <Grid
                key={material.mid}
                sx={{
                  width: {
                    xs: '100%',
                    sm: '100%',
                    md: '50%',
                    lg: '33.33%',
                  },
                  display: 'flex',
                }}
              >
                <Card sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" gutterBottom>
                      {material.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {material.description}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                      <Chip label={material.grade} color="primary" size="small" />
                      {material.subject?.name && (
                        <Chip label={material.subject.name} color="secondary" size="small" />
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
                          color="error"
                          onClick={() => setDeleteDialog({ open: true, material })}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    )}
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>

          {materials.length === 0 && !loading && (
            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <Typography variant="h6" color="text.secondary">
                No hay materiales disponibles
              </Typography>
            </Box>
          )}

          <CreateMaterial
            open={createDialogOpen}
            onClose={() => setCreateDialogOpen(false)}
            onSuccess={fetchMaterials}
          />

          <Dialog
            open={deleteDialog.open}
            onClose={() => setDeleteDialog({ open: false, material: null })}
          >
            <DialogTitle>Confirmar eliminación</DialogTitle>
            <DialogContent>
              ¿Estás seguro de que deseas eliminar el material "{deleteDialog.material?.title}"?
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDeleteDialog({ open: false, material: null })}>
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
