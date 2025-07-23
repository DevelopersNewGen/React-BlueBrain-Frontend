import { useState, useEffect } from 'react';
import { getAllReports, getReportById, createReport, updateReport, deleteReport } from '../../services/api';

export const useReports = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchReports = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getAllReports();
            if (response.error) {
                setError(response.e?.message || 'Error al obtener los reportes');
                setReports([]);
            } else {
                const reportsData = Array.isArray(response.data) ? response.data : 
                                   Array.isArray(response) ? response : [];
                setReports(reportsData);
            }
        } catch (err) {
            console.error('Error fetching reports:', err);
            setError('Error al obtener los reportes');
            setReports([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchReportById = async (id) => {
        setLoading(true);
        setError(null);
        try {
            const response = await getReportById(id);
            if (response.error) {
                setError(response.e?.message || 'Error al obtener el reporte');
                return null;
            } else {
                return response.data;
            }
        } catch (err) {
            setError('Error al obtener el reporte');
            return null;
        } finally {
            setLoading(false);
        }
    };

    const handleCreateReport = async (reportData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await createReport(reportData);
            if (response.error) {
                setError(response.e?.message || 'Error al crear el reporte');
                return false;
            } else {
                await fetchReports(); 
                return true;
            }
        } catch (err) {
            setError('Error al crear el reporte');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateReport = async (id, reportData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await updateReport(id, reportData);
            if (response.error) {
                setError(response.e?.message || 'Error al actualizar el reporte');
                return false;
            } else {
                await fetchReports(); 
                return true;
            }
        } catch (err) {
            setError('Error al actualizar el reporte');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteReport = async (id) => {
        setLoading(true);
        setError(null);
        try {
            const response = await deleteReport(id);
            if (response.error) {
                setError(response.e?.message || 'Error al eliminar el reporte');
                return false;
            } else {
                await fetchReports(); 
                return true;
            }
        } catch (err) {
            setError('Error al eliminar el reporte');
            return false;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

    return {
        reports,
        loading,
        error,
        fetchReports,
        fetchReportById,
        handleCreateReport,
        handleUpdateReport,
        handleDeleteReport,
        setError
    };
};
