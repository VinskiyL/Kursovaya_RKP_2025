import api from './api';

export const genreService = {
  // GET все жанры
  getAll: () => api.get('/genres'),
  
  // GET жанр по ID
  getById: (id) => api.get(`/genres/${id}`),
  
  // POST создать жанр
  create: (genreData) => api.post('/genres', genreData),
  
  // PUT обновить жанр
  update: (id, genreData) => api.put(`/genres/${id}`, genreData),
  
  // DELETE удалить жанр
  delete: (id) => api.delete(`/genres/${id}`),
};