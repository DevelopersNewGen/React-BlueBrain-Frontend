import React, { useState } from 'react';
import {
    Box,
    Paper,
    Typography,
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
    Button,
} from '@mui/material';
import {
    Edit as EditIcon,
    Visibility as ViewIcon,
} from '@mui/icons-material';
import { useReports } from '../../shared/hooks';
import useLogin from '../../shared/hooks/useLogin';
import Navbar from '../Navbar';

const reportTypes = [
    { value: 'ACADEMIC', label: 'Académico' },
    { value: 'BEHAVIORAL', label: 'Comportamental' },
    { value: 'TECHNICAL', label: 'Técnico' },
    { value: 'OTHER', label: 'Otro' },
];

const reportStatus = [
    { value: 'PENDING', label: 'Pendiente', color: 'warning' },
    { value: 'RESOLVED', label: 'Resuelto', color: 'success' },
    { value: 'REJECTED', label: 'Rechazado', color: 'error' },
];

const ReportsList = () => {
    const {
        reports,
        loading,
        error,
        handleUpdateReportStatus,
        setError,
    } = useReports();

    const { user, userWithRole } = useLogin();

    const [openDialog, setOpenDialog] = useState(false);
    const [selectedReport, setSelectedReport] = useState(null);
    const [dialogMode, setDialogMode] = useState('view');
    const [currentStatus, setCurrentStatus] = useState('PENDING');

    const safeReports = Array.isArray(reports) ? reports : [];

    const normalizeType = (type) => {
        const validTypes = reportTypes.map((t) => t.value);
        return validTypes.includes(type) ? type : 'OTHER';
    };

    const normalizeStatus = (status) => {
        const validStatuses = reportStatus.map((s) => s.value);
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
        const statusInfo = reportStatus.find((s) => s.value === normalizedStatus);
        return (
            <Chip
                label={statusInfo.label}
                color={statusInfo.color}
                size="small"
                sx={{ fontWeight: '600' }}
            />
        );
    };

    const getTypeLabel = (type) => {
        const normalizedType = normalizeType(type);
        const typeInfo = reportTypes.find((t) => t.value === normalizedType);
        return typeInfo ? typeInfo.label : 'Otro';
    };

    if (loading && safeReports.length === 0) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress color="primary" size={50} />
            </Box>
        );
    }

    return (
        <>
            <Navbar user={user} userWithRole={userWithRole} />
            <Box sx={{ p: 3, bgcolor: '#f4f8ff', minHeight: '100vh' }}>
                <Paper
                    sx={{
                        p: 3,
                        maxWidth: 1200,
                        mx: 'auto',
                        borderRadius: 3,
                        boxShadow: '0 6px 20px rgba(13, 71, 161, 0.15)',
                    }}
                    elevation={6}
                >
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                        <Typography
                            variant="h4"
                            component="h1"
                            sx={{ color: '#0D47A1', fontWeight: 'bold', letterSpacing: 1 }}
                        >
                            Reportes
                        </Typography>
                    </Box>

                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
                            {error}
                        </Alert>
                    )}

                    <TableContainer>
                        <Table
                            sx={{
                                minWidth: 650,
                                borderCollapse: 'separate',
                                borderSpacing: '0 10px',

                                // Encabezados azul oscuro, texto blanco
                                '& .MuiTableHead-root': {
                                    backgroundColor: '#0D47A1',
                                    borderRadius: '8px',
                                },
                                '& .MuiTableCell-head': {
                                    color: '#fff',
                                    fontWeight: '700',
                                    fontSize: '1rem',
                                    borderBottom: 'none',
                                },

                                // Filas fondo azul medio, texto blanco, bordes redondeados
                                '& .MuiTableRow-root': {
                                    backgroundColor: '#1976d2',
                                    color: '#fff',
                                    borderRadius: 2,
                                    transition: 'background-color 0.3s ease, color 0.3s ease, transform 0.2s ease',
                                    cursor: 'pointer',
                                    boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
                                    '&:last-child td': {
                                        borderBottom: 'none',
                                    },
                                },

                                // Hover filas: fondo blanco, texto azul oscuro, sombra y ligero zoom
                                '& .MuiTableRow-root:hover': {
                                    backgroundColor: '#fff',
                                    color: '#0D47A1',
                                    transform: 'scale(1.02)',
                                    boxShadow: '0 6px 20px rgba(13, 71, 161, 0.25)',
                                },

                                // Celdas sin borde para filas
                                '& .MuiTableCell-root': {
                                    borderBottom: 'none',
                                    color: 'inherit', // para que herede el color de fila o hover
                                    padding: '12px 16px',
                                },

                                // Centramos acciones
                                '& .MuiTableCell-alignCenter': {
                                    textAlign: 'center',
                                },

                                '& .MuiTableRow-root': {
                                    backgroundColor: '#1976d2', // azul medio
                                    color: '#fff',
                                    transition: 'background-color 0.5s ease, color 0.3s ease',
                                    cursor: 'pointer',
                                    '&:hover': {
                                        backgroundColor: '#fff',
                                        color: '#0D47A1',
                                        '& .MuiIconButton-root': {
                                            color: '#0D47A1', // los iconos cambian a azul oscuro cuando se hover en fila
                                            backgroundColor: 'rgba(13, 71, 161, 0.1)',
                                        },
                                    },
                                },

                                '& .MuiIconButton-root': {
                                    color: '#fff',
                                    transition: 'color 0.3s ease, background-color 0.3s ease',
                                    '&:hover': {
                                        color: '#0D47A1',
                                        backgroundColor: 'rgba(13, 71, 161, 0.1)',
                                    },
                                },

                            }}
                        >
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
                                        <TableRow
                                            key={
                                                report._id ||
                                                report.id ||
                                                report.reportTo?._id ||
                                                `report-${index}`
                                            }
                                        >
                                            <TableCell>
                                                <Typography variant="subtitle2">
                                                    {report.title || report.reason || 'Sin título'}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>{getTypeLabel(report.type)}</TableCell>
                                            <TableCell>{getStatusChip(report.status)}</TableCell>
                                            <TableCell>
                                                {report.createdAt
                                                    ? new Date(report.createdAt).toLocaleDateString()
                                                    : '-'}
                                            </TableCell>
                                            <TableCell align="center">
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleOpenDialog('view', report)}
                                                    title="Ver"
                                                    sx={{
                                                        color: '#fff',
                                                    }}
                                                >
                                                    <ViewIcon />
                                                </IconButton>

                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleOpenDialog('edit', report)}
                                                    title="Cambiar Estado"
                                                    sx={{
                                                        color: '#fff',
                                                    }}
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

                <Dialog
                    open={openDialog}
                    onClose={handleCloseDialog}
                    maxWidth="sm"
                    fullWidth
                    sx={{
                        '& .MuiDialog-container': {
                            backdropFilter: 'blur(6px)', // fondo borroso
                            backgroundColor: 'rgba(0, 0, 0, 0.2)', // oscurecimiento suave
                        },
                        '& .MuiPaper-root': {
                            backgroundColor: '#ffffff', // fondo blanco
                            borderRadius: 3,
                            p: 2,
                        }
                    }}
                >
                    <DialogTitle sx={{ fontWeight: 'bold', color: '#0D47A1' }}>
                        {dialogMode === 'edit' && 'Cambiar Estado del Reporte'}
                        {dialogMode === 'view' && 'Ver Reporte'}
                    </DialogTitle>

                    <DialogContent sx={{
                        overflow: 'hidden',
                        mt: 1,
                    }}>
                        <Box sx={{ mt: 2 }}>
                            {dialogMode === 'view' && (
                                <>
                                    <TextField
                                        fullWidth
                                        label="Motivo"
                                        value={selectedReport?.reason || selectedReport?.title || 'Sin motivo'}
                                        disabled
                                        margin="normal"
                                        InputProps={{ style: { color: '#fff' } }}
                                        InputLabelProps={{ style: { color: '#ccc' } }}
                                    />

                                    <TextField
                                        fullWidth
                                        label="Detalles"
                                        value={selectedReport?.details || selectedReport?.description || 'Sin detalles'}
                                        disabled
                                        margin="normal"
                                        multiline
                                        rows={3}
                                        InputProps={{ style: { color: '#fff' } }}
                                        InputLabelProps={{ style: { color: '#ccc' } }}
                                    />

                                    <TextField
                                        fullWidth
                                        label="Tipo"
                                        value={getTypeLabel(selectedReport?.type)}
                                        disabled
                                        margin="normal"
                                        InputProps={{ style: { color: '#fff' } }}
                                        InputLabelProps={{ style: { color: '#ccc' } }}
                                    />

                                    <TextField
                                        fullWidth
                                        label="Estudiante Reportado"
                                        value={selectedReport?.reportTo?.name || 'No especificado'}
                                        disabled
                                        margin="normal"
                                        InputProps={{ style: { color: '#fff' } }}
                                        InputLabelProps={{ style: { color: '#ccc' } }}
                                    />
                                </>
                            )}

                            {/* Campo de estado, editable solo en modo edición */}
                            <TextField
                                fullWidth
                                select
                                label="Estado"
                                value={currentStatus}
                                onChange={(e) => handleStatusChange(e.target.value)}
                                disabled={dialogMode === 'view'}
                                margin="normal"
                                helperText={dialogMode === 'edit' ? 'Selecciona el nuevo estado del reporte' : ''}
                                InputProps={{
                                    style: {
                                        color: dialogMode === 'edit' ? '#0D47A1' : '#0D47A1',
                                    },
                                }}
                                InputLabelProps={{
                                    style: {
                                        color: dialogMode === 'edit' ? '#0D47A1' : '#0D47A1',
                                    },
                                }}
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
                            <Button onClick={handleSubmit} variant="contained" disabled={loading}>
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
