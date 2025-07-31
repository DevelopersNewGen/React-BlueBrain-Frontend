import { useState, useEffect } from 'react';
import { getAllUsers } from '../../services/api.jsx';

const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getAllUsers();
        
        if (response?.data && Array.isArray(response.data)) {
          setUsers(response.data);
        } else {
          setError('No se encontraron usuarios');
        }
      } catch (e) {
        setError('Error al obtener usuarios');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return { users, loading, error };
};

export default useUsers;