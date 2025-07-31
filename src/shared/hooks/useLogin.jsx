import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authEndpoints, getUserRoleByUid } from '../../services/api.jsx';

const useLogin = () => {
    const [user, setUser] = useState(null);
    const [userWithRole, setUserWithRole] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        checkAuthStatus();
    }, []);

    useEffect(() => {
        if (user && user.token) {
            try {
                const payloadBase64 = user.token.split('.')[1];
                const payload = JSON.parse(atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/')));
                getUserRoleByUid(payload.uid)
                    .then(response => {
                        const role = response?.data?.role;
                        setUserWithRole({ ...user, role });
                    })
                    .catch(() => {
                        setUserWithRole(user);
                    });
            } catch {
                setUserWithRole(user);
            }
        } else {
            setUserWithRole(user);
        }
    }, [user]);

    const checkAuthStatus = () => {
        try {
            const userDetails = localStorage.getItem('user');
            if (userDetails) {
                const parsedUser = JSON.parse(userDetails);
                if (parsedUser?.token) {
                    setUser(parsedUser);
                }
            }
        } catch (err) {
            setError('Error al verificar autenticación' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const login = () => {
        try {
            window.location.href = authEndpoints.login;
        } catch (err) {
            setError('Error al iniciar sesión' + err.message);
        }
    };

    const logout = () => {
        try {
            localStorage.removeItem('user');
            setUser(null);
            navigate('/login');
        } catch (err) {
            setError('Error al cerrar sesión' + err.message);
        }
    };

    const isAuthenticated = () => {
        return user && user.token;
    };

    return {
        user,
        userWithRole,
        loading,
        error,
        login,
        logout,
        isAuthenticated: isAuthenticated(),
        checkAuthStatus
    };
};

export default useLogin;