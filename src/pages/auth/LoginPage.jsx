import React from 'react';
import { useNavigate } from 'react-router-dom';
import useLogin from '../../shared/hooks/useLogin';

// MUI Components
import {
    Box,
    Typography,
    Button,
    Paper,
    Alert,
    CircularProgress
} from '@mui/material';
import { Microsoft, InfoOutlined } from '@mui/icons-material';

// Animación
import { motion } from 'framer-motion';

// Assets
import logo from "../../assets/Logo DBB (1).png";
import backgroundImage from "../../assets/Maquetacion BV.png";

const LoginPage = () => {
    const { login, loading, error } = useLogin();
    const navigate = useNavigate();

    const handleLogin = () => login();

    return (
        <Box
            sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundColor: '#2563EB',
                overflow: 'hidden',
            }}
        >
            {/* Tarjeta de Login */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                style={{ zIndex: 1, width: '100%', maxWidth: 500 }}
            >
                <Paper
                    elevation={8}
                    sx={{
                        p: { xs: 4, sm: 6 },
                        width: '100%',
                        maxWidth: 450,
                        textAlign: 'center',
                        borderRadius: 4,
                        boxShadow: '0 15px 30px rgba(0,0,0,0.25)',
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        mx: 'auto',
                        overflow: 'hidden',
                    }}
                >
                    {/* Logo */}
                    <Box sx={{ mb: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <img
                            src={logo}
                            alt="BlueBrain Logo"
                            style={{
                                width: 100,
                                height: 100,
                                marginBottom: 16,
                                borderRadius: '50%',
                                boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
                            }}
                        />
                        <Typography
                            variant="h3"
                            sx={{
                                fontWeight: 'extrabold',
                                letterSpacing: '0.05em',
                                background: 'linear-gradient(45deg, #2563EB 30%, #1E40AF 90%)',
                                fontFamily: "'Nunito', sans-serif",
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
                            }}
                        >
                            BLUE BRAIN
                        </Typography>
                    </Box>

                    {/* Texto de bienvenida */}
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#333', lineHeight: 1.3 }}>
                        ¡Bienvenido de nuevo!
                    </Typography>
                    <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{ mb: 5, fontSize: { xs: '0.9rem', sm: '1rem' } }}
                    >
                        Conéctate con el conocimiento. Inicia sesión para acceder a tu espacio.
                    </Typography>

                    {/* Mensaje de error */}
                    {error && (
                        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                            {error}
                        </Alert>
                    )}

                    {/* Botón de login */}
                    <Button
                        onClick={handleLogin}
                        disabled={loading}
                        variant="contained"
                        size="large"
                        fullWidth
                        startIcon={
                            loading
                                ? <CircularProgress size={20} color="inherit" />
                                : <Microsoft />
                        }
                        sx={{
                            background: 'linear-gradient(45deg, #2563EB 30%, #3B82F6 90%)',
                            '&:hover': {
                                background: 'linear-gradient(45deg, #1E40AF 30%, #2563EB 90%)',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 8px 15px rgba(0,0,0,0.2)',
                            },
                            borderRadius: 2,
                            boxShadow: 3,
                            px: 5,
                            py: 1.8,
                            fontWeight: 'bold',
                            fontSize: '1.1rem',
                            transition: 'all 0.3s ease',
                            color: 'white',
                        }}
                    >
                        {loading ? 'Cargando...' : 'Iniciar sesión con Microsoft'}
                    </Button>
                </Paper>
            </motion.div>
        </Box>
    );
};

export default LoginPage;
