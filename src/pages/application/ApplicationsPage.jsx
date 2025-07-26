import React, { useState } from 'react'
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Tabs, 
  Tab,
  Divider
} from '@mui/material'
import {
  List,
  Person,
  School
} from '@mui/icons-material'
import ApplicationsList from '../../components/application/AplicationsList'
import ApplicationsByUser from '../../components/application/ApplicationsByUser'
import ApplicationsBySubject from '../../components/application/ApplicationsBySubject'
import Navbar from '../../components/Navbar'

const ApplicationsPage = () => {
  const [activeTab, setActiveTab] = useState(0)

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue)
  }

  const tabContent = [
    {
      label: 'Todas las Aplicaciones',
      icon: <List />,
      component: <ApplicationsList />
    },
    {
      label: 'Por Usuario',
      icon: <Person />,
      component: <ApplicationsByUser />
    },
    {
      label: 'Por Materia',
      icon: <School />,
      component: <ApplicationsBySubject />
    }
  ]

  return (
    <>
      <Navbar />
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Gestión de Aplicaciones
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Administra y revisa las aplicaciones para ser tutor enviadas por los estudiantes.
          </Typography>
        </Box>
        
        <Paper elevation={1} sx={{ overflow: 'hidden' }}>
          {/* Tabs de navegación */}
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            {tabContent.map((tab, index) => (
              <Tab
                key={index}
                icon={tab.icon}
                iconPosition="start"
                label={tab.label}
                sx={{ minHeight: 72 }}
              />
            ))}
          </Tabs>
          
          <Divider />
          
          {/* Contenido de la tab activa */}
          <Box sx={{ p: 3 }}>
            {tabContent[activeTab].component}
          </Box>
        </Paper>
      </Container>
    </>
  )
}

export default ApplicationsPage
