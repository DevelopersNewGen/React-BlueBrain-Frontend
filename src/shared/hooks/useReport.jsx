import { useState } from 'react';
import { reportUser } from '../../services/api';

export const useReport = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const submitReport = async (reportData) => {
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const response = await reportUser(reportData);
            
            if (response.error) {
                setError(response.e?.response?.data?.message || 'Error al enviar el reporte');
                return { success: false, error: response.e };
            }

            setSuccess(true);
            return { success: true, data: response };
        } catch (err) {
            setError('Error inesperado al enviar el reporte');
            return { success: false, error: err };
        } finally {
            setLoading(false);
        }
    };

    const clearMessages = () => {
        setError(null);
        setSuccess(false);
    };

    return {
        loading,
        error,
        success,
        submitReport,
        clearMessages
    };
};

export default useReport;
