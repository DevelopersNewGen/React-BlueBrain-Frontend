import axios from 'axios';

const apiClient = axios.create({
    baseURL: `http://localhost:3000/BlueBrain/v1`,
    timeout: 3000,
    httpsAgent: false
});

export const authEndpoints = {
    login: `http://localhost:3000/BlueBrain/v1/auth/login`
};

apiClient.interceptors.request.use(
    (config) => {
        const userDetails = localStorage.getItem("user");

        if (userDetails) {
            try {
                const parsedUser = JSON.parse(userDetails);
                if (parsedUser?.token) {
                    config.headers.Authorization = `Bearer ${parsedUser.token}`;
                }
            } catch (err) {
                console.warn("Error al leer el token:", err);
            }
        }

        return config;
    },
    (error) => Promise.reject(error)
);

export const getUserRoleByUid = async (uid) => {
    try {
        return await apiClient.get(`/users/role/${uid}`);
    } catch (e) {
        return { error: true, e };
    }
};

export const getAllUsers = async () => {
  try {
    const response = await apiClient.get('/users')
    return {
      success: response.data.success,
      data: Array.isArray(response.data.users) ? response.data.users : [],
      message: response.data.message
    }
  } catch (e) {
    console.error('Error en getAllUsers:', e)
    return { success: false, message: e.message, data: [] }
  }
};

export const updateProfilePicture = async (formData) => {
    try {
        const response = await apiClient.patch('/users/updateProfilePicture', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (e) {
        return { error: true, e };
    }
};

//subject 

export const getAllSubjects = async () => {
    try {
        const response = await apiClient.get('/subjects');
        return response.data;
    } catch (e) {
        return { error: true, e };
    }
};
// reports 
export const getAllReports = async () => {
    try {
        const response = await apiClient.get('/reports');
        console.log('getAllReports response:', response);
        return response;
    } catch (e) {
        console.error('getAllReports error:', e);
        return { error: true, e };
    }
};

export const updateReportStatus = async (reportId, status) => {
    try {
        const response = await apiClient.patch(`/reports/status/${reportId}`, { status });
        return response;
    } catch (e) {
        console.error('updateReportStatus error:', e);
        return { error: true, e };
    }
};

export const getSubjectById = async (sid) => {
    try {
        return await apiClient.get(`/subjects/${sid}`);
    } catch (e) {
        return { error: true, e };
    }
};

export const createSubject = async (formData) => {
    try {
        const response = await apiClient.post('/subjects/create', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (e) {
        return { error: true, e };
    }
};

export const updateSubject = async (sid, subjectData) => {
    try {
        const response = await apiClient.put(`/subjects/update/${sid}`, subjectData);
        return response.data;
    } catch (e) {
        return { error: true, e };
    }
};

export const deleteSubject = async (sid) => {
    try {
        const response = await apiClient.delete(`/subjects/delete/${sid}`);
        return response.data;
    } catch (e) {
        return { error: true, e };
    }
};

export const addTeacherToSubject = async (sid, teacherData) => {
    try {
        const response = await apiClient.put(`/subjects/addTeacher/${sid}`, teacherData);
        return response.data;
    } catch (e) {
        return { error: true, e };
    }
};

export const removeTeacherFromSubject = async (sid, teacherData) => {
    try {
        const response = await apiClient.put(`/subjects/removeTeacher/${sid}`, teacherData);
        return response.data;
    } catch (e) {
        return { error: true, e };
    }
};

export const removeTutorFromSubject = async (sid, tutorData) => {
    try {
        const response = await apiClient.put(`/subjects/removeTutor/${sid}`, tutorData);
        return response.data;
    } catch (e) {
        return { error: true, e };
    }
};

// Applications
export const requestTutor = async (formData) => {
    try {
        const response = await apiClient.post('/applications/requestTutor', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (e) {
        return { error: true, e };
    }
};

export const getAllApplications = async () => {
    try {
        const response = await apiClient.get('/applications');
        return response.data;
    } catch (e) {
        return { error: true, e };
    }
};

export const getApplicationsByUser = async (userId) => {
    try {
        const response = await apiClient.get(`/applications/user/${userId}`);
        return response.data;
    } catch (e) {
        return { error: true, e };
    }
};

export const getApplicationsBySubject = async (subjectId) => {
    try {
        const response = await apiClient.get(`/applications/subject/${subjectId}`);
        return response.data;
    } catch (e) {
        return { error: true, e };
    }
};

export const updateApplicationStatus = async (applicationId, status, responseMessage = '') => {
    try {
        console.log('Updating application status:', { applicationId, status, responseMessage });
        
        const response = await apiClient.patch(`/applications/approve/${applicationId}`, {
            status,
            responseMessage
        });
        
        console.log('Update response:', response.data);
        return response.data;
    } catch (e) {
        console.error('Error updating application status:', e.response?.data || e.message);
        return { 
            error: true, 
            e,
            message: e.response?.data?.msg || e.message || 'Error al actualizar la aplicación'
        };
    }
};
