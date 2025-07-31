import { useState, useEffect, useCallback, useRef } from 'react';
import { getAllReports, updateReportStatus } from '../../services/api';

export const useReports = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const hasInitialized = useRef(false);

    const fetchReports = useCallback(async () => {
        if (loading && reports.length > 0) return; 
        
        setLoading(true);
        setError(null);
        try {
            const response = await getAllReports();
            if (response.error) {
                const errorMessage = response.e?.response?.data?.message || 
                                   response.e?.message || 
                                   'Error al obtener los reportes';
                
                if (response.e?.response?.status === 401 || errorMessage.includes('token')) {
                    setError('Sesión expirada. Por favor, inicia sesión nuevamente.');
                } else {
                    setError(errorMessage);
                }
                setReports([]);
            } else {
                let reportsData = response.data?.reports || 
                                 response.data?.data || 
                                 (Array.isArray(response.data) ? response.data : []);
                
                reportsData = reportsData.map((report, index) => {
                    return report;
                });
                
                setReports(reportsData);
                setError(null);
            }
        } catch (err) {
            if (err.response?.status === 401 || err.response?.status === 403) {
                setError('Sesión expirada. Por favor, inicia sesión nuevamente.');
            } else if (err.response?.status === 500) {
                const serverMessage = err.response?.data?.message || '';
                if (serverMessage.includes('token') || serverMessage.includes('validar')) {
                    setError('Token de autenticación inválido. Por favor, inicia sesión nuevamente.');
                } else {
                    setError('Error del servidor. Por favor, inténtalo más tarde.');
                }
            } else {
                const errorMessage = err.response?.data?.message || 
                                    err.message || 
                                    'Error al conectar con el servidor';
                setError(errorMessage);
            }
            setReports([]);
        } finally {
            setLoading(false);
        }
    }, [loading, reports.length]);

    const handleUpdateReportStatus = useCallback(async (reportId, status) => {
        if (!reportId) {
            setError('ID del reporte no válido');
            return false;
        }
        
        setLoading(true);
        setError(null);
        try {
            const response = await updateReportStatus(reportId, status);
            if (response.error) {
                const errorMessage = response.e?.response?.data?.message || 
                                   response.e?.message || 
                                   'Error al actualizar el estado del reporte';
                setError(errorMessage);
                return false;
            } else {
                await fetchReports(); 
                return true;
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || 
                                err.message || 
                                'Error al conectar con el servidor';
            setError(errorMessage);
            return false;
        } finally {
            setLoading(false);
        }
    }, [fetchReports]);

    useEffect(() => {
        if (!hasInitialized.current) {
            hasInitialized.current = true;
            fetchReports();
        }
    }, [fetchReports]);

    return {
        reports,
        loading,
        error,
        fetchReports,
        handleUpdateReportStatus,
        setError
    };
};
