import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useLogin from '../../shared/hooks/useLogin';
import UserProfile from '../../components/user/UserProfile';
import { Box, Container, Typography, Paper, Button, Grid, CircularProgress, Snackbar, Alert } from '@mui/material';
import { AccountCircle, Dashboard, InfoOutlined, SchoolOutlined, BookOutlined, EmojiObjects, Stars } from '@mui/icons-material';

import Navbar from '../../components/Navbar';
import { motion } from 'framer-motion';

export const DashboardPage = () => {
  const { user, userWithRole, login, logout, isAuthenticated } = useLogin();
  const [anchorEl, setAnchorEl] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [loadingLogin, setLoadingLogin] = useState(false);


  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const handleMenuClick = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleLogout = () => { logout(); handleMenuClose(); };
  const handleProfile = () => { setProfileOpen(true); handleMenuClose(); };
  const handleProfileClose = () => setProfileOpen(false);

  const handleLogin = async () => {
    setLoadingLogin(true);
    try {
      await login();
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setLoadingLogin(false);
    }
  };

  const handleSnackbarOpen = (message, severity = 'success') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const getWelcomeMessage = () => {
    return user?.name ? `👋 ¡Hola, ${user.name}!` : '¡Bienvenido al Dashboard!';
  };

  const getCallToAction = () => {
    switch (userWithRole?.role) {
      case 'STUDENT_ROLE':
        return '📚 ¿Listo para aprender? ¡Explora materias y encuentra tu tutor ideal!';
      case 'TUTOR_ROLE':
        return '🧑‍🏫 ¡Nuevas solicitudes te esperan! Comparte tu conocimiento.';
      case 'ADMIN_ROLE':
        return '📊 Administra y mejora la plataforma con tus decisiones.';
      default:
        return '🚀 Explora todo lo que BlueBrain tiene para ti.';
    }
  };

  if (!isAuthenticated) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
          overflow: 'hidden',
          position: 'relative',
          '@keyframes spin': {
            '0%': { transform: 'rotate(0deg)' },
            '100%': { transform: 'rotate(360deg)' },
          },
          '@keyframes spinReverse': {
            '0%': { transform: 'rotate(0deg)' },
            '100%': { transform: 'rotate(-360deg)' },
          },
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            top: 0,
            left: 0,
            zIndex: 0,
            '&::before': {
              content: '""',
              position: 'absolute',
              top: '-20%',
              left: '-20%',
              width: '140%',
              height: '140%',
              background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
              animation: 'spin 20s linear infinite',
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: '-20%',
              right: '-20%',
              width: '120%',
              height: '120%',
              background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 60%)',
              animation: 'spinReverse 18s linear infinite',
            },
          }}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          style={{ zIndex: 1 }}
        >
          <Paper
            elevation={8}
            sx={{
              p: { xs: 4, sm: 6, md: 8 },
              width: '100%',
              maxWidth: { xs: 360, sm: 450, md: 500 },
              textAlign: 'center',
              borderRadius: 4,
              boxShadow: '0 15px 30px rgba(0,0,0,0.25)',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <Box sx={{ mb: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <SchoolOutlined sx={{ fontSize: { xs: 80, sm: 90, md: 100 }, color: '#2563EB', mb: 2 }} />
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 'extrabold',
                  color: '#1E40AF',
                  letterSpacing: '0.05em',
                  background: 'linear-gradient(45deg, #2563EB 30%, #1E40AF 90%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
                }}
              >
                BlueBrain
              </Typography>
            </Box>

            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2, color: '#333', lineHeight: 1.3 }}>
              ¡Tu plataforma de tutorías personalizada!
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 5, fontSize: { xs: '0.9rem', sm: '1rem' } }}>
              Conéctate con el conocimiento. Inicia sesión para acceder a tu espacio.
            </Typography>
            <Button
              onClick={handleLogin}
              variant="contained"
              size="large"
              startIcon={loadingLogin ? <CircularProgress size={20} color="inherit" /> : <AccountCircle />}
              disabled={loadingLogin}
              sx={{
                background: 'linear-gradient(45deg, #2563EB 30%, #3B82F6 90%)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #1E40AF 30%, #2563EB 90%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 15px rgba(0,0,0,0.2)',
                },
                borderRadius: 2,
                boxShadow: 3,
                px: 5,
                py: 1.8,
                fontWeight: 'bold',
                fontSize: '1.1rem',
                transition: 'all 0.3s ease',
                color: 'white',
              }}
            >
              {loadingLogin ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </Button>
          </Paper>
        </motion.div>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundRepeat: 'repeat',
        backgroundSize: 'auto',
        backgroundAttachment: 'fixed',
        backgroundColor: '#f0f4ff',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Navbar
        user={user}
        userWithRole={userWithRole}
        onProfile={handleProfile}
        onLogout={handleLogout}
        onMenuClick={handleMenuClick}
        onMenuClose={handleMenuClose}
        anchorEl={anchorEl}
        open={open}
        navigate={navigate}
      />

      <Container
        maxWidth="lg"
        sx={{
          flexGrow: 1,
          py: { xs: 8, md: 12 },
          px: { xs: 2, md: 6 },
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Paper
            elevation={4}
            sx={{
              p: { xs: 4, md: 6 },
              mb: 10,
              borderRadius: 3,
              boxShadow: 4,
              backgroundColor: '#ffffffcc',
              backdropFilter: 'blur(6px)',
            }}
          >
            <Typography
              variant="h4"
              sx={{ fontWeight: 'bold', color: '#1E40AF', mb: 2, letterSpacing: '0.02em' }}
            >
              {getWelcomeMessage()}
            </Typography>
            <Typography variant="body1" sx={{ mb: 4, color: '#4B5563' }}>
              {getCallToAction()}
            </Typography>

            {userWithRole?.role === 'ADMIN_ROLE' && (
              <Grid container spacing={5} sx={{ mb: 2, justifyContent: 'center' }}>
                <Grid item xs={12}>
                  <Box
                    sx={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 2,
                      justifyContent: 'center',
                      mt: 4,
                    }}
                  >
                    <Button
                      variant="contained"
                      startIcon={<EmojiObjects />}
                      sx={{ bgcolor: '#2779c2', '&:hover': { bgcolor: '#2563EB' } }}
                      onClick={() => navigate('/applications')}
                    >
                      Ver Aplicaciones
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={<BookOutlined />}
                      sx={{ bgcolor: '#2779c2', '&:hover': { bgcolor: '#2563EB' } }}
                      onClick={() => navigate('/subjects')}
                    >
                      Ver Materias
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={<SchoolOutlined />}
                      sx={{ bgcolor: '#2779c2', '&:hover': { bgcolor: '#2563EB' } }}
                      onClick={() => navigate('/reportes')}
                    >
                      Ver Reportes
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={<BookOutlined />}
                      sx={{ bgcolor: '#2779c2', '&:hover': { bgcolor: '#2563EB' } }}
                      onClick={() => navigate('/usuarios')}
                    >
                      Ver Usuarios
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={<BookOutlined />}
                      sx={{ bgcolor: '#2779c2', '&:hover': { bgcolor: '#2563EB' } }}
                      onClick={() => navigate('/tutorial')}
                    >
                      Ver Tutorias
                    </Button>
                  </Box>
                </Grid>


                {[
                  { label: 'Alumnos', value: 20, icon: <SchoolOutlined fontSize="large" />, color: '#2563EB', bg: '#DBEAFE' },
                  { label: 'Tutores', value: 10, icon: <EmojiObjects fontSize="large" />, color: '#10B981', bg: '#D1FAE5' },
                  { label: 'Materias', value: 5, icon: <BookOutlined fontSize="large" />, color: '#F59E0B', bg: '#FEF3C7' },
                ].map((item, idx) => (
                  <Grid item xs={12} sm={6} md={4} key={idx} sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Paper
                      elevation={3}
                      sx={{
                        p: 6,
                        borderRadius: 4,
                        textAlign: 'center',
                        bgcolor: '#fff',
                        boxShadow: 3,
                        transition: 'all 0.3s ease-in-out',
                        '&:hover': {
                          transform: 'translateY(-6px)',
                          boxShadow: 6,
                        },
                        minWidth: { xs: '80%', sm: 'auto' }, 
                        maxWidth: { xs: '300px', sm: '100%' }
                      }}
                    >
                      <Box
                        sx={{
                          mx: 'auto',
                          mb: 3, 
                          width: 80,
                          height: 80,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: '50%',
                          backgroundColor: item.bg,
                          color: item.color,
                          '& .MuiSvgIcon-root': { 
                            fontSize: '3rem',
                          },
                        }}
                      >
                        {item.icon}
                      </Box>
                      <Typography variant="h3" fontWeight="bold" color="text.primary">
                        {item.value}
                      </Typography>
                      <Typography variant="h6" color="text.secondary">
                        {item.label}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}


              </Grid>
            )}



            {userWithRole?.role === 'STUDENT_ROLE' && (
              <Button
                variant="contained"
                startIcon={<EmojiObjects />}
                sx={{
                  bgcolor: '#2563EB',
                  '&:hover': { bgcolor: '#1E40AF' },
                  borderRadius: 2,
                  boxShadow: 3,
                  px: 3,
                  py: 1.5,
                  fontWeight: 'bold',
                }}
                onClick={() => navigate('/subjects')}
              >
                Explorar Materias
              </Button>
            )}
            {userWithRole?.role === 'TUTOR_ROLE' && (
              <Button
                variant="contained"
                startIcon={<Stars />}
                sx={{
                  bgcolor: '#16A34A',
                  '&:hover': { bgcolor: '#15803D' },
                  borderRadius: 2,
                  boxShadow: 3,
                  px: 3,
                  py: 1.5,
                  fontWeight: 'bold',
                }}
                onClick={() => navigate('/applications')}
              >
                Ver Solicitudes
              </Button>
            )}
          </Paper>
        </motion.div>

        <Grid container spacing={6} sx={{ mb: 10 }}>
          {userWithRole?.role === 'STUDENT_ROLE' && (
            <Grid item xs={12} sm={6} md={4}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Paper
                  elevation={4}
                  sx={{
                    p: 4,
                    borderRadius: 3,
                    bgcolor: '#fff',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: 4,
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'scale(1.03)',
                      boxShadow: 7,
                    },
                  }}
                  onClick={(e) =>  {navigate('/tutorial')}}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                    <BookOutlined sx={{ fontSize: 40, color: '#2563EB' }} />
                    <Typography variant="h6" sx={{ fontWeight: '600', color: '#1F2937' }}>
                      Próxima Clase
                    </Typography>
                  </Box>
                  <Typography variant="body1" sx={{ color: '#374151' }}>
                    📘 Matemáticas con Juan Pérez
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    🕒 Mañana, 10:00 AM - 11:00 AM
                  </Typography>
                  <Button
                    variant="contained"
                    size="small"
                    sx={{
                      bgcolor: '#3B82F6',
                      '&:hover': { bgcolor: '#2563EB' },
                      borderRadius: 2,
                      fontWeight: 'bold',
                    }}
                  >
                    Ir Ahora
                  </Button>
                </Paper>
              </motion.div>
            </Grid>            
          )}

          {userWithRole?.role === 'STUDENT_ROLE' && (
            <Grid item xs={12} sm={6} md={4}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Paper
                  elevation={4}
                  sx={{
                    p: 4,
                    borderRadius: 3,
                    bgcolor: '#fff',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: 4,
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'scale(1.03)',
                      boxShadow: 7,
                    },
                  }}
                  onClick={() => navigate('/materials')}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                    <EmojiObjects sx={{ fontSize: 40, color: '#2563EB' }} />
                    <Typography variant="h6" sx={{ fontWeight: '600', color: '#1F2937' }}>
                      Material Pendiente
                    </Typography>
                  </Box>
                  <Typography variant="body1" sx={{ color: '#374151' }}>
                    📄 Tienes 3 material de apoyo por completar.
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    📅 Fecha límite: 29 de agosto
                  </Typography>
                  <Button
                    variant="contained"
                    size="small"
                    sx={{
                      bgcolor: '#3B82F6',
                      '&:hover': { bgcolor: '#2563EB' },
                      borderRadius: 2,
                      fontWeight: 'bold',
                    }}
                  >
                    Revisar Tareas
                  </Button>
                </Paper>
              </motion.div>
            </Grid>
          )}

           {userWithRole?.role === 'STUDENT_ROLE' && (
            <Grid item xs={12} sm={6} md={4}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Paper
                  elevation={4}
                  sx={{
                    p: 4,
                    borderRadius: 3,
                    bgcolor: '#fff',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: 4,
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'scale(1.03)',
                      boxShadow: 7,
                    },
                  }}
                  onClick={() => navigate('/tutorial')}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                    <BookOutlined sx={{ fontSize: 40, color: '#2563EB' }} />
                    <Typography variant="h6" sx={{ fontWeight: '600', color: '#1F2937' }}>
                      Próxima Clase
                    </Typography>
                  </Box>
                  <Typography variant="body1" sx={{ color: '#374151' }}>
                    📘 Física con Julio Pop
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    🕒 Mañana, 09:00 AM - 10:00 AM
                  </Typography>
                  <Button
                    variant="contained"
                    size="small"
                    sx={{
                      bgcolor: '#3B82F6',
                      '&:hover': { bgcolor: '#2563EB' },
                      borderRadius: 2,
                      fontWeight: 'bold',
                    }}
                  >
                    Ir Ahora
                  </Button>
                </Paper>
              </motion.div>
            </Grid>
          )}

          {userWithRole?.role === 'TUTOR_ROLE' && (
            <Grid item xs={12} sm={6} md={4}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Paper
                  elevation={4}
                  sx={{
                    p: 4,
                    borderRadius: 3,
                    bgcolor: '#fff',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: 4,
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'scale(1.03)',
                      boxShadow: 7,
                    },
                  }}
                  onClick={() => navigate('/applications')}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                    <SchoolOutlined sx={{ fontSize: 40, color: '#16A34A' }} />
                    <Typography variant="h6" sx={{ fontWeight: '600', color: '#1F2937' }}>
                      Nuevas Solicitudes
                    </Typography>
                  </Box>
                  <Typography variant="body1" sx={{ color: '#374151' }}>
                    👥 Tienes{' '}
                    <strong style={{ color: '#15803D', fontSize: '1.125rem' }}>
                      3
                    </strong>{' '}
                    solicitudes pendientes.
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    ¡Comparte tu experiencia!
                  </Typography>
                  <Button
                    variant="contained"
                    size="small"
                    sx={{
                      bgcolor: '#22C55E',
                      '&:hover': { bgcolor: '#15803D' },
                      borderRadius: 2,
                      fontWeight: 'bold',
                    }}
                  >
                    Revisar Solicitudes
                  </Button>
                </Paper>
              </motion.div>
            </Grid>
          )}
        </Grid>
      </Container>

      <UserProfile open={profileOpen} onClose={handleProfileClose} user={user} />

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000} 
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} 
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: '100%', borderRadius: 2 }}
          variant="filled" 
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

    </Box>
  );
};