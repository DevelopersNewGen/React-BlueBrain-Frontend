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
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  AccountCircle,
  PhotoCamera,
  CloudUpload,
  ErrorOutline,
  CheckCircleOutline,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

import useUserProfile from '../../shared/hooks/useUserProfile.jsx';
import { getAllUsers } from '../../services/api.jsx';

const UserProfile = ({ open, onClose, user, triggerRef }) => {
  const {
    loading,
    preview,
    error,
    success,
    profilePic,
    fileInputRef,
    handleFileChange,
    handleUpload,
    handleClose: useProfileHandleClose,
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
            const foundUser = response.data.find((u) => u.email === user.email);

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
      ADMIN_ROLE: 'Administrador',
      TEACHER_ROLE: 'Profesor',
      STUDENT_ROLE: 'Estudiante',
      TUTOR_ROLE: 'Tutor',
    };
    return roleMap[role] || role || 'Usuario';
  };

  const handleCloseDialog = () => {
    if (!loading) {
      useProfileHandleClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleCloseDialog}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          boxShadow: '0 15px 30px rgba(0,0,0,0.25)',
          overflow: 'hidden',
          background: 'linear-gradient(145deg, #e0f7fa 0%, #ffffff 100%)',
          border: '1px solid rgba(0,0,0,0.05)',
        },
      }}
      BackdropProps={{
        sx: {
          backdropFilter: 'blur(5px)',
          backgroundColor: 'rgba(0,0,0,0.5)',
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          pb: 2,
          pt: 3,
          px: 4,
          borderBottom: '1px solid #e0e0e0',
          background: 'linear-gradient(90deg, #2563EB 0%, #3B82F6 100%)',
          color: 'white',
          fontWeight: 'bold',
        }}
      >
        <AccountCircle sx={{ fontSize: 32 }} />
        <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
          Perfil de Usuario
        </Typography>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 4 }}>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          gap={3}
          py={2}
        >
          <img
            src={
              preview ||
              profilePic ||
              'https://res.cloudinary.com/dibe6yrzf/image/upload/v1747668225/perfil-de-usuario_cxmmxq.png'
            }
            alt={user?.name || 'Usuario'}
            style={{
              width: 120,
              height: 120,
              objectFit: 'cover',
              borderRadius: '50%',
              border: '4px solid #2563EB',
              boxShadow: '0 6px 12px rgba(0,0,0,0.2)',
              transition: 'all 0.3s ease-in-out',
            }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                'https://res.cloudinary.com/dibe6yrzf/image/upload/v1747668225/perfil-de-usuario_cxmmxq.png';
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
            <Button
              variant="outlined"
              size="medium"
              onClick={() => fileInputRef.current.click()}
              disabled={loading}
              startIcon={<PhotoCamera />}
              sx={{
                textTransform: 'none',
                borderRadius: 2,
                px: 3,
                py: 1,
                fontWeight: 'bold',
                borderColor: '#2563EB',
                color: '#2563EB',
                '&:hover': {
                  backgroundColor: '#EBF5FF',
                  borderColor: '#1E40AF',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Seleccionar foto
            </Button>
            {preview && (
              <Button
                variant="contained"
                size="medium"
                color="primary"
                onClick={handleUpload}
                disabled={loading}
                startIcon={
                  loading ? <CircularProgress size={20} color="inherit" /> : <CloudUpload />
                }
                sx={{
                  background: 'linear-gradient(45deg, #10B981 30%, #059669 90%)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #059669 30%, #047857 90%)',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                  },
                  borderRadius: 2,
                  px: 3,
                  py: 1,
                  fontWeight: 'bold',
                  color: 'white',
                  transition: 'all 0.3s ease',
                }}
              >
                {loading ? 'Actualizando...' : 'Actualizar foto'}
              </Button>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                style={{ width: '100%' }}
              >
                <Alert
                  severity="error"
                  icon={<ErrorOutline fontSize="inherit" />}
                  sx={{ borderRadius: 2, boxShadow: 3, mt: 2 }}
                  variant="filled"
                >
                  {error}
                </Alert>
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                style={{ width: '100%' }}
              >
                <Alert
                  severity="success"
                  icon={<CheckCircleOutline fontSize="inherit" />}
                  sx={{ borderRadius: 2, boxShadow: 3, mt: 2 }}
                  variant="filled"
                >
                  Foto de perfil actualizada exitosamente.
                </Alert>
              </motion.div>
            )}
          </Box>

          <Box width="100%" maxWidth={400} sx={{ mt: 3 }}>
            <Box mb={2}>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                sx={{ fontWeight: 'bold', color: '#607D8B' }}
              >
                Nombre
              </Typography>
              <Typography variant="h6" sx={{ color: '#333', fontWeight: 'medium' }}>
                {user?.name || 'No disponible'}
              </Typography>
            </Box>
            <Divider sx={{ my: 2, borderColor: '#e0e0e0' }} />
            <Box mb={2}>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                sx={{ fontWeight: 'bold', color: '#607D8B' }}
              >
                Email
              </Typography>
              <Typography variant="h6" sx={{ color: '#333', fontWeight: 'medium' }}>
                {user?.email || 'No disponible'}
              </Typography>
            </Box>
            <Divider sx={{ my: 2, borderColor: '#e0e0e0' }} />
            <Box mb={2}>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                sx={{ fontWeight: 'bold', color: '#607D8B' }}
              >
                Rol
              </Typography>
              <Typography variant="h6" sx={{ color: '#333', fontWeight: 'medium' }}>
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

      <DialogActions
        sx={{
          p: 3,
          borderTop: '1px solid #e0e0e0',
          justifyContent: 'flex-end',
        }}
      >
        <Button
          onClick={handleCloseDialog}
          variant="outlined"
          sx={{
            borderRadius: 2,
            px: 3,
            py: 1,
            fontWeight: 'bold',
            borderColor: '#607D8B',
            color: '#607D8B',
            '&:hover': {
              backgroundColor: '#ECEFF1',
              borderColor: '#455A64',
            },
            transition: 'all 0.3s ease',
          }}
        >
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserProfile;
