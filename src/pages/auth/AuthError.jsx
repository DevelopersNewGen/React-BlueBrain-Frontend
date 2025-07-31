import { Link } from 'react-router-dom';
import { 
    Box, 
    Container, 
    Typography, 
    Button, 
    Paper,
    Alert
} from '@mui/material';
import { Warning } from '@mui/icons-material';

const AuthError = () => {
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
                        textAlign: 'center',
                        width: '100%',
                        maxWidth: 400,
                    }}
                >
                    <Warning
                        sx={{
                            fontSize: 64,
                            color: 'error.main',
                            mb: 2,
                        }}
                    />
                    
                    <Typography
                        variant="h4"
                        component="h1"
                        gutterBottom
                        sx={{ fontWeight: 'bold', mb: 2 }}
                    >
                        Error de autenticación
                    </Typography>
                    
                    <Alert severity="error" sx={{ mb: 3 }}>
                        Hubo un problema al procesar tu autenticación. Por favor, intenta nuevamente.
                    </Alert>
                    
                    <Button
                        component={Link}
                        to="/login"
                        variant="contained"
                        size="large"
                        sx={{ mt: 2 }}
                    >
                        Volver a intentar
                    </Button>
                </Paper>
            </Box>
        </Container>
    );
};

export default AuthError;
