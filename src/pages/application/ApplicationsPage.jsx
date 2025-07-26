import React from 'react'
import { Container, Typography, Box, Paper } from '@mui/material'
import ApplicationsList from '../../components/application/AplicationsList'
import Navbar from '../../components/Navbar'

const ApplicationsPage = () => {
  return (
    <>
      <Navbar />
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Gestión de Aplicaciones
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Aquí puedes ver todas las aplicaciones para ser tutor que han sido enviadas por los estudiantes.
          </Typography>
        </Box>
        
        <Paper elevation={1} sx={{ p: 3 }}>
          <ApplicationsList />
        </Paper>
      </Container>
    </>
  )
}

export default ApplicationsPage
