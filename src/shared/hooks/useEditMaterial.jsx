import { useState, useEffect } from 'react';
import { getAllSubjects, updateMaterial } from '../../services/api';

const useEditMaterial = (open, onClose, onSuccess, material) => {
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

  useEffect(() => {
    if (open && material && subjects.length > 0) {
      // Buscar el ID correcto de la materia en la lista de materias disponibles
      let subjectId = '';
      if (material.subject) {
        // Si es un objeto con información completa
        if (typeof material.subject === 'object') {
          subjectId = material.subject.sid || material.subject._id || '';
        } else {
          // Si es solo un string con el ID
          subjectId = material.subject;
        }
        
        // Verificar si el ID existe en las materias disponibles
        const subjectExists = subjects.find(s => 
          (s.sid === subjectId) || (s._id === subjectId)
        );
        
        if (!subjectExists) {
          subjectId = ''; // Resetear si no existe
        }
      }

      setFormData({
        title: material.title || '',
        description: material.description || '',
        subject: subjectId,
        grade: material.grade || '',
        fileUrl: material.fileUrl || ''
      });
    }
  }, [open, material, subjects]);

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
      console.error('Error fetching subjects:', error);
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
      const response = await updateMaterial(material.mid || material._id, formData);
      if (response.success) {
        onSuccess?.();
        handleClose();
      } else {
        setError(response.message || 'Error al actualizar el material');
      }
    } catch (error) {
      console.error('Error updating material:', error);
      setError('Error al actualizar el material');
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

export default useEditMaterial;