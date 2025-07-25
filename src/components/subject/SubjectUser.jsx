import React, { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Box, Grid, Card, CardMedia, CardContent, Typography, CircularProgress, Alert } from '@mui/material'
import useSubjectUsers from '../../shared/hooks/useUserSubject'

const SubjectUser = () => {
  const { subjectId } = useParams()
  const navigate = useNavigate()
  const stored = localStorage.getItem('user')
  const userData = stored ? JSON.parse(stored) : {}
  const isTeacher = userData.role === 'teacher'
  const hasAccess = isTeacher && Array.isArray(userData.subjects) && userData.subjects.includes(subjectId)

  useEffect(() => {
    if (!hasAccess) {
      navigate('/unauthorized')
    }
  }, [hasAccess, navigate])

  const { users, loading, error } = useSubjectUsers(subjectId)

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Box mt={4}>
        <Alert severity="error">{error}</Alert>
      </Box>
    )
  }

  return (
    <Box p={2}>
      <Grid container spacing={2}>
        {users.length === 0
          ? (
            <Grid item xs={12}>
              <Typography variant="body1">No hay usuarios en esta materia.</Typography>
            </Grid>
          )
          : users.map(user => (
            <Grid item key={user._id} xs={12} sm={6} md={4} lg={3}>
              <Card>
                <CardMedia
                  component="img"
                  height="140"
                  image={user.profilePicture || '/default-avatar.png'}
                  alt={user.name}
                />
                <CardContent>
                  <Typography gutterBottom variant="h6">{user.name}</Typography>
                  <Typography variant="body2" color="text.secondary">{user.email}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))
        }
      </Grid>
    </Box>
  )
}

export default SubjectUser