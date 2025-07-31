import React, { useState, useEffect, useCallback } from 'react';
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
  InputAdornment,
  Tabs,
  Tab
} from '@mui/material';
import {
  Search,
  FilterList,
  Refresh,
  Add,
  School,
  Public,
  Lock,
  Person,
  PersonalVideo,
  Assignment,
  Psychology
} from '@mui/icons-material';
import TutorialCard from './TutorialCard';
import { CreateTutorial } from './CreateTutorial';
import { TutorialRequest } from './TutorialRequest';
import { useTutorials } from '../../shared/hooks/useTutorials';
import { usePublicTutorials } from '../../shared/hooks/usePublicTutorials';
import { usePrivateTutorials } from '../../shared/hooks/usePrivateTutorials';
import useLogin from '../../shared/hooks/useLogin';

const TutorialsList = () => {
  const {
    tutorials,
    loading,
    error,
    refreshTutorials,
    clearError,
    fetchTutorialsByTutor
  } = useTutorials();

  const {
    publicTutorials,
    loading: publicLoading,
    error: publicError,
    refetch: refetchPublic,
    fetchMyPublicTutorials
  } = usePublicTutorials();

  const {
    privateTutorials,
    loading: privateLoading,
    error: privateError,
    refetch: refetchPrivate,
    fetchMyPrivateTutorials
  } = usePrivateTutorials();

  const { userWithRole } = useLogin();

  const [myPublicTutorials, setMyPublicTutorials] = useState([]);
  const [myPrivateTutorials, setMyPrivateTutorials] = useState([]);
  const [myTutorTutorials, setMyTutorTutorials] = useState([]);
  const [myPublicLoading, setMyPublicLoading] = useState(false);
  const [myPrivateLoading, setMyPrivateLoading] = useState(false);
  const [myTutorLoading, setMyTutorLoading] = useState(false);
  const [myPublicError, setMyPublicError] = useState(null);
  const [myPrivateError, setMyPrivateError] = useState(null);
  const [myTutorError, setMyTutorError] = useState(null);
  const [myPublicLoaded, setMyPublicLoaded] = useState(false);
  const [myPrivateLoaded, setMyPrivateLoaded] = useState(false);
  const [myTutorLoaded, setMyTutorLoaded] = useState(false);

  const [currentTab, setCurrentTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const canCreateTutorials = userWithRole?.role === 'TUTOR_ROLE' || userWithRole?.role === 'TEACHER_ROLE';
  const isAdmin = userWithRole?.role === 'ADMIN_ROLE';
  const canSeeMisTutorias = !isAdmin; 

  const getIsRequestsTab = () => {
    let requestsIndex = 3;
    if (canSeeMisTutorias) requestsIndex += 2; 
    if (canCreateTutorials) requestsIndex += 1;
    return currentTab === requestsIndex;
  };

  const refetchMyPublic = useCallback(async () => {
    if (myPublicLoading) return; 
    
    setMyPublicLoading(true);
    setMyPublicError(null);
    try {
      const result = await fetchMyPublicTutorials();
      if (result.success) {
        setMyPublicTutorials(result.data);
        setMyPublicLoaded(true);
      } else {
        setMyPublicError('Error al cargar mis tutorías públicas');
      }
    } catch (err) {
      setMyPublicError('Error de conexión: ' + err.message);
    } finally {
      setMyPublicLoading(false);
    }
  }, [fetchMyPublicTutorials, myPublicLoading]);

  const refetchMyPrivate = useCallback(async () => {
    if (myPrivateLoading) return; 
    
    setMyPrivateLoading(true);
    setMyPrivateError(null);
    try {
      const result = await fetchMyPrivateTutorials();
      if (result.success) {
        setMyPrivateTutorials(result.data);
        setMyPrivateLoaded(true);
      } else {
        setMyPrivateError('Error al cargar mis tutorías privadas');
      }
    } catch (err) {
      setMyPrivateError('Error de conexión: ' + err.message);
    } finally {
      setMyPrivateLoading(false);
    }
  }, [fetchMyPrivateTutorials, myPrivateLoading]);

  const refetchMyTutorTutorials = useCallback(async () => {
    if (myTutorLoading) return; 
    
    setMyTutorLoading(true);
    setMyTutorError(null);
    try {
      const result = await fetchTutorialsByTutor();
      if (result.success) {
        setMyTutorTutorials(result.data);
        setMyTutorLoaded(true);
      } else {
        setMyTutorError('Error al cargar mis tutorías como tutor');
      }
    } catch (err) {
      setMyTutorError('Error de conexión: ' + err.message);
    } finally {
      setMyTutorLoading(false);
    }
  }, [fetchTutorialsByTutor, myTutorLoading]);

  const handleRefresh = () => {
    if (currentTab === 0) {
      refreshTutorials();
    } else if (currentTab === 1) {
      refetchPublic();
    } else if (currentTab === 2) {
      refetchPrivate();
    } else {
      let nextIndex = 3;
      
      if (canSeeMisTutorias) {
        if (currentTab === nextIndex) {
          setMyPublicLoaded(false);
          refetchMyPublic();
          return;
        }
        nextIndex++;
        if (currentTab === nextIndex) {
          setMyPrivateLoaded(false);
          refetchMyPrivate();
          return;
        }
        nextIndex++;
      }
      
      if (canCreateTutorials) {
        if (currentTab === nextIndex) {
          setMyTutorLoaded(false);
          refetchMyTutorTutorials();
          return;
        }
        nextIndex++;
        if (currentTab === nextIndex) {
          refetchPrivate();
          return;
        }
      }
    }
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
    setSearchTerm('');
    setStatusFilter('all');
  };

  useEffect(() => {
    if (currentTab === 1 && (!publicTutorials || publicTutorials.length === 0) && !publicLoading && !publicError) {
      refetchPublic();
    } else if (currentTab === 2 && (!privateTutorials || privateTutorials.length === 0) && !privateLoading && !privateError) {
      refetchPrivate();
    } else {
      let nextIndex = 3;
      
      if (canSeeMisTutorias) {
        if (currentTab === nextIndex && !myPublicLoaded && !myPublicLoading && !myPublicError) {
          refetchMyPublic();
          return;
        }
        nextIndex++;
        if (currentTab === nextIndex && !myPrivateLoaded && !myPrivateLoading && !myPrivateError) {
          refetchMyPrivate();
          return;
        }
        nextIndex++;
      }
      
      if (canCreateTutorials) {
        if (currentTab === nextIndex && !myTutorLoaded && !myTutorLoading && !myTutorError) {
          refetchMyTutorTutorials();
          return;
        }
      }
    }
  }, [currentTab, canSeeMisTutorias, canCreateTutorials, myPublicLoaded, myPrivateLoaded, myTutorLoaded, publicLoading, privateLoading, myPublicLoading, myPrivateLoading, myTutorLoading, publicError, privateError, myPublicError, myPrivateError, myTutorError, publicTutorials, privateTutorials, refetchPublic, refetchPrivate, refetchMyPublic, refetchMyPrivate, refetchMyTutorTutorials]);

  const getCurrentTutorials = () => {
    if (currentTab === 0) return tutorials || []; 
    if (currentTab === 1) return publicTutorials || []; 
    if (currentTab === 2) return privateTutorials || []; 
    
    let nextIndex = 3;
    
    if (canSeeMisTutorias) {
      if (currentTab === nextIndex) return myPublicTutorials || []; 
      nextIndex++;
      if (currentTab === nextIndex) return myPrivateTutorials || []; 
      nextIndex++;
    }
    
    if (canCreateTutorials) {
      if (currentTab === nextIndex) return myTutorTutorials?.tutorials || []; 
      nextIndex++;
      if (currentTab === nextIndex) return []; 
    }
    
    return tutorials || [];
  };

  const getCurrentLoading = () => {
    if (currentTab === 0) return loading;
    if (currentTab === 1) return publicLoading;
    if (currentTab === 2) return privateLoading;
    
    let nextIndex = 3;
    
    if (canSeeMisTutorias) {
      if (currentTab === nextIndex) return myPublicLoading;
      nextIndex++;
      if (currentTab === nextIndex) return myPrivateLoading;
      nextIndex++;
    }
    
    if (canCreateTutorials) {
      if (currentTab === nextIndex) return myTutorLoading;
      nextIndex++;
      if (currentTab === nextIndex) return false; 
    }
    
    return loading;
  };

  const getCurrentError = () => {
    if (currentTab === 0) return error;
    if (currentTab === 1) return publicError;
    if (currentTab === 2) return privateError;
    
    let nextIndex = 3;
    
    if (canSeeMisTutorias) {
      if (currentTab === nextIndex) return myPublicError;
      nextIndex++;
      if (currentTab === nextIndex) return myPrivateError;
      nextIndex++;
    }
    
    if (canCreateTutorials) {
      if (currentTab === nextIndex) return myTutorError;
      nextIndex++;
      if (currentTab === nextIndex) return null; 
    }
    
    return error;
  };

  const currentTutorials = getCurrentTutorials();
  const currentLoading = getCurrentLoading();
  const currentError = getCurrentError();

  const filteredTutorials = (currentTutorials || []).filter((tutorial) => {
    const matchesSearch = tutorial.topic?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tutorial.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || tutorial.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleCreateTutorial = () => {
    setCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setCreateModalOpen(false);
    setMyPublicLoaded(false);
    setMyPrivateLoaded(false);
    setMyTutorLoaded(false);
    handleRefresh();
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
  };

  const getStatusOptions = () => {
    if (currentTab === 2 || currentTab === 4) {
      return [
        { value: 'all', label: 'Todos' },
        { value: 'PENDING', label: 'Pendiente' },
        { value: 'ACCEPTED', label: 'Aceptada' },
        { value: 'REJECTED', label: 'Rechazada' }
      ];
    }
    return [
      { value: 'all', label: 'Todos' },
      { value: 'INCOURSE', label: 'En Curso' },
      { value: 'PENDING', label: 'Pendiente' },
      { value: 'COMPLETED', label: 'Completada' },
      { value: 'CANCELLED', label: 'Cancelada' }
    ];
  };

  if (currentLoading) {
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

  if (currentError) {
    return (
      <Container maxWidth="lg">
        <Alert 
          severity="error" 
          action={
            <Button color="inherit" size="small" onClick={() => {
              if (currentTab === 0) {
                clearError();
              }
              handleRefresh();
            }}>
              Reintentar
            </Button>
          }
        >
          {currentError}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom color="primary.main">
            Tutorías
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {currentTab === 0 && "Explora y únete a las tutorías disponibles"}
            {currentTab === 1 && "Tutorías públicas disponibles"}
            {currentTab === 2 && "Tutorías privadas disponibles"}
            {(() => {
              let nextIndex = 3;
              let description = "";
              
              if (canSeeMisTutorias) {
                if (currentTab === nextIndex) description = "Tutorías públicas a las que estás inscrito";
                nextIndex++;
                if (currentTab === nextIndex) description = "Tutorías privadas a las que estás inscrito";
                nextIndex++;
              }
              
              if (canCreateTutorials) {
                if (currentTab === nextIndex) description = "Tutorías que has creado como tutor";
                nextIndex++;
                if (currentTab === nextIndex) description = "Gestiona las solicitudes de tutorías privadas";
              }
              
              return description;
            })()}
            {canCreateTutorials && !getIsRequestsTab() && (
              <Typography component="span" variant="body2" color="primary.main" sx={{ ml: 1 }}>
                • Puedes crear nuevas tutorías
              </Typography>
            )}
          </Typography>
        </Box>
        <Box display="flex" gap={2}>
          {canCreateTutorials && !getIsRequestsTab() && (
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
            disabled={currentLoading}
            startIcon={<Refresh />}
          >
            Actualizar
          </Button>
        </Box>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs 
          value={currentTab} 
          onChange={handleTabChange}
          aria-label="tutorial tabs"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab 
            icon={<Public />} 
            label="Todas las Tutorías" 
            iconPosition="start" 
          />
          <Tab 
            icon={<School />} 
            label="Tutorías Públicas" 
            iconPosition="start" 
          />
          <Tab 
            icon={<Lock />} 
            label="Tutorías Privadas" 
            iconPosition="start" 
          />
          {canSeeMisTutorias && (
            <Tab 
              icon={<Person />} 
              label="Mis Tutorías Públicas" 
              iconPosition="start" 
            />
          )}
          {canSeeMisTutorias && (
            <Tab 
              icon={<PersonalVideo />} 
              label="Mis Tutorías Privadas" 
              iconPosition="start" 
            />
          )}
          {canCreateTutorials && (
            <Tab 
              icon={<Psychology />} 
              label="Mis Tutorías Creadas" 
              iconPosition="start" 
            />
          )}
          {canCreateTutorials && (
            <Tab 
              icon={<Assignment />} 
              label="Solicitudes Pendientes" 
              iconPosition="start" 
            />
          )}
        </Tabs>
      </Box>

      <Box sx={{ mb: 3 }}>
        {getIsRequestsTab() ? (
          <Typography variant="body2" color="text.secondary">
            Panel de gestión de solicitudes de tutorías privadas
          </Typography>
        ) : (
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
            
            <Grid item xs={12} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Estado</InputLabel>
                <Select
                  value={statusFilter}
                  label="Estado"
                  onChange={handleStatusFilterChange}
                >
                  {getStatusOptions().map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={5}>
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                {filteredTutorials.length} de {(currentTutorials || []).length} tutorías
              </Typography>
            </Grid>
          </Grid>
        )}
      </Box>

      {getIsRequestsTab() ? (
        <TutorialRequest />
      ) : filteredTutorials.length === 0 ? (
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
          {filteredTutorials.map((tutorial) => {
            let tutorialType = 'mixed';
            if (currentTab === 1) tutorialType = 'public';
            else if (currentTab === 2) tutorialType = 'private';
            else if (currentTab === 3) tutorialType = 'my-public';
            else if (currentTab === 4) tutorialType = 'my-private';
            else if (currentTab === 5) tutorialType = 'my-created';
            
            return (
              <TutorialCard 
                key={tutorial._id} 
                tutorial={tutorial} 
                tutorialType={tutorialType}
                user={userWithRole}
              />
            );
          })}
        </Box>
      )}

      <CreateTutorial 
        open={createModalOpen} 
        onClose={handleCloseCreateModal} 
      />
    </Container>
  );
};

export default TutorialsList;
