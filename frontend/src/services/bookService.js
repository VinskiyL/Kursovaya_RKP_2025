import api from './api';

export const bookService = {
  // GET все книги
  getAll: () => api.get('/books'),
  
  // GET книга по ID
  getById: (id) => api.get(`/books/${id}`),
  
  // POST создать книгу
  create: (bookData) => api.post('/books', bookData),
  
  // PUT обновить книгу
  update: (id, bookData) => api.put(`/books/${id}`, bookData),
  
  // DELETE удалить книгу
  delete: (id) => api.delete(`/books/${id}`),
  
  // GET авторы книги
  getAuthors: (bookId) => api.get(`/books/${bookId}/authors`),
};