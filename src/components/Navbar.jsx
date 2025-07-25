import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Box, Button, Avatar, Menu, MenuItem, ListItemIcon, IconButton } from '@mui/material';
import { Dashboard, Person, ExitToApp } from '@mui/icons-material';
import UserProfile from './user/UserProfile';
import useLogin from '../shared/hooks/useLogin';


const menuOptionsByRole = {
  ADMIN_ROLE: [
    { name: 'Usuarios', route: '/usuarios' },
    { name: 'Materias', route: '/subjects' },
    { name: 'Aplication' },
    { name: 'Reportes', route: '/reportes' },
    { name: 'Material' },
  ],
  STUDENT_ROLE: [
    { name: 'Material' },
    { name: 'Mi perfil' },
    { name: 'Materias', route: '/subjects' },
    { name: 'Aplication' },
    { name: 'Tutorial' }
  ],
  TEACHER_ROLE: [
    { name: 'Material' },
    { name: 'Mi perfil' },
    { name: 'Estudiantes' },
    { name: 'Materias' },
    { name: 'Reportes', route: '/reportes' },
    { name: 'Materias', route: '/subjects' },
    { name: 'Mi Materia', route: '/subjectsUser' },
    { name: 'Reportes' },
    { name: 'Solicitudes' },
    { name: 'Aplication' }
  ],
  TUTOR_ROLE: [
    { name: 'Material' },
    { name: 'Mi perfil' },
    { name: 'Tutoreados' },
    { name: 'Solicitudes' },
    { name: 'Materias', route: '/subjects' },
    { name: 'Aplication' }
  ]
};

const Navbar = ({ user: propUser, userWithRole: propUserWithRole, navigate, onLogout }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const open = Boolean(anchorEl);
  const { user: hookUser, userWithRole: hookUserWithRole, logout: hookLogout } = useLogin();
  const user = propUser || hookUser;
  const userWithRole = propUserWithRole || hookUserWithRole;

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  const handleProfile = () => { 
    setProfileOpen(true); 
    handleMenuClose(); 
  };
  
  const handleProfileClose = () => {
    setProfileOpen(false);
  };
  
  const handleLogout = () => { 
    handleMenuClose(); 
    if (onLogout) {
      onLogout(); 
    } else if (hookLogout) {
      hookLogout();
    }
  };

  return (
    <>
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
                  onClick={() => {
                    if (option.route && navigate) navigate(option.route);
                  }}
                >
                  {option.name.toUpperCase()}
                </Button>
              ))}
            </Box>
          )}
          <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto' }}>
            <IconButton 
              id="user-menu-button"
              onClick={handleMenuClick} 
              sx={{ p: 0 }}
              aria-controls={open ? 'user-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              aria-label="Abrir menú de usuario"
            >
              <Avatar src={user?.profilePicture || user?.img} />
            </IconButton>
            <Menu
              id="user-menu"
              sx={{ mt: '45px' }}
              anchorEl={anchorEl}
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              keepMounted={false}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              open={open}
              onClose={handleMenuClose}
              MenuListProps={{
                'aria-labelledby': 'user-menu-button',
                role: 'menu'
              }}
            >
              <MenuItem 
                onClick={handleProfile}
                role="menuitem"
                aria-label="Ver perfil de usuario"
              >
                <ListItemIcon>
                  <Person fontSize="small" />
                </ListItemIcon>
                Ver perfil
              </MenuItem>
              <MenuItem 
                onClick={handleLogout}
                role="menuitem"
                aria-label="Cerrar sesión"
              >
                <ListItemIcon>
                  <ExitToApp fontSize="small" />
                </ListItemIcon>
                Cerrar sesión
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      <UserProfile
        open={profileOpen}
        onClose={handleProfileClose}
        user={user}
      />
    </>
  );
};

export default Navbar;