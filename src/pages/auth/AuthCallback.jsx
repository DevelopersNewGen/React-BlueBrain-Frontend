import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Box, CircularProgress, Typography, Container } from '@mui/material';

const AuthCallback = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const token = searchParams.get('token');
        const userParam = searchParams.get('user');

        if (token && userParam) {
            try {
                const user = JSON.parse(decodeURIComponent(userParam));
                
                const userDetails = {
                    ...user,
                    token: token
                };
                
                localStorage.setItem('user', JSON.stringify(userDetails));
                
                navigate('/dashboard', { replace: true });
            } catch (error) {
                console.error('Error procesando datos de autenticación:', error);
                navigate('/auth/error', { replace: true });
            }
        } else {
            navigate('/auth/error', { replace: true });
        }
    }, [navigate, searchParams]);

    return (
        <Container maxWidth="sm">
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '100vh',
                    textAlign: 'center',
                }}
            >
                <CircularProgress 
                    size={80} 
                    thickness={4}
                    sx={{ 
                        color: 'primary.main',
                        mb: 3 
                    }}
                />
                <Typography 
                    variant="h6" 
                    color="text.secondary"
                    sx={{ mt: 2 }}
                >
                    Procesando autenticación...
                </Typography>
            </Box>
        </Container>
    );
};

export default AuthCallback;
