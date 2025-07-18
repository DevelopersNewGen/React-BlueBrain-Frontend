import React, { useState } from 'react';
import useLogin from '../../shared/hooks/useLogin';
import UserProfile from '../../components/user/UserProfile';
import { Box, Container, Typography, Button, AppBar, Toolbar, Paper, Avatar, Menu, MenuItem, ListItemIcon, ListItemText, IconButton } from '@mui/material';
import { AccountCircle, ExitToApp, Dashboard, Person } from '@mui/icons-material';

export const DashboardPage = () => {
  const { user, login, logout, isAuthenticated } = useLogin();
  const [anchorEl, setAnchorEl] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
  };

  const handleProfile = () => {
    setProfileOpen(true);
    handleMenuClose();
  };

  const handleProfileClose = () => {
    setProfileOpen(false);
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
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              onClick={handleMenuClick}
              sx={{
                color: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              <Avatar 
                sx={{ width: 32, height: 32 }}
                src={user?.profilePicture || user?.img}
                alt={user?.name || 'Usuario'}
              >
                {!user?.profilePicture && !user?.img && <AccountCircle />}
              </Avatar>
            </IconButton>
            
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleMenuClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              sx={{ mt: 1 }}
            >
              <MenuItem onClick={handleProfile}>
                <ListItemIcon>
                  <Person fontSize="small" />
                </ListItemIcon>
                <ListItemText>Ver perfil</ListItemText>
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <ExitToApp fontSize="small" />
                </ListItemIcon>
                <ListItemText>Cerrar sesión</ListItemText>
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