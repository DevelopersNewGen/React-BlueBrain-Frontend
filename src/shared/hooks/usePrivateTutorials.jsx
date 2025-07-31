import { useState, useCallback } from 'react';
import {
    getAllPrivateTutorials,
    getPrivateTutorialById,
    acceptPrivateTutorial,
    rejectPrivateTutorial,
    getPrivateTutorialsByStudent,
    getMyPrivateTutorials
} from '../../services/api';

import toast from 'react-hot-toast';

export const usePrivateTutorials = () => {
    const [privateTutorials, setPrivateTutorials] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [accepting, setAccepting] = useState(false);
    const [hasLoaded, setHasLoaded] = useState(false); 

    const fetchPrivateTutorials = useCallback(async () => {
        if (loading) return;
        
        setLoading(true);
        setError(null);
        try {
            const response = await getAllPrivateTutorials();
            if (response.error) {
                setError('Error al cargar las tutorías privadas');
                setPrivateTutorials([]);
                toast.error('Error al cargar las tutorías privadas');
            } else {
                setPrivateTutorials(response.data || []);
                setHasLoaded(true);
            }
        } catch (err) {
            toast.error('Error de conexión al cargar las tutorías privadas: ' + err.message);
            setPrivateTutorials([]);
        } finally {
            setLoading(false);
        }
    }, [loading]);

    const fetchPrivateTutorialById = useCallback(async (ptid) => {
        setLoading(true);
        setError(null);
        try {
            const response = await getPrivateTutorialById(ptid);
            if (response.error) {
                setError('Error al cargar la tutoría privada');
                return { success: false, data: null };
            } else {
                return { success: true, data: response.data };
            }
        } catch (err) {
            toast.error('Error de conexión al cargar la tutoría privada: ' + err.message);
            return { success: false, data: null };
        } finally {
            setLoading(false);
        }
    }, []);

    const acceptTutorial = useCallback(async (ptid) => {
        setAccepting(true);
        setError(null);
        try {
            const response = await acceptPrivateTutorial(ptid);
            
            if (response.error) {
                const errorMessage = response.e?.response?.data?.message || 'Error al aceptar la tutoría privada';
                setError(errorMessage);
                toast.error(errorMessage);
                return { success: false, message: errorMessage };
            } else {
                setPrivateTutorials(prevTutorials => 
                    prevTutorials.map(tutorial => 
                        tutorial._id === ptid 
                            ? { ...tutorial, ...response.data }
                            : tutorial
                    )
                );
                
                const successMessage = response.message || 'Tutoría privada aceptada exitosamente';
                toast.success(successMessage);
                return { success: true, data: response.data };
            }
        } catch (err) {
            const errorMessage = 'Error de conexión al aceptar la tutoría privada: ' + err.message;
            toast.error(errorMessage);
            return { success: false, message: errorMessage };
        } finally {
            setAccepting(false);
        }
    }, []);

    const fetchMyPrivateTutorials = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getMyPrivateTutorials();
            if (response.error) {
                setError('Error al cargar mis tutorías privadas');
                return { success: false, data: [] };
            } else {
                return { success: true, data: response.data || [] };
            }
        } catch (err) {
            toast.error('Error de conexión al cargar mis tutorías privadas: ' + err.message);
            return { success: false, data: [] };
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchPrivateTutorialsByStudent = useCallback(async (studentId) => {
        setLoading(true);
        setError(null);
        try {
            const response = await getPrivateTutorialsByStudent(studentId);
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

    const acceptPrivateTutorialRequest = useCallback(async (tutorialId, responseData = {}) => {
        setAccepting(true);
        setError(null);
        try {
            const response = await acceptPrivateTutorial(tutorialId, responseData);
            
            if (response.error) {
                const errorMessage = response.e?.response?.data?.message || 'Error al aceptar la solicitud';
                setError(errorMessage);
                toast.error(errorMessage);
                return { success: false, message: errorMessage };
            } else {
                setPrivateTutorials(prevTutorials => 
                    prevTutorials.map(tutorial => 
                        tutorial._id === tutorialId 
                            ? { ...tutorial, status: 'ACCEPTED', ...response.data }
                            : tutorial
                    )
                );
                
                const successMessage = response.message || 'Solicitud aceptada exitosamente';
                toast.success(successMessage);
                return { success: true, data: response.data };
            }
        } catch (err) {
            const errorMessage = 'Error de conexión al aceptar la solicitud: ' + err.message;
            toast.error(errorMessage);
            return { success: false, message: errorMessage };
        } finally {
            setAccepting(false);
        }
    }, []);

    const rejectPrivateTutorialRequest = useCallback(async (tutorialId, responseData = {}) => {
        setAccepting(true);
        setError(null);
        try {
            const response = await rejectPrivateTutorial(tutorialId, responseData);
            
            if (response.error) {
                const errorMessage = response.e?.response?.data?.message || 'Error al rechazar la solicitud';
                setError(errorMessage);
                toast.error(errorMessage);
                return { success: false, message: errorMessage };
            } else {
                setPrivateTutorials(prevTutorials => 
                    prevTutorials.map(tutorial => 
                        tutorial._id === tutorialId 
                            ? { ...tutorial, status: 'REJECTED', ...response.data }
                            : tutorial
                    )
                );
                
                const successMessage = response.message || 'Solicitud rechazada';
                toast.success(successMessage);
                return { success: true, data: response.data };
            }
        } catch (err) {
            const errorMessage = 'Error de conexión al rechazar la solicitud: ' + err.message;
            toast.error(errorMessage);
            return { success: false, message: errorMessage };
        } finally {
            setAccepting(false);
        }
    }, []);



    return {
        privateTutorials,
        loading,
        error,
        accepting,
        hasLoaded,
        fetchPrivateTutorials,
        fetchPrivateTutorialById,
        acceptTutorial,
        fetchMyPrivateTutorials,
        fetchPrivateTutorialsByStudent,
        acceptPrivateTutorialRequest,
        rejectPrivateTutorialRequest,
        refetch: fetchPrivateTutorials
    };
};

export default usePrivateTutorials;
