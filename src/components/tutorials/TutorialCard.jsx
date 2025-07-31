import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Box,
  Typography,
  Chip,
  Button,
  IconButton,
  Collapse,
  Divider,
  Avatar,
  Tooltip,
  Grid,
  Paper
} from '@mui/material';
import {
  ExpandMore,
  Schedule,
  CheckCircle,
  Cancel,
  Pending,
  Person,
  School,
  CalendarToday,
  Visibility,
  Group,
  Share,
  PlayArrow,
  VideoCall
} from '@mui/icons-material';
import { RequestTutorial } from './RequestTutorial';

const TutorialCard = ({ tutorial, tutorialType }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [requestModalOpen, setRequestModalOpen] = useState(false);

  if (!tutorial) {
    return (
      <Card elevation={2} sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            Error: Información de tutoría no disponible
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No disponible';
    try {
      return new Date(dateString).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Fecha inválida';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'INCOURSE':
        return 'success';
      case 'COMPLETED':
        return 'info';
      case 'CANCELLED':
        return 'error';
      case 'PENDING':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'INCOURSE':
        return <PlayArrow />;
      case 'COMPLETED':
        return <CheckCircle />;
      case 'CANCELLED':
        return <Cancel />;
      case 'PENDING':
        return <Pending />;
      default:
        return <Schedule />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'INCOURSE':
        return 'En Curso';
      case 'COMPLETED':
        return 'Completada';
      case 'CANCELLED':
        return 'Cancelada';
      case 'PENDING':
        return 'Pendiente';
      default:
        return status;
    }
  };

  const getAccessColor = (access) => {
    return access === 'PRIVATE' ? 'warning' : 'success';
  };

  const getAccessText = (access) => {
    return access === 'PRIVATE' ? 'Privada' : 'Pública';
  };

  const getTutorialAccess = () => {
    if (tutorialType === 'public' || tutorialType === 'my-public') return 'PUBLIC';
    if (tutorialType === 'private' || tutorialType === 'my-private') return 'PRIVATE';
    
    if (tutorial.access) return tutorial.access;
    
    if (tutorial.student) return 'PRIVATE'; 
    if (tutorial.tutor && !tutorial.host) return 'PRIVATE';
    
    return 'PUBLIC';
  };

  const tutorialAccess = getTutorialAccess();
  const isMyTutorial = tutorialType === 'my-public' || tutorialType === 'my-private';

  return (
    <Card 
      elevation={2} 
      sx={{ 
        mb: 2, 
        transition: 'all 0.3s ease',
        '&:hover': {
          elevation: 4,
          transform: 'translateY(-2px)'
        }
      }}
    >
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Typography variant="h6" component="h3" sx={{ fontWeight: 600, color: 'primary.main', flex: 1, mr: 2 }}>
            {tutorial.topic || 'Sin título'}
          </Typography>
          <Box display="flex" gap={1} alignItems="center">
            {isMyTutorial && (
              <Chip
                label="Mis Tutorías"
                color="info"
                variant="outlined"
                size="small"
                sx={{ fontSize: '0.7rem' }}
              />
            )}
            <Chip
              icon={getStatusIcon(tutorial.status)}
              label={getStatusText(tutorial.status)}
              color={getStatusColor(tutorial.status)}
              variant="outlined"
              size="small"
            />
          </Box>
        </Box>

        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ mb: 2, lineHeight: 1.5 }}
        >
          {tutorial.description || 'Sin descripción disponible'}
        </Typography>

        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={6}>
            <Box display="flex" alignItems="center" gap={1}>
              <CalendarToday fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                <strong>Inicio:</strong> {formatDate(tutorial.startTime || tutorial.scheduledDate)}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box display="flex" alignItems="center" gap={1}>
              <Typography variant="body2" color="text.secondary">
                <strong>Acceso:</strong>
              </Typography>
              <Chip
                label={getAccessText(tutorialAccess)}
                color={getAccessColor(tutorialAccess)}
                size="small"
                variant="outlined"
              />
            </Box>
          </Grid>
        </Grid>

        <Box display="flex" justifyContent="center">
          <IconButton 
            onClick={toggleExpand}
            sx={{ 
              transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.3s ease'
            }}
          >
            <ExpandMore />
          </IconButton>
        </Box>
      </CardContent>

      <Collapse in={isExpanded} timeout="auto" unmountOnExit>
        <Divider />
        <CardContent sx={{ backgroundColor: 'grey.50' }}>
          <Typography variant="h6" gutterBottom color="primary.main">
            Información Detallada
          </Typography>
          
          <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  <strong>ID:</strong>
                </Typography>
                <Typography variant="body2" sx={{ wordBreak: 'break-all', fontSize: '0.8rem' }}>
                  {tutorial._id}
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  <strong>{tutorialAccess === 'PRIVATE' ? 'Tutor:' : 'Host:'}</strong>
                </Typography>
                <Typography variant="body2" sx={{ wordBreak: 'break-all', fontSize: '0.8rem' }}>
                  {tutorialAccess === 'PRIVATE' 
                    ? (tutorial.tutor?.name || 'No disponible')
                    : (tutorial.host?.name || 'No disponible')
                  }
                </Typography>
              </Grid>
              
              {tutorialAccess === 'PRIVATE' && tutorial.student && (
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Estudiante:</strong>
                  </Typography>
                  <Typography variant="body2" sx={{ wordBreak: 'break-all', fontSize: '0.8rem' }}>
                    {tutorial.student.name}
                  </Typography>
                </Grid>
              )}
              
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  <strong>Materia:</strong>
                </Typography>
                <Typography variant="body2" sx={{ wordBreak: 'break-all', fontSize: '0.8rem' }}>
                  {tutorial.subject?.name || 'No disponible'}
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  <strong>Fecha de Fin:</strong>
                </Typography>
                <Typography variant="body2">
                  {formatDate(tutorial.endTime || tutorial.scheduledEndTime)}
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  <strong>Creada:</strong>
                </Typography>
                <Typography variant="body2">
                  {formatDate(tutorial.createdAt)}
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  <strong>Actualizada:</strong>
                </Typography>
                <Typography variant="body2">
                  {formatDate(tutorial.updatedAt)}
                </Typography>
              </Grid>
              
              {tutorialAccess === 'PRIVATE' && tutorial.modalidad && (
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Modalidad:</strong>
                  </Typography>
                  <Typography variant="body2">
                    {tutorial.modalidad}
                  </Typography>
                </Grid>
              )}
              
              {tutorial.level && (
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Nivel:</strong>
                  </Typography>
                  <Typography variant="body2">
                    {tutorial.level}
                  </Typography>
                </Grid>
              )}
              
              
            </Grid>
          </Paper>

          <CardActions sx={{ justifyContent: 'center', gap: 1, pt: 2 }}>
            {tutorial.meetingLink && (
              <Button 
                variant="contained" 
                color="primary" 
                startIcon={<VideoCall />}
                size="small"
                href={tutorial.meetingLink}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ 
                  textTransform: 'none',
                  backgroundColor: '#6264A7', 
                  '&:hover': {
                    backgroundColor: '#5558a0'
                  }
                }}
              >
                Teams
              </Button>
            )}
            <Button 
              variant="contained" 
              color="success" 
              startIcon={<Group />}
              size="small"
              onClick={() => setRequestModalOpen(true)}
              disabled={tutorial.status !== 'INCOURSE'}
            >
              Unirse
            </Button>
          </CardActions>
        </CardContent>
      </Collapse>
      
      <RequestTutorial
        open={requestModalOpen}
        onClose={() => setRequestModalOpen(false)}
        tutorial={tutorial}
      />
    </Card>
  );
};

export default TutorialCard;
