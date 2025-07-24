import { useState, useEffect } from 'react';
import { getAllSubjects, getSubjectById } from '../../services/api';

export const useSubjectGets = () => {
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchAllSubjects = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getAllSubjects();
            if (response.error) {
                setError(response.e?.response?.data?.message || 'Error al obtener las materias');
                setSubjects([]);
            } else {
                setSubjects(response.data?.data || []);
            }
        } catch (err) {
            setError('Error inesperado al obtener las materias');
            setSubjects([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllSubjects();
    }, []);

    return {
        subjects,
        loading,
        error,
        refetch: fetchAllSubjects
    };
};

export const useSubjectById = (sid) => {
    const [subject, setSubject] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchSubjectById = async () => {
        if (!sid) return;
        
        setLoading(true);
        setError(null);
        try {
            const response = await getSubjectById(sid);
            if (response.error) {
                setError(response.e?.response?.data?.message || 'Error al obtener la materia');
                setSubject(null);
            } else {
                setSubject(response.data?.data || null);
            }
        } catch (err) {
            setError('Error inesperado al obtener la materia');
            setSubject(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubjectById();
    }, [sid]);

    return {
        subject,
        loading,
        error,
        refetch: fetchSubjectById
    };
};

export const useSubjects = () => {
    const allSubjects = useSubjectGets();
    
    const getSubjectByIdLazy = async (sid) => {
        setLoading(true);
        setError(null);
        try {
            const response = await getSubjectById(sid);
            if (response.error) {
                setError(response.e?.response?.data?.message || 'Error al obtener la materia');
                return null;
            } else {
                return response.data?.data || null;
            }
        } catch (err) {
            setError('Error inesperado al obtener la materia');
            return null;
        } finally {
            setLoading(false);
        }
    };

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    return {
        ...allSubjects,
        getSubjectByIdLazy
    };
};