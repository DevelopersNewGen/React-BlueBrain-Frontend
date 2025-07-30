import { useState, useEffect, useCallback } from 'react';
import {
    getAllTutorials,
    getTutorialsByHost,
    getTutorialsBySubject,
    getTutorialById,
    createTutorial,
    updateTutorial,
    deleteTutorial,
    requestTutorial
} from '../../services/api';

import toast from 'react-hot-toast';

export const useTutorials = () => {
    const [tutorials, setTutorials] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [creating, setCreating] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [requesting, setRequesting] = useState(false);

    const fetchTutorials = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getAllTutorials();
            if (response.error) {
                setError('Error al cargar las tutorías');
                setTutorials([]);
            } else {
                setTutorials(response.data || []);
            }
        } catch (err){
            toast.error('Error de conexión al cargar las tutorías: ' + err.message);
            setTutorials([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchTutorialsByHost = useCallback(async (uid) => {
        setLoading(true);
        setError(null);
        try {
            const response = await getTutorialsByHost(uid);
            if (response.error) {
                setError('Error al cargar las tutorías del host');
                return { success: false, data: [] };
            } else {
                return { success: true, data: response.data || [] };
            }
        } catch (err) {
            toast.error('Error de conexión al cargar las tutorías: ' + err.message);
            return { 
                success: false, 
                data: [] 
            };
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchTutorialsBySubject = useCallback(async (sid) => {
        setLoading(true);
        setError(null);
        try {
            const response = await getTutorialsBySubject(sid);
            if (response.error) {
                setError('Error al cargar las tutorías de la materia');
                return { success: false, data: [] };
            } else {
                return { success: true, data: response.data || [] };
            }
        } catch (err) {
            toast.error('Error de conexión al cargar las tutorías: ' + err.message);
            return {
                success: false, 
                data: [] 
            };
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchTutorialById = useCallback(async (tid) => {
        setLoading(true);
        setError(null);
        try {
            const response = await getTutorialById(tid);
            if (response.error) {
                setError('Error al cargar la tutoría');
                return { success: false, data: null };
            } else {
                return { success: true, data: response.data };
            }
        } catch (err) {
            toast.error('Error de conexión al cargar las tutorías: ' + err.message);
            return {
                success: false, 
                data: null
            };
        } finally {
            setLoading(false);
        }
    }, []);

    const createNewTutorial = useCallback(async (tutorialData) => {
        setCreating(true);
        setError(null);
        try {
            const response = await createTutorial(tutorialData);
            
            if (response.error || !response.success) {
                setError(response.message || 'Error al crear la tutoría');
                return { success: false, error: response.message };
            } else {
                await fetchTutorials();
                return { success: true, data: response.data };
            }
        } catch (err) {
            toast.error('Error de conexión al cargar las tutorías: ' + err.message);
            return { success: false, error: 'Error de conexión' };
        } finally {
            setCreating(false);
        }
    }, [fetchTutorials]);

    const updateExistingTutorial = useCallback(async (tid, tutorialData) => {
        setUpdating(true);
        setError(null);
        try {
            const response = await updateTutorial(tid, tutorialData);
            if (response.error) {
                setError(response.message || 'Error al actualizar la tutoría');
                return { success: false, error: response.message };
            } else {
                await fetchTutorials();
                return { success: true, data: response.data };
            }
        } catch (err) {
            toast.error('Error de conexión al cargar las tutorías: ' + err.message);
            return { success: false, error: 'Error de conexión' };
        } finally {
            setUpdating(false);
        }
    }, [fetchTutorials]);

    const deleteExistingTutorial = useCallback(async (tid) => {
        setDeleting(true);
        setError(null);
        try {
            const response = await deleteTutorial(tid);
            if (response.error) {
                setError(response.message || 'Error al eliminar la tutoría');
                return { success: false, error: response.message };
            } else {
                await fetchTutorials();
                return { success: true };
            }
        } catch (err) {
            toast.error('Error de conexión al cargar las tutorías: ' + err.message);
            return { success: false, error: 'Error de conexión' };
        } finally {
            setDeleting(false);
        }
    }, [fetchTutorials]);

    const requestExistingTutorial = useCallback(async (tid, requestData) => {
        setRequesting(true);
        setError(null);
        try {
            const response = await requestTutorial(tid, requestData);
            if (response.error) {
                setError(response.message || 'Error al solicitar la tutoría');
                return { success: false, error: response.message };
            } else {
                return { success: true, message: response.message };
            }
        } catch (err) {
            toast.error('Error de conexión al cargar las tutorías: ' + err.message);
            return { success: false, error: 'Error de conexión' };
        } finally {
            setRequesting(false);
        }
    }, []);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    useEffect(() => {
        fetchTutorials();
    }, [fetchTutorials]);

    return {
        tutorials,
        loading,
        error,
        creating,
        updating,
        deleting,
        requesting,
        fetchTutorials,
        fetchTutorialsByHost,
        fetchTutorialsBySubject,
        fetchTutorialById,
        createNewTutorial,
        updateExistingTutorial,
        deleteExistingTutorial,
        requestExistingTutorial,
        clearError,
        refreshTutorials: fetchTutorials
    };
};
