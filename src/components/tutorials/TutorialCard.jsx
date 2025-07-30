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
  PlayArrow
} from '@mui/icons-material';
import { RequestTutorial } from './RequestTutorial';

const TutorialCard = ({ tutorial }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [requestModalOpen, setRequestModalOpen] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
            {tutorial.topic}
          </Typography>
          <Chip
            icon={getStatusIcon(tutorial.status)}
            label={getStatusText(tutorial.status)}
            color={getStatusColor(tutorial.status)}
            variant="outlined"
            size="small"
          />
        </Box>

        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ mb: 2, lineHeight: 1.5 }}
        >
          {tutorial.description}
        </Typography>

        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={6}>
            <Box display="flex" alignItems="center" gap={1}>
              <CalendarToday fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                <strong>Inicio:</strong> {formatDate(tutorial.startTime)}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box display="flex" alignItems="center" gap={1}>
              <Typography variant="body2" color="text.secondary">
                <strong>Acceso:</strong>
              </Typography>
              <Chip
                label={getAccessText(tutorial.access)}
                color={getAccessColor(tutorial.access)}
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
                  <strong>Host:</strong>
                </Typography>
                <Typography variant="body2" sx={{ wordBreak: 'break-all', fontSize: '0.8rem' }}>
                  {tutorial.host.name}
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  <strong>Materia:</strong>
                </Typography>
                <Typography variant="body2" sx={{ wordBreak: 'break-all', fontSize: '0.8rem' }}>
                  {tutorial.subject.name}
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  <strong>Fecha de Fin:</strong>
                </Typography>
                <Typography variant="body2">
                  {formatDate(tutorial.endTime)}
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
            </Grid>
          </Paper>

          <CardActions sx={{ justifyContent: 'center', gap: 1, pt: 2 }}>
            <Button 
              variant="contained" 
              color="primary" 
              startIcon={<Visibility />}
              size="small"
            >
              Ver Detalles
            </Button>
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
            <Button 
              variant="outlined" 
              color="primary" 
              startIcon={<Share />}
              size="small"
            >
              Compartir
            </Button>
          </CardActions>
        </CardContent>
      </Collapse>
      
      {/* Modal para solicitar tutoría */}
      <RequestTutorial
        open={requestModalOpen}
        onClose={() => setRequestModalOpen(false)}
        tutorial={tutorial}
      />
    </Card>
  );
};

export default TutorialCard;
