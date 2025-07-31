import { useState, useEffect } from 'react';
import { getAllSubjects, createMaterial } from '../../services/api';

const useCreateMaterial = (open, onClose, onSuccess) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    grade: '',
    fileUrl: ''
  });
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      fetchSubjects();
    }
  }, [open]);

  const fetchSubjects = async () => {
    try {
      const response = await getAllSubjects();
      let subjectsData = [];
      
      if (response.data?.data && Array.isArray(response.data.data)) {
        subjectsData = response.data.data;
      } else if (response.data?.subjects) {
        subjectsData = response.data.subjects;
      } else if (Array.isArray(response.data)) {
        subjectsData = response.data;
      }
      
      setSubjects(subjectsData);
    } catch (error) {
      setSubjects([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await createMaterial(formData);
      if (response.success) {
        onSuccess?.();
        handleClose();
      } else {
        setError(response.message || 'Error al crear el material');
      }
    } catch (error) {
      setError('Error al crear el material');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      subject: '',
      grade: '',
      fileUrl: ''
    });
    setError('');
    onClose();
  };

  return {
    formData,
    subjects,
    loading,
    error,
    handleChange,
    handleSubmit,
    handleClose
  };
};

export default useCreateMaterial;