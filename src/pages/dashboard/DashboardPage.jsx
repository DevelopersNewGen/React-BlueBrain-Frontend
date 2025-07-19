import React, { useState } from 'react';
import useLogin from '../../shared/hooks/useLogin';
import UserProfile from '../../components/user/UserProfile';
import { Box, Container, Typography, Button, AppBar, Toolbar, Paper, Avatar, Menu, MenuItem, ListItemIcon, IconButton } from '@mui/material';
import { AccountCircle, ExitToApp, Dashboard, Person } from '@mui/icons-material';

export const DashboardPage = () => {
  const { user, userWithRole, login, logout, isAuthenticated } = useLogin();
  const [anchorEl, setAnchorEl] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleLogout = () => { logout(); handleMenuClose(); };
  const handleProfile = () => { setProfileOpen(true); handleMenuClose(); };
  const handleProfileClose = () => setProfileOpen(false);

  const menuOptionsByRole = {
  ADMIN_ROLE: [
    { name: 'Material' },
    { name: 'Usuarios' },
    { name: 'Materias' },
    { name: 'Reportes' },
    { name: 'Solicitudes' }
  ],
  STUDENT_ROLE: [
    { name: 'Material' },
    { name: 'Mi perfil' },
    { name: 'Materias' },
    { name: 'Reportes' },
    { name: 'Solicitudes' }
  ],
  TEACHER_ROLE: [
    { name: 'Material' },
    { name: 'Mi perfil' },
    { name: 'Estudiantes' },
    { name: 'Materias' },
    { name: 'Reportes' },
    { name: 'Solicitudes' }
  ],
  TUTOR_ROLE: [
    { name: 'Material' },
    { name: 'Mi perfil' },
    { name: 'Tutoreados' },
    { name: 'Materias' },
    { name: 'Reportes' },
    { name: 'Solicitudes' }
  ]
};

  if (!isAuthenticated) {
    return (
      <Container maxWidth="sm">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
          }}
        >
          <Paper
            elevation={3}
            sx={{
              p: 4,
              textAlign: 'center',
              width: '100%',
              maxWidth: 400,
            }}
          >
            <Dashboard
              sx={{
                fontSize: 64,
                color: 'primary.main',
                mb: 2,
              }}
            />
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              sx={{ fontWeight: 'bold' }}
            >
              Bienvenido a BlueBrain
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mb: 3 }}
            >
              Necesitas iniciar sesión para acceder al dashboard
            </Typography>
            <Button
              onClick={login}
              variant="contained"
              size="large"
              startIcon={<AccountCircle />}
            >
              Iniciar sesión
            </Button>
          </Paper>
        </Box>
      </Container>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" elevation={1}>
        <Toolbar>
          <Dashboard sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            BlueBrain Dashboard
          </Typography>
          {userWithRole?.role && (
            <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
              {menuOptionsByRole[userWithRole.role]?.map((option) => (
                <Button
                  key={option.name}
                  sx={{ my: 2, color: 'white', display: 'block', alignItems: 'center', mx: 1, textTransform: 'none' }}
                >
                  {option.name.toUpperCase()}
                </Button>
              ))}
            </Box>
          )}
          <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto' }}>
            <IconButton onClick={handleMenuClick} sx={{ p: 0 }}>
              <Avatar src={user?.profilePicture || user?.img} />
            </IconButton>
            <Menu
              sx={{ mt: '45px' }}
              anchorEl={anchorEl}
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              keepMounted
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={handleProfile}>
                <ListItemIcon>
                  <Person fontSize="small" />
                </ListItemIcon>
                Ver perfil
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <ExitToApp fontSize="small" />
                </ListItemIcon>
                Cerrar sesión
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper
          elevation={3}
          sx={{
            p: 4,
            minHeight: 400,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            border: '2px dashed',
            borderColor: 'grey.300',
            backgroundColor: 'grey.50',
          }}
        >
          <Dashboard
            sx={{
              fontSize: 80,
              color: 'primary.main',
              mb: 2,
            }}
          />
          <Typography
            variant="h4"
            component="h2"
            gutterBottom
            sx={{ fontWeight: 'bold' }}
          >
            ¡Bienvenido al Dashboard!
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
          >
            Aquí puedes agregar el contenido de tu aplicación
          </Typography>
        </Paper>
      </Container>

      <UserProfile 
        open={profileOpen}
        onClose={handleProfileClose}
        user={user}
      />
    </Box>
  );
};