import { useState, useCallback } from 'react';
import {
    getAllPublicTutorials,
    getPublicTutorialById,
    getMyPublicTutorials,
    getPublicTutorialsByStudent,
    updatePublicTutorialStatus
} from '../../services/api';

import toast from 'react-hot-toast';

export const usePublicTutorials = () => {
    const [publicTutorials, setPublicTutorials] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [updating, setUpdating] = useState(false);
    const [hasLoaded, setHasLoaded] = useState(false); 

    const fetchPublicTutorials = useCallback(async () => {
        if (loading) return;
        
        setLoading(true);
        setError(null);
        try {
            const response = await getAllPublicTutorials();
            if (response.error) {
                setError('Error al cargar las tutorías públicas');
                setPublicTutorials([]);
                toast.error('Error al cargar las tutorías públicas');
            } else {
                setPublicTutorials(response.data || []);
                setHasLoaded(true);
            }
        } catch (err) {
            toast.error('Error de conexión al cargar las tutorías públicas: ' + err.message);
            setPublicTutorials([]);
        } finally {
            setLoading(false);
        }
    }, [loading]);

    const fetchPublicTutorialById = useCallback(async (ptid) => {
        setLoading(true);
        setError(null);
        try {
            const response = await getPublicTutorialById(ptid);
            if (response.error) {
                setError('Error al cargar la tutoría pública');
                return { success: false, data: null };
            } else {
                return { success: true, data: response.data };
            }
        } catch (err) {
            toast.error('Error de conexión al cargar la tutoría pública: ' + err.message);
            return { success: false, data: null };
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchMyPublicTutorials = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getMyPublicTutorials();
            if (response.error) {
                setError('Error al cargar mis tutorías públicas');
                return { success: false, data: [] };
            } else {
                return { success: true, data: response.data || [] };
            }
        } catch (err) {
            toast.error('Error de conexión al cargar mis tutorías públicas: ' + err.message);
            return { success: false, data: [] };
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchPublicTutorialsByStudent = useCallback(async (studentId) => {
        setLoading(true);
        setError(null);
        try {
            const response = await getPublicTutorialsByStudent(studentId);
            if (response.error) {
                setError('Error al cargar las tutorías del estudiante');
                return { success: false, data: [] };
            } else {
                return { success: true, data: response.data || [] };
            }
        } catch (err) {
            toast.error('Error de conexión al cargar las tutorías del estudiante: ' + err.message);
            return { success: false, data: [] };
        } finally {
            setLoading(false);
        }
    }, []);

    const updateTutorialStatus = useCallback(async (ptid, statusData) => {
        setUpdating(true);
        setError(null);
        try {
            const response = await updatePublicTutorialStatus(ptid, statusData);
            
            if (response.error) {
                const errorMessage = response.e?.response?.data?.message || 'Error al actualizar el estado de la tutoría';
                setError(errorMessage);
                toast.error(errorMessage);
                return { success: false, message: errorMessage };
            } else {
                setPublicTutorials(prevTutorials => 
                    prevTutorials.map(tutorial => 
                        tutorial._id === ptid 
                            ? { ...tutorial, ...response.data }
                            : tutorial
                    )
                );
                
                toast.success('Estado de la tutoría actualizado exitosamente');
                return { success: true, data: response.data };
            }
        } catch (err) {
            const errorMessage = 'Error de conexión al actualizar el estado de la tutoría: ' + err.message;
            toast.error(errorMessage);
            return { success: false, message: errorMessage };
        } finally {
            setUpdating(false);
        }
    }, []);

    return {
        publicTutorials,
        loading,
        error,
        updating,
        hasLoaded,
        fetchPublicTutorials,
        fetchPublicTutorialById,
        fetchMyPublicTutorials,
        fetchPublicTutorialsByStudent,
        updateTutorialStatus,
        refetch: fetchPublicTutorials
    };
};

export default usePublicTutorials;
