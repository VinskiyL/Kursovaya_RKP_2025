import api from './api';

export const authorService = {
  // GET все авторы
  getAll: () => api.get('/authors'),
  
  // GET автор по ID
  getById: (id) => api.get(`/authors/${id}`),
  
  // POST создать автора
  create: (authorData) => api.post('/authors', authorData),
  
  // PUT обновить автора
  update: (id, authorData) => api.put(`/authors/${id}`, authorData),
  
  // DELETE удалить автора
  delete: (id) => api.delete(`/authors/${id}`),
};