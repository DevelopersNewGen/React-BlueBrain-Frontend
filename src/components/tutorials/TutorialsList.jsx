import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Container,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment
} from '@mui/material';
import {
  Search,
  FilterList,
  Refresh,
  Add
} from '@mui/icons-material';
import TutorialCard from './TutorialCard';
import { CreateTutorial } from './CreateTutorial';
import { useTutorials } from '../../shared/hooks/useTutorials';
import useLogin from '../../shared/hooks/useLogin';

const TutorialsList = () => {
  const {
    tutorials,
    loading,
    error,
    refreshTutorials,
    clearError
  } = useTutorials();

  const { userWithRole } = useLogin();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [accessFilter, setAccessFilter] = useState('all');
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // Verificar si el usuario puede crear tutorías
  const canCreateTutorials = userWithRole?.role === 'TUTOR_ROLE' || userWithRole?.role === 'TEACHER_ROLE';

  const handleRefresh = () => {
    refreshTutorials();
  };

  const handleCreateTutorial = () => {
    setCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setCreateModalOpen(false);
    // Refrescar la lista después de crear una tutoría
    handleRefresh();
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
  };

  const handleAccessFilterChange = (event) => {
    setAccessFilter(event.target.value);
  };

  const filteredTutorials = tutorials.filter((tutorial) => {
    const matchesSearch = tutorial.topic?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tutorial.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || tutorial.status === statusFilter;
    const matchesAccess = accessFilter === 'all' || tutorial.access === accessFilter;
    
    return matchesSearch && matchesStatus && matchesAccess;
  });

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
          <Typography variant="body1" sx={{ ml: 2 }}>
            Cargando tutorías...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Alert 
          severity="error" 
          action={
            <Button color="inherit" size="small" onClick={() => {
              clearError();
              handleRefresh();
            }}>
              Reintentar
            </Button>
          }
        >
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom color="primary.main">
            Tutorías Disponibles
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Explora y únete a las tutorías disponibles
            {canCreateTutorials && (
              <Typography component="span" variant="body2" color="primary.main" sx={{ ml: 1 }}>
                • Puedes crear nuevas tutorías
              </Typography>
            )}
          </Typography>
        </Box>
        <Box display="flex" gap={2}>
          {canCreateTutorials && (
            <Button 
              variant="contained" 
              onClick={handleCreateTutorial}
              startIcon={<Add />}
              sx={{ mr: 1 }}
            >
              Crear Tutoría
            </Button>
          )}
          <Button 
            variant="outlined" 
            onClick={handleRefresh}
            disabled={loading}
            startIcon={<Refresh />}
          >
            Actualizar
          </Button>
        </Box>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Buscar tutorías..."
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search color="action" />
                  </InputAdornment>
                ),
              }}
              size="small"
            />
          </Grid>
          
          <Grid item xs={6} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Estado</InputLabel>
              <Select
                value={statusFilter}
                label="Estado"
                onChange={handleStatusFilterChange}
              >
                <MenuItem value="all">Todos</MenuItem>
                <MenuItem value="INCOURSE">En Curso</MenuItem>
                <MenuItem value="PENDING">Pendiente</MenuItem>
                <MenuItem value="COMPLETED">Completada</MenuItem>
                <MenuItem value="CANCELLED">Cancelada</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={6} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Acceso</InputLabel>
              <Select
                value={accessFilter}
                label="Acceso"
                onChange={handleAccessFilterChange}
              >
                <MenuItem value="all">Todos</MenuItem>
                <MenuItem value="PUBLIC">Público</MenuItem>
                <MenuItem value="PRIVATE">Privado</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: { xs: 'left', md: 'right' } }}>
              {filteredTutorials.length} de {tutorials.length} tutorías
            </Typography>
          </Grid>
        </Grid>
      </Box>

      {filteredTutorials.length === 0 ? (
        <Box textAlign="center" py={4}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No se encontraron tutorías
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Intenta ajustar los filtros de búsqueda
          </Typography>
        </Box>
      ) : (
        <Box>
          {filteredTutorials.map((tutorial) => (
            <TutorialCard key={tutorial._id} tutorial={tutorial} />
          ))}
        </Box>
      )}

      {/* Modal para crear tutoría */}
      <CreateTutorial 
        open={createModalOpen} 
        onClose={handleCloseCreateModal} 
      />
    </Container>
  );
};

export default TutorialsList;
