import { useState, useCallback } from 'react';
import { removeTutorFromSubject } from '../../services/api';

const useSubjectRemoveTutor = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [response, setResponse] = useState(null);

    const removeTutor = useCallback(async (sid, tutorId) => {
        setLoading(true);
        setError(null);
        try {
            const result = await removeTutorFromSubject(sid, { tutorId });
            setResponse(result);
            return result;
        } catch (err) {
            setError(err);
            return { error: true, message: err.message };
        } finally {
            setLoading(false);
        }
    }, []);

    return { removeTutor, loading, error, response };
};

export default useSubjectRemoveTutor;