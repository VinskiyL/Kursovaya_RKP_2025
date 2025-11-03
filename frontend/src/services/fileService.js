import api from './api';

export const fileService = {
  // Загрузка обложки
  uploadCover: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    return api.post('/upload/cover', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Удаление обложки
  deleteCover: (filePath) => {
    return api.delete('/upload/cover', {
      params: { filePath }
    });
  }
};