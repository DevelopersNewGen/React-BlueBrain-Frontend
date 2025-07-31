import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar, Toolbar, Typography, Box, Button, Avatar,
  Menu, MenuItem, ListItemIcon, IconButton
} from '@mui/material';
import { Dashboard, Person, ExitToApp } from '@mui/icons-material';
import UserProfile from './user/UserProfile';
import useLogin from '../shared/hooks/useLogin';
import logo from "../assets/Logo DBB (3).png";



const menuOptionsByRole = {
  ADMIN_ROLE: [
    { name: 'Usuarios', route: '/usuarios' },
    { name: 'Materias', route: '/subjects' },
    { name: 'Material', route: '/materials' },
    { name: 'Aplicaciones', route: '/applications' },
    { name: 'Reportes', route: '/reportes' },
    { name: 'Tutorial', route: '/tutorial' },
  ],
  STUDENT_ROLE: [
    { name: 'Material', route: '/materials' },
    { name: 'Materias', route: '/subjects' },
    { name: 'Tutorial', route: '/tutorial' },
  ],
  TEACHER_ROLE: [
    { name: 'Material', route: '/materials' },
    { name: 'Estudiantes', route: '/usuarios' },
    { name: 'Materias', route: '/subjects' },
    { name: 'Aplicaciones', route: '/applications' },
    { name: 'Reportes', route: '/reportes' },
    { name: 'Tutorial', route: '/tutorial' },
  ],
  TUTOR_ROLE: [
    { name: 'Material', route: '/materials' },
    { name: 'Materias', route: '/subjects' },
    { name: 'Tutorial', route: '/tutorial' },
  ]
};

const Navbar = ({ user: propUser, userWithRole: propUserWithRole, onLogout }) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const open = Boolean(anchorEl);
  const { user: hookUser, userWithRole: hookUserWithRole, logout: hookLogout } = useLogin();
  const user = propUser || hookUser;
  const userWithRole = propUserWithRole || hookUserWithRole;

  const handleMenuClick = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleProfile = () => { setProfileOpen(true); handleMenuClose(); };
  const handleProfileClose = () => setProfileOpen(false);
  const handleLogout = () => {
    handleMenuClose();
    if (onLogout) onLogout();
    else if (hookLogout) hookLogout();
  };

  return (
    <>
      <AppBar position="static" elevation={1} sx={{ backgroundColor: '#1E40AF' }}>
        <Toolbar>
          <Box
            sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', mr: 2 }}
            onClick={() => navigate('/')}
          >
            <img
              src={logo}
              alt="Logo Tutorías"
              style={{ height: 40, marginRight: 8 }}
            />
          </Box>
          <Typography variant="h6" component="div" sx={{
            flexGrow: 1,
            fontFamily: "'Nunito', sans-serif",
            fontWeight: 700,
            letterSpacing: 1.2,
            color: '#E0F2F7'
          }}>
            BlueBrain Dashboard
          </Typography>

          {userWithRole?.role && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {menuOptionsByRole[userWithRole.role]?.map((option) => (
                <Button
                  key={option.name}
                  onClick={() => navigate(option.route)}
                  sx={{
                    my: 2,
                    mx: 1,
                    color: 'white',
                    textTransform: 'none',
                    fontWeight: 'bold',
                    borderRadius: 2,
                    padding: '6px 16px',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      transform: 'scale(1.05) translateY(-2px)',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                    },
                    '&:active': {
                      transform: 'scale(0.98)',
                    },
                  }}
                >
                  {option.name.toUpperCase()}
                </Button>
              ))}
            </Box>
          )}

          <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
            <IconButton
              id="user-menu-button"
              onClick={handleMenuClick}
              sx={{
                p: 0,
                transition: 'transform 0.2s ease-in-out',
                '&:hover': { transform: 'scale(1.1)' }
              }}
              aria-controls={open ? 'user-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              aria-label="Abrir menú de usuario"
            >
              <Avatar
                src={user?.profilePicture || user?.img}
                sx={{ width: 40, height: 40, border: '2px solid white' }}
              />
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
                sx={{ '&:hover': { backgroundColor: '#E3F2FD' } }}
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
                sx={{ '&:hover': { backgroundColor: '#FFEBEE' } }}
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

export default Navbar;
