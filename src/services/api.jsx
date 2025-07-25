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

export const getSubjectUsers = async (subjectId) => {
  try {
    const response = await apiClient.get(`/subject/${subjectId}`)
    return response.data
  } catch (e) {
    return { error: true, e }
  }
}

//subject 

export const getAllSubjects = async () => {
    try {
        return await apiClient.get('/subjects');
    } catch (e) {
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

import axios from 'axios';