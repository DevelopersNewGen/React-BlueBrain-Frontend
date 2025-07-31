import useLogin from '../../shared/hooks/useLogin';
import { 
    Box, 
    Container, 
    Typography, 
    Button, 
    Paper,
    Alert,
    CircularProgress
} from '@mui/material';
import { Microsoft } from '@mui/icons-material';

const LoginPage = () => {
    const { login, loading, error } = useLogin();

    const handleLogin = () => {
        login();
    };

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
                        width: '100%',
                        maxWidth: 400,
                    }}
                >
                    <Box sx={{ textAlign: 'center', mb: 4 }}>
                        <Typography
                            variant="h4"
                            component="h1"
                            gutterBottom
                            sx={{ fontWeight: 'bold' }}
                        >
                            Iniciar sesión
                        </Typography>
                        <Typography
                            variant="body1"
                            color="text.secondary"
                        >
                            Accede con tu cuenta de Microsoft
                        </Typography>
                    </Box>
                    
                    {error && (
                        <Alert severity="error" sx={{ mb: 3 }}>
                            {error}
                        </Alert>
                    )}
                    
                    <Button
                        onClick={handleLogin}
                        disabled={loading}
                        variant="contained"
                        size="large"
                        fullWidth
                        startIcon={loading ? <CircularProgress size={20} /> : <Microsoft />}
                        sx={{ py: 1.5 }}
                    >
                        {loading ? 'Cargando...' : 'Iniciar sesión con Microsoft'}
                    </Button>
                </Paper>
            </Box>
        </Container>
    );
};

export default LoginPage;
