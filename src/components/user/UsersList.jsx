import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Typography, CircularProgress } from "@mui/material";
import Navbar from '../Navbar';
import useLogin from '../../shared/hooks/useLogin';
import useUsers from '../../shared/hooks/useUsers';

const UsersList = () => {
  const { users, loading, error } = useUsers();
  const { user, userWithRole, logout } = useLogin();

  const columns = [
    { field: "name", headerName: "Nombre", flex: 1, minWidth: 130 },
    { field: "email", headerName: "Email", flex: 1, minWidth: 180 },
    { field: "role", headerName: "Rol", flex: 1, minWidth: 110 },
  ];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
        <CircularProgress color="primary" size={50} />
      </Box>
    );
  }

  if (error && error !== "No se encontraron usuarios") {
    return (
      <Box sx={{ flexGrow: 1 }}>
        <Navbar user={user} userWithRole={userWithRole} onLogout={logout} />
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', mt: 6 }}>
          <Typography color="error" variant="h6" sx={{ fontWeight: 'bold' }}>
            Error al cargar usuarios
          </Typography>
          <Typography color="error" variant="body2" sx={{ mt: 1, maxWidth: 400, textAlign: 'center' }}>
            {error}
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, bgcolor: '#f4f8ff', minHeight: '100vh' }}>
      <Navbar user={user} userWithRole={userWithRole} onLogout={logout} />
      <Box sx={{ mt: 5, mx: 'auto', maxWidth: 1200, px: 2 }}>
        <Typography
          variant="h5"
          sx={{ mb: 3, fontWeight: 'bold', color: '#0D47A1', letterSpacing: 0.5 }}
        >
          Lista de Usuarios
        </Typography>

        {users.length === 0 ? (
          <Typography
            variant="body1"
            sx={{ mt: 4, textAlign: 'center', color: 'text.secondary', fontStyle: 'italic' }}
          >
            No hay usuarios registrados en el sistema.
          </Typography>
        ) : (
          <Box
            sx={{
              height: 600,
              width: '100%',
              bgcolor: 'white',
              borderRadius: 2,
              boxShadow: '0 4px 12px rgba(13, 71, 161, 0.15)',
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: '#e3f2fd',
                color: '#0D47A1',
                fontWeight: '600',
                letterSpacing: 0.5
              },
              '& .MuiDataGrid-footerContainer': {
                backgroundColor: '#e3f2fd',
                borderTop: 'none'
              }
            }}
          >
            <DataGrid
              rows={users}
              columns={columns}
              getRowId={(row) => row.uid || row._id}
              pageSize={10}
              rowsPerPageOptions={[10, 20, 40]}
              loading={loading}
              disableRowSelectionOnClick
              autoHeight={false}
              sx={{
                border: 'none',
                fontSize: '0.9rem',

                '& .MuiDataGrid-columnHeaders': {
                  backgroundColor: '#e3f2fd',  
                  color: '#0D47A1',
                  fontWeight: '600',
                  letterSpacing: 0.5,
                },

                '& .MuiDataGrid-row': {
                  backgroundColor: '#1976d2',  
                  color: '#fff',
                  transition: 'background-color 0.3s ease, color 0.3s ease, transform 0.2s ease',
                  cursor: 'pointer',
                },

                '& .MuiDataGrid-row:hover': {
                  backgroundColor: '#fff',
                  color: '#0D47A1',
                  transform: 'scale(1.02)',
                  boxShadow: '0 4px 12px rgba(13, 71, 161, 0.3)',
                },

                '& .MuiDataGrid-cell': {
                  borderBottom: 'none',
                },

                '& .MuiDataGrid-footerContainer': {
                  backgroundColor: '#e3f2fd',
                  borderTop: 'none',
                },
              }}
            />


          </Box>
        )}
      </Box>
    </Box>
  );
};

export default UsersList;