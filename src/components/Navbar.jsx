import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Box, Button, Avatar, Menu, MenuItem, ListItemIcon, IconButton } from '@mui/material';
import { Dashboard, Person, ExitToApp } from '@mui/icons-material';
import UserProfile from './user/UserProfile';


const menuOptionsByRole = {
  ADMIN_ROLE: [
    { name: 'Usuarios', route: '/usuarios' },
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

const Navbar = ({ user, userWithRole, navigate }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleProfile = () => { setProfileOpen(true); handleMenuClose(); };
  const handleProfileClose = () => setProfileOpen(false);
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("bluebrain_user");
    if (user?.logout) user.logout();
    handleMenuClose();
    if (navigate) navigate("/login");
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
            <IconButton onClick={handleMenuClick} sx={{ p: 0 }}>
              <Avatar src={user?.profilePicture || user?.img} />
            </IconButton>
            <Menu
              sx={{ mt: '45px' }}
              anchorEl={anchorEl}
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              keepMounted
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              open={open}
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
      <UserProfile
        open={profileOpen}
        onClose={handleProfileClose}
        user={user}
      />
    </>
  );
};

export default Navbar;
