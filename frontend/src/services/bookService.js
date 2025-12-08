import api from './api';

export const bookService = {
  // Существующие методы...
  getAll: () => api.get('/books'),
  getAllWithDetails: () => api.get('/books/with-details'),
  getById: (id) => api.get(`/books/${id}`),
  create: (bookData) => api.post('/books', bookData),
  update: (id, bookData) => api.put(`/books/${id}`, bookData),
  delete: (id) => api.delete(`/books/${id}`),
  
  // Методы для работы с авторами книги
  getBookAuthors: (bookId) => api.get(`/books/${bookId}/authors`),
  addAuthorToBook: (bookId, authorId) => api.post(`/books/${bookId}/authors/${authorId}`),
  removeAuthorFromBook: (bookId, authorId) => api.delete(`/books/${bookId}/authors/${authorId}`),
  
  // Методы для работы с жанрами книги
  getBookGenres: (bookId) => api.get(`/books/${bookId}/genres`),
  addGenreToBook: (bookId, genreId) => api.post(`/books/${bookId}/genres/${genreId}`),
  removeGenreFromBook: (bookId, genreId) => api.delete(`/books/${bookId}/genres/${genreId}`),
};