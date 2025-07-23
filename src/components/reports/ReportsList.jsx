import React, { useState } from 'react';
import {
    Box,
    Paper,
    Typography,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    Alert,
    CircularProgress,
    Fab
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Visibility as ViewIcon
} from '@mui/icons-material';
import { useReports } from '../../shared/hooks';
import useLogin from '../../shared/hooks/useLogin';
import Navbar from '../Navbar';

const reportTypes = [
    { value: 'ACADEMIC', label: 'Académico' },
    { value: 'BEHAVIORAL', label: 'Comportamental' },
    { value: 'TECHNICAL', label: 'Técnico' },
    { value: 'OTHER', label: 'Otro' }
];

const reportStatus = [
    { value: 'PENDING', label: 'Pendiente', color: 'warning' },
    { value: 'IN_PROGRESS', label: 'En Progreso', color: 'info' },
    { value: 'COMPLETED', label: 'Completado', color: 'success' },
    { value: 'CANCELLED', label: 'Cancelado', color: 'error' }
];

const ReportsList = () => {
    const {
        reports,
        loading,
        error,
        handleCreateReport,
        handleUpdateReport,
        handleDeleteReport,
        setError
    } = useReports();

    const { user, userWithRole } = useLogin();

    const [openDialog, setOpenDialog] = useState(false);
    const [selectedReport, setSelectedReport] = useState(null);
    const [dialogMode, setDialogMode] = useState('create'); 
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        type: 'ACADEMIC',
        status: 'PENDING'
    });

    const safeReports = Array.isArray(reports) ? reports : [];

    const handleOpenDialog = (mode, report = null) => {
        setDialogMode(mode);
        setSelectedReport(report);
        if (report) {
            setFormData({
                title: report.title || '',
                description: report.description || '',
                type: report.type || 'ACADEMIC',
                status: report.status || 'PENDING'
            });
        } else {
            setFormData({
                title: '',
                description: '',
                type: 'ACADEMIC',
                status: 'PENDING'
            });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedReport(null);
        setError(null);
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = async () => {
        if (!formData.title.trim()) {
            setError('El título es requerido');
            return;
        }

        let success = false;
        if (dialogMode === 'create') {
            success = await handleCreateReport(formData);
        } else if (dialogMode === 'edit') {
            success = await handleUpdateReport(selectedReport.id, formData);
        }

        if (success) {
            handleCloseDialog();
        }
    };

    const handleDelete = async (reportId) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este reporte?')) {
            await handleDeleteReport(reportId);
        }
    };

    const getStatusChip = (status) => {
        const statusInfo = reportStatus.find(s => s.value === status) || reportStatus[0];
        return (
            <Chip
                label={statusInfo.label}
                color={statusInfo.color}
                size="small"
            />
        );
    };

    const getTypeLabel = (type) => {
        const typeInfo = reportTypes.find(t => t.value === type);
        return typeInfo ? typeInfo.label : type;
    };

    // Debug info
    console.log('ReportsList Debug:', { 
        reports, 
        safeReports,
        isArray: Array.isArray(reports), 
        safeIsArray: Array.isArray(safeReports),
        length: safeReports?.length, 
        loading, 
        error 
    });

    if (loading && safeReports.length === 0) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <>
            <Navbar user={user} userWithRole={userWithRole} />
            <Box sx={{ p: 3 }}>
                <Paper sx={{ p: 3 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                        <Typography variant="h4" component="h1">
                            Reportes
                        </Typography>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => handleOpenDialog('create')}
                    >
                        Nuevo Reporte
                    </Button>
                </Box>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
                        {error}
                    </Alert>
                )}

                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Título</TableCell>
                                <TableCell>Tipo</TableCell>
                                <TableCell>Estado</TableCell>
                                <TableCell>Fecha de Creación</TableCell>
                                <TableCell align="center">Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {safeReports.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} align="center">
                                        <Typography variant="body2" color="text.secondary">
                                            No hay reportes disponibles
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                safeReports.map((report) => (
                                    <TableRow key={report.id}>
                                        <TableCell>
                                            <Typography variant="subtitle2">
                                                {report.title}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>{getTypeLabel(report.type)}</TableCell>
                                        <TableCell>{getStatusChip(report.status)}</TableCell>
                                        <TableCell>
                                            {report.createdAt ? new Date(report.createdAt).toLocaleDateString() : '-'}
                                        </TableCell>
                                        <TableCell align="center">
                                            <IconButton
                                                size="small"
                                                onClick={() => handleOpenDialog('view', report)}
                                                title="Ver"
                                            >
                                                <ViewIcon />
                                            </IconButton>
                                            <IconButton
                                                size="small"
                                                onClick={() => handleOpenDialog('edit', report)}
                                                title="Editar"
                                            >
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton
                                                size="small"
                                                onClick={() => handleDelete(report.id)}
                                                color="error"
                                                title="Eliminar"
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
                <DialogTitle>
                    {dialogMode === 'create' && 'Crear Nuevo Reporte'}
                    {dialogMode === 'edit' && 'Editar Reporte'}
                    {dialogMode === 'view' && 'Ver Reporte'}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2 }}>
                        <TextField
                            fullWidth
                            label="Título"
                            value={formData.title}
                            onChange={(e) => handleInputChange('title', e.target.value)}
                            disabled={dialogMode === 'view'}
                            margin="normal"
                            required
                        />
                        
                        <TextField
                            fullWidth
                            label="Descripción"
                            value={formData.description}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                            disabled={dialogMode === 'view'}
                            margin="normal"
                            multiline
                            rows={4}
                        />
                        
                        <TextField
                            fullWidth
                            select
                            label="Tipo"
                            value={formData.type}
                            onChange={(e) => handleInputChange('type', e.target.value)}
                            disabled={dialogMode === 'view'}
                            margin="normal"
                        >
                            {reportTypes.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>
                        
                        <TextField
                            fullWidth
                            select
                            label="Estado"
                            value={formData.status}
                            onChange={(e) => handleInputChange('status', e.target.value)}
                            disabled={dialogMode === 'view'}
                            margin="normal"
                        >
                            {reportStatus.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>
                        {dialogMode === 'view' ? 'Cerrar' : 'Cancelar'}
                    </Button>
                    {dialogMode !== 'view' && (
                        <Button
                            onClick={handleSubmit}
                            variant="contained"
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={20} /> : 
                             dialogMode === 'create' ? 'Crear' : 'Actualizar'}
                        </Button>
                    )}
                </DialogActions>
            </Dialog>

            <Fab
                color="primary"
                aria-label="add"
                sx={{
                    position: 'fixed',
                    bottom: 16,
                    right: 16,
                    display: { xs: 'flex', sm: 'none' }
                }}
                onClick={() => handleOpenDialog('create')}
            >
                <AddIcon />
            </Fab>
            </Box>
        </>
    );
};

export default ReportsList;
