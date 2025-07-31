import axios from 'axios';

const apiClient = axios.create({
    baseURL: `https://nodejsbluebrainbackend.vercel.app/BlueBrain/v1`,
    timeout: 15000, 
    httpsAgent: false
});

export const authEndpoints = {
    login: `https://nodejsbluebrainbackend.vercel.app/BlueBrain/v1/auth/login`
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

export const createSubject = async (subjectData) => {
    try {
        console.log('Creating subject with data:', subjectData)
        
        const response = await apiClient.post('/subjects/create', subjectData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        console.log('Create subject response:', response)
        return response.data;
    } catch (e) {
        console.error('Error creating subject:', e)
        return { error: true, e };
    }
};

export const updateSubject = async (sid, subjectData) => {
    try {
        console.log('Sending PUT request to:', `/subjects/update/${sid}`)
        console.log('With data:', subjectData)
        
        const response = await apiClient.put(`/subjects/update/${sid}`, subjectData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        console.log('Backend response:', response)
        return response.data;
    } catch (e) {
        console.error('Error in updateSubject:', e)
        console.error('Error response:', e.response?.data)
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

// tutorials

export const getAllTutorials = async () => {
    try {
        const response = await apiClient.get('/tutorials');
        return response.data;
    } catch (e) {
        return { error: true, e };
    }
};

export const getTutorialsByHost = async (uid) => {
    try {
        const response = await apiClient.get(`/tutorials/host/${uid}`);
        return response.data;
    } catch (e) {
        return { error: true, e };
    }
};

export const getTutorialsBySubject = async (sid) => {
    try {
        const response = await apiClient.get(`/tutorials/subject/${sid}`);
        return response.data;
    } catch (e) {
        return { error: true, e };
    }
};

export const getTutorialById = async (tid) => {
    try {
        const response = await apiClient.get(`/tutorials/${tid}`);
        return response.data;
    } catch (e) {
        return { error: true, e };
    }
};

export const createTutorial = async (tutorialData) => {
    try {
        const createTutorialClient = axios.create({
            baseURL: `http://localhost:3000/BlueBrain/v1`,
            timeout: 30000, 
            httpsAgent: false
        });

        createTutorialClient.interceptors.request.use(
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

        const response = await createTutorialClient.post('/tutorials/create', tutorialData);
        return response.data; 
    } catch (e) {
        return { error: true, e };
    }
};

export const updateTutorial = async (tid, tutorialData) => {
    try {
        const response = await apiClient.put(`/tutorials/update/${tid}`, tutorialData);
        return response.data;
    } catch (e) {
        return { error: true, e };
    }
};

export const deleteTutorial = async (tid) => {
    try {
        const response = await apiClient.delete(`/tutorials/delete/${tid}`);
        return response.data;
    } catch (e) {
        return { error: true, e };
    }
};

export const requestTutorial = async (tid, requestData = {}) => {
    try {
        const response = await apiClient.post(`/tutorials/accept/${tid}`, requestData);
        return response.data;
    } catch (e) {
        return { error: true, e };
    }
};

export const getTutorialByTutor = async () => {
    try {
        const response = await apiClient.get(`/tutorials/myTutorials`);
        return response.data;
    } catch (e) {
        return { error: true, e };
    }
};

// public tutorials
export const getAllPublicTutorials = async () => {
    try {
        const response = await apiClient.get('/publicTutorials');
        return response.data;
    } catch (e) {
        return { error: true, e };
    }
};

export const getPublicTutorialById = async (ptid) => {
    try {
        const response = await apiClient.get(`/publicTutorials/${ptid}`);
        return response.data;
    } catch (e) {
        return { error: true, e };
    }
};

export const getMyPublicTutorials = async () => {
    try {
        const response = await apiClient.get('/publicTutorials/myTutorials');
        return response.data;
    } catch (e) {
        return { error: true, e };
    }
};

export const getPublicTutorialsByStudent = async (studentId) => {
    try {
        const response = await apiClient.get(`/publicTutorials/student/${studentId}`);
        return response.data;
    } catch (e) {
        return { error: true, e };
    }
};

export const updatePublicTutorialStatus = async (ptid, statusData) => {
    try {
        const response = await apiClient.patch(`/publicTutorials/status/${ptid}`, statusData);
        return response.data;
    } catch (e) {
        return { error: true, e };
    }
};

// private tutorials
export const getAllPrivateTutorials = async () => {
    try {
        const response = await apiClient.get('/privTutorials');
        return response.data;
    } catch (e) {
        return { error: true, e };
    }
};

export const getPrivateTutorialById = async (ptid) => {
    try {
        const response = await apiClient.get(`/privTutorials/get/${ptid}`);
        return response.data;
    } catch (e) {
        return { error: true, e };
    }
};

export const acceptPrivateTutorial = async (ptid, responseData = {}) => {
    try {
        const response = await apiClient.patch(`/privTutorials/accept/${ptid}`, responseData);
        return response.data;
    } catch (e) {
        return { error: true, e };
    }
};

export const rejectPrivateTutorial = async (ptid, responseData = {}) => {
    try {
        const response = await apiClient.patch(`/privTutorials/reject/${ptid}`, responseData);
        return response.data;
    } catch (e) {
        return { error: true, e };
    }
};

export const getPrivateTutorialsByStudent = async (studentId) => {
    try {
        const response = await apiClient.get(`/privTutorials/student/${studentId}`);
        return response.data;
    } catch (e) {
        return { error: true, e };
    }
};

export const getMyPrivateTutorials = async () => {
    try {
        const response = await apiClient.get('/privTutorials/myTutorials');
        return response.data;
    } catch (e) {
        return { error: true, e };
    }
};