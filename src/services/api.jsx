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


