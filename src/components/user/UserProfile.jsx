import React, { useEffect } from 'react'; 
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Avatar, 
  Typography, 
  Box, 
  Divider 
} from '@mui/material';
import { AccountCircle } from '@mui/icons-material';

const UserProfile = ({ open, onClose, user, triggerRef }) => {
  const handleClose = () => {
    onClose();
  };

  useEffect(() => {
    if (!open && triggerRef?.current) {
      triggerRef.current.focus();
    }
  }, [open, triggerRef]);


  useEffect(() => {
    const root = document.getElementById('root');
    if (open) {
      root.setAttribute('inert', 'true');
    } else {
      root.removeAttribute('inert');
    }
  }, [open]);

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        Perfil de Usuario
      </DialogTitle>
      <DialogContent>
        <Box 
          display="flex" 
          flexDirection="column" 
          alignItems="center" 
          gap={3}
          py={2}
        >
          <Avatar 
            sx={{ width: 100, height: 100 }}
            src={user?.profilePicture || user?.img}
            alt={user?.name || 'Usuario'}
          >
            {!user?.profilePicture && !user?.img && <AccountCircle sx={{ fontSize: 60 }} />}
          </Avatar>
          <Box width="100%" maxWidth={400}>
            <Box mb={2}>
              <Typography variant="subtitle2" color="text.secondary">
                Nombre
              </Typography>
              <Typography variant="h6">
                {user?.name || 'No disponible'}
              </Typography>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box mb={2}>
              <Typography variant="subtitle2" color="text.secondary">
                Email
              </Typography>
              <Typography variant="h6">
                {user?.email || 'No disponible'}
              </Typography>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box mb={2}>
              <Typography variant="subtitle2" color="text.secondary">
                Rol
              </Typography>
              <Typography variant="h6">
                {user?.role || 'Usuario'}
              </Typography>
            </Box>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserProfile;
