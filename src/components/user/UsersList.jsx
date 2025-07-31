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
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error && error !== "No se encontraron usuarios") {
    return (
      <Box sx={{ flexGrow: 1 }}>
        <Navbar user={user} userWithRole={userWithRole} onLogout={logout} />
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', mt: 4 }}>
          <Typography color="error" variant="h6">Error al cargar usuarios</Typography>
          <Typography color="error" variant="body2" sx={{ mt: 1 }}>
            {error}
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Navbar user={user} userWithRole={userWithRole} onLogout={logout} />
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
          Lista de Usuarios
        </Typography>
        {users.length === 0 ? (
          <Typography variant="body1" sx={{ mt: 2 }}>
            No hay usuarios registrados en el sistema.
          </Typography>
        ) : (
          <div style={{ height: 600, width: "100%", overflowX: "auto" }}>
            <DataGrid
              rows={users}
              columns={columns}
              getRowId={(row) => row.uid || row._id}
              pageSize={10}
              rowsPerPageOptions={[10, 20, 40]}
              loading={loading}
              disableRowSelectionOnClick
              autoHeight={false}
            />
          </div>
        )}
      </Box>
    </Box>
  );
};

export default UsersList;