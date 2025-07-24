import React from 'react';
import { useSubjectGets } from '../../shared/hooks/useSubjectGets';
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  Avatar,
  CircularProgress,
  Alert
} from '@mui/material';
import Navbar from '../Navbar';

const SubjectList = () => {
  const { subjects, loading, error, refetch } = useSubjectGets();

  return (
    <>
      <Navbar />
      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Box m={4}>
          <Alert severity="error">
            {error}
            <Box mt={2}>
              <Typography
                component="span"
                color="primary"
                sx={{ cursor: 'pointer', textDecoration: 'underline' }}
                onClick={refetch}
              >
                Reintentar
              </Typography>
            </Box>
          </Alert>
        </Box>
      ) : subjects.length === 0 ? (
        <Box m={4}>
          <Alert severity="info">No hay materias registradas.</Alert>
        </Box>
      ) : (
        <Box p={4}>
          <Typography variant="h4" gutterBottom>
            Lista de Materias
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Imagen</TableCell>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Código</TableCell>
                  <TableCell>Grado</TableCell>
                  <TableCell>Docentes</TableCell>
                  <TableCell>Estado</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {subjects.map((subj) => (
                  <TableRow key={subj.sid}>
                    <TableCell>
                      <Avatar src={subj.img} alt={subj.name} />
                    </TableCell>
                    <TableCell>{subj.name}</TableCell>
                    <TableCell>{subj.code}</TableCell>
                    <TableCell>{subj.grade}</TableCell>
                    <TableCell>{subj.teachers?.length || 0}</TableCell>
                    <TableCell>
                      {subj.status ? 'Activo' : 'Inactivo'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
    </>
  );
};

export default SubjectList;