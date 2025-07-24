import { useEffect, useRef, useState } from 'react';
import { updateProfilePicture } from '../../services/api';

const DEFAULT_IMG = 'https://res.cloudinary.com/dibe6yrzf/image/upload/v1747668225/perfil-de-usuario_cxmmxq.png';

export default function useUserProfile({ open, onClose, user, triggerRef }) {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);
  const [profilePic, setProfilePic] = useState(
    user?.profilePicture || user?.img || DEFAULT_IMG
  );
  const fileInputRef = useRef();

  const handleClose = () => {
    onClose();
  };

  useEffect(() => {
    if (!open && triggerRef?.current) {
      triggerRef.current.focus();
    }
  }, [open, triggerRef]);

  useEffect(() => {
    const root = document.getElementById('root');
    if (open) {
      root.setAttribute('inert', 'true');
    } else {
      root.removeAttribute('inert');
    }
  }, [open]);

  useEffect(() => {
    setProfilePic(user?.profilePicture || user?.img || DEFAULT_IMG);
  }, [user]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      setError(null);
    }
  };

  const handleUpload = async () => {
    const file = fileInputRef.current.files[0];
    if (!file) {
      setError('Selecciona una imagen');
      return;
    }
    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append('img', file);
    try {
      const res = await updateProfilePicture(formData);
      if (res?.user?.profilePicture) {
        setProfilePic(res.user.profilePicture);
        setPreview(null);
        setError(null);
        const storedUser = JSON.parse(localStorage.getItem('user'));
        localStorage.setItem(
          'user',
          JSON.stringify({
            ...storedUser,
            profilePicture: res.user.profilePicture,
          })
        );
        window.location.reload();
      } else {
        setError('No se pudo actualizar la foto');
      }
    } catch (e) {
      setError('Error al subir la imagen');
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    preview,
    error,
    profilePic,
    fileInputRef,
    handleFileChange,
    handleUpload,
    handleClose,
  };
}