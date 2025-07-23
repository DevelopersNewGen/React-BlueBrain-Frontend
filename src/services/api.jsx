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
        return await apiClient.get('/users');
    } catch (e) {
        return { error: true, e };
    }
};

// Reports 
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

export const getReportById = async (id) => {
    try {
        return await apiClient.get(`/reports/${id}`);
    } catch (e) {
        return { error: true, e };
    }
};

export const createReport = async (reportData) => {
    try {
        return await apiClient.post('/reports', reportData);
    } catch (e) {
        return { error: true, e };
    }
};

export const updateReport = async (id, reportData) => {
    try {
        return await apiClient.put(`/reports/${id}`, reportData);
    } catch (e) {
        return { error: true, e };
    }
};

export const deleteReport = async (id) => {
    try {
        return await apiClient.delete(`/reports/${id}`);
    } catch (e) {
        return { error: true, e };
    }
};

import axios from 'axios';