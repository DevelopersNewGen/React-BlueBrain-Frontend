import { useState, useCallback } from 'react';
import { removeTeacherFromSubject } from '../../services/api';

const useSubjectRemoveTeacher = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [response, setResponse] = useState(null);

    const removeTeacher = useCallback(async (sid, teacherId) => {
        setLoading(true);
        setError(null);
        try {
            const result = await removeTeacherFromSubject(sid, { teacherId });
            setResponse(result);
            return result;
        } catch (err) {
            setError(err);
            return { error: true, message: err.message };
        } finally {
            setLoading(false);
        }
    }, []);

    return { removeTeacher, loading, error, response };
};

export default useSubjectRemoveTeacher;