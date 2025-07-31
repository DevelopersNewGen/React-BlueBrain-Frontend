import React, { useState, useEffect } from 'react'; 
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Typography, 
  Box, 
  Divider,
  CircularProgress 
} from '@mui/material';

import useUserProfile from '../../shared/hooks/useUserProfile.jsx';
import { getAllUsers } from '../../services/api.jsx';

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

  const [userRole, setUserRole] = useState('');
  const [roleLoading, setRoleLoading] = useState(false);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (open && user?.email) {
        setRoleLoading(true);
        try {
          const response = await getAllUsers();
          
          if (response && response.success && Array.isArray(response.data)) {
            const foundUser = response.data.find(u => u.email === user.email);
            
            if (foundUser && foundUser.role) {
              setUserRole(foundUser.role);
            } else {
              setUserRole('Usuario');
            }
          } else {
            setUserRole('Usuario');
          }
        } catch (error) {
          setUserRole('Usuario');
        } finally {
          setRoleLoading(false);
        }
      }
    };

    fetchUserRole();
  }, [open, user?.email]);

  const formatRole = (role) => {
    const roleMap = {
      'ADMIN_ROLE': 'Administrador',
      'TEACHER_ROLE': 'Profesor',
      'STUDENT_ROLE': 'Estudiante',
      'TUTOR_ROLE': 'Tutor'
    };
    return roleMap[role] || role || 'Usuario';
  };

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
                {roleLoading ? (
                  <Box display="flex" alignItems="center" gap={1}>
                    <CircularProgress size={16} />
                    Cargando...
                  </Box>
                ) : (
                  formatRole(userRole)
                )}
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