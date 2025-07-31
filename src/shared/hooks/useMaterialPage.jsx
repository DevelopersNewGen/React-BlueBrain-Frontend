import { useState, useEffect } from 'react';
import { getAllMaterials, deleteMaterial } from '../../services/api';

const useMaterialPage = () => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialog, setEditDialog] = useState({ open: false, material: null });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, material: null });

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await getAllMaterials();
      if (response.success) {
        setMaterials(response.materials || []);
      } else {
        setError('Error al cargar los materiales');
      }
    } catch (error) {
      setError('Error al cargar los materiales');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (materialId) => {
    try {
      const response = await deleteMaterial(materialId);
      if (response.success) {
        await fetchMaterials();
        setDeleteDialog({ open: false, material: null });
      } else {
        setError('Error al eliminar el material');
      }
    } catch (error) {
      setError('Error al eliminar el material');
    }
  };

  const handleCreateDialogOpen = () => {
    setCreateDialogOpen(true);
  };

  const handleCreateDialogClose = () => {
    setCreateDialogOpen(false);
  };

  const handleEditDialogOpen = (material) => {
    setEditDialog({ open: true, material });
  };

  const handleEditDialogClose = () => {
    setEditDialog({ open: false, material: null });
  };

  const handleDeleteDialogOpen = (material) => {
    setDeleteDialog({ open: true, material });
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialog({ open: false, material: null });
  };

  const handleCreateSuccess = () => {
    fetchMaterials();
    setError('');
  };

  const handleEditSuccess = () => {
    fetchMaterials();
    setError('');
  };

  const clearError = () => {
    setError('');
  };

  return {
    materials,
    loading,
    error,
    createDialogOpen,
    editDialog,
    deleteDialog,
    fetchMaterials,
    handleDelete,
    handleCreateDialogOpen,
    handleCreateDialogClose,
    handleEditDialogOpen,
    handleEditDialogClose,
    handleDeleteDialogOpen,
    handleDeleteDialogClose,
    handleCreateSuccess,
    handleEditSuccess,
    clearError
  };
};

export default useMaterialPage;