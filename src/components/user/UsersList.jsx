import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Typography, CircularProgress, IconButton, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Navbar from '../Navbar';
import { useNavigate } from 'react-router-dom';
import useLogin from '../../shared/hooks/useLogin';
import useUsers from '../../shared/hooks/useUsers';

const UsersList = () => {
  const navigate = useNavigate();
  const { users, loading, error } = useUsers();
  const { user, userWithRole, logout } = useLogin();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [menuRow, setMenuRow] = React.useState(null);
  const [userMenuAnchor, setUserMenuAnchor] = React.useState(null);

  const handleMenuOpen = (event, row) => {
    setAnchorEl(event.currentTarget);
    setMenuRow(row);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuRow(null);
  };
  const handleUserMenuClick = (event) => setUserMenuAnchor(event.currentTarget);
  const handleUserMenuClose = () => setUserMenuAnchor(null);
  const handleLogout = () => { logout(); handleUserMenuClose(); };

  const columns = [
    { field: "name", headerName: "Nombre", flex: 1, minWidth: 130 },
    { field: "email", headerName: "Email", flex: 1, minWidth: 180 },
    { field: "role", headerName: "Rol", flex: 1, minWidth: 110 },
    {
      field: "actions",
      headerName: "Acciones",
      minWidth: 80,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <IconButton size="small" onClick={(e) => handleMenuOpen(e, params.row)}>
          <MoreVertIcon fontSize="small" />
        </IconButton>
      ),
    },
  ];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Typography color="error">Error al cargar usuarios</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Navbar user={user} userWithRole={userWithRole} navigate={navigate} />
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
          Lista de Usuarios
        </Typography>
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
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleMenuClose}>ACCION</MenuItem>
            <MenuItem onClick={handleMenuClose}>ACCION</MenuItem>
            <MenuItem onClick={handleMenuClose} sx={{ color: "error.main" }}>
             ACCION
            </MenuItem>
          </Menu>
        </div>
      </Box>
    </Box>
  );
};

export default UsersList;
