import React from 'react';
import useLogin from '../../shared/hooks/useLogin';
import { Box, Container, Typography, Button, AppBar, Toolbar, Paper, Avatar, Chip } from '@mui/material';
import { AccountCircle, ExitToApp, Dashboard } from '@mui/icons-material';

export const DashboardPage = () => {
  const { user, login, logout, isAuthenticated } = useLogin();

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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Chip
              avatar={<Avatar><AccountCircle /></Avatar>}
              label={`Hola, ${user?.name || user?.email}`}
              variant="outlined"
              sx={{ color: 'white', borderColor: 'white' }}
            />
            <Button
              color="inherit"
              onClick={logout}
              startIcon={<ExitToApp />}
            >
              Cerrar sesión
            </Button>
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
    </Box>
  );
};
