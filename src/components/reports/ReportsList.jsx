import React, { useState } from 'react';
import {Box,Paper,Typography,Table,TableBody,TableCell,TableContainer,TableHead,TableRow,IconButton,Chip,Dialog,DialogTitle,DialogContent,DialogActions,TextField,MenuItem,Alert,CircularProgress,Button} from '@mui/material';
import {
    Edit as EditIcon,
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
    { value: 'RESOLVED', label: 'Resuelto', color: 'success' },
    { value: 'REJECTED', label: 'Rechazado', color: 'error' }
];

const ReportsList = () => {
    const {
        reports,
        loading,
        error,
        handleUpdateReportStatus,
        setError
    } = useReports();

    const { user, userWithRole } = useLogin();

    const [openDialog, setOpenDialog] = useState(false);
    const [selectedReport, setSelectedReport] = useState(null);
    const [dialogMode, setDialogMode] = useState('view'); 
    const [currentStatus, setCurrentStatus] = useState('PENDING');

    const safeReports = Array.isArray(reports) ? reports : [];

    const normalizeType = (type) => {
        const validTypes = reportTypes.map(t => t.value);
        return validTypes.includes(type) ? type : 'OTHER';
    };

    const normalizeStatus = (status) => {
        const validStatuses = reportStatus.map(s => s.value);
        return validStatuses.includes(status) ? status : 'PENDING';
    };

    const handleOpenDialog = (mode, report = null) => {
        setDialogMode(mode);
        setSelectedReport(report);
        if (report) {
            setCurrentStatus(normalizeStatus(report.status));
        } else {
            setCurrentStatus('PENDING');
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedReport(null);
        setError(null);
        setCurrentStatus('PENDING');
    };

    const handleStatusChange = (value) => {
        setCurrentStatus(value);
    };

    const handleSubmit = async () => {
        if (dialogMode === 'edit' && selectedReport) {
            const reportId = selectedReport?.rid;

            if (!reportId) {
                setError('No se pudo identificar el ID del reporte');
                return;
            }

            const success = await handleUpdateReportStatus(reportId, currentStatus);
            if (success) {
                handleCloseDialog();
            }
        }
    };

    const getStatusChip = (status) => {
        const normalizedStatus = normalizeStatus(status);
        const statusInfo = reportStatus.find(s => s.value === normalizedStatus);
        return (
            <Chip
                label={statusInfo.label}
                color={statusInfo.color}
                size="small"
            />
        );
    };

    const getTypeLabel = (type) => {
        const normalizedType = normalizeType(type);
        const typeInfo = reportTypes.find(t => t.value === normalizedType);
        return typeInfo ? typeInfo.label : 'Otro';
    };

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
                                    safeReports.map((report, index) => (
                                        <TableRow key={report._id || report.id || report.reportTo?._id || `report-${index}`}>
                                            <TableCell>
                                                <Typography variant="subtitle2">
                                                    {report.title || report.reason || 'Sin título'}
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
                                                    title="Cambiar Estado"
                                                >
                                                    <EditIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>

                <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                    <DialogTitle>
                        {dialogMode === 'edit' && 'Cambiar Estado del Reporte'}
                        {dialogMode === 'view' && 'Ver Reporte'}
                    </DialogTitle>
                    <DialogContent>
                        <Box sx={{ mt: 2 }}>
                            {dialogMode === 'view' && (
                                <>
                                    <TextField
                                        fullWidth
                                        label="Motivo"
                                        value={selectedReport?.reason || selectedReport?.title || 'Sin motivo'}
                                        disabled
                                        margin="normal"
                                    />
                                    
                                    <TextField
                                        fullWidth
                                        label="Detalles"
                                        value={selectedReport?.details || selectedReport?.description || 'Sin detalles'}
                                        disabled
                                        margin="normal"
                                        multiline
                                        rows={3}
                                    />
                                    
                                    <TextField
                                        fullWidth
                                        label="Tipo"
                                        value={getTypeLabel(selectedReport?.type)}
                                        disabled
                                        margin="normal"
                                    />
                                    
                                    <TextField
                                        fullWidth
                                        label="Estudiante Reportado"
                                        value={selectedReport?.reportTo?.name || 'No especificado'}
                                        disabled
                                        margin="normal"
                                    />
                                </>
                            )}
                            
                            <TextField
                                fullWidth
                                select
                                label="Estado"
                                value={currentStatus}
                                onChange={(e) => handleStatusChange(e.target.value)}
                                disabled={dialogMode === 'view'}
                                margin="normal"
                                helperText={dialogMode === 'edit' ? 'Selecciona el nuevo estado del reporte' : ''}
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
                        {dialogMode === 'edit' && (
                            <Button
                                onClick={handleSubmit}
                                variant="contained"
                                disabled={loading}
                            >
                                {loading ? <CircularProgress size={20} /> : 'Actualizar Estado'}
                            </Button>
                        )}
                    </DialogActions>
                </Dialog>
            </Box>
        </>
    );
};

export default ReportsList;
