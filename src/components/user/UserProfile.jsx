import React from 'react'; 
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Typography, 
  Box, 
  Divider 
} from '@mui/material';

import useUserProfile from '../../shared/hooks/useUserProfile.jsx';

const UserProfile = ({ open, onClose, user, triggerRef }) => {
  const {
    loading,
    preview,
    error,
    profilePic,
    fileInputRef,
    handleFileChange,
    handleUpload,
    handleClose,
  } = useUserProfile({ open, onClose, user, triggerRef });

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
          <img
            src={preview || profilePic}
            alt={user?.name || 'Usuario'}
            style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: '50%' }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://res.cloudinary.com/dibe6yrzf/image/upload/v1747668225/perfil-de-usuario_cxmmxq.png';
            }}
          />
          <Box mt={2} display="flex" flexDirection="column" alignItems="center" gap={1}>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            <Button variant="outlined" size="small" onClick={() => fileInputRef.current.click()} disabled={loading}>
              Seleccionar foto
            </Button>
            {preview && (
              <Button variant="contained" size="small" color="primary" onClick={handleUpload} disabled={loading}>
                {loading ? 'Actualizando...' : 'Actualizar foto'}
              </Button>
            )}
            {error && (
              <Typography color="error" variant="body2">{error}</Typography>
            )}
          </Box>
          
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