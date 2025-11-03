import { useState, useEffect } from 'react';
import { bookService } from '../services/bookService';

export const useBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Загрузка всех книг
  const loadBooks = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await bookService.getAll();
      setBooks(response.data);
    } catch (err) {
      setError('Ошибка при загрузке книг');
      console.error('Error loading books:', err);
    } finally {
      setLoading(false);
    }
  };

  // Создание книги
  const createBook = async (bookData) => {
    try {
      const response = await bookService.create(bookData);
      await loadBooks();
      setBooks(prev => [...prev, response.data]);
      return response.data;
    } catch (err) {
      setError('Ошибка при создании книги');
      throw err;
    }
  };

  // 🆕 ОБНОВЛЕНИЕ КНИГИ
  const updateBook = async (id, bookData) => {
    try {
      const response = await bookService.update(id, bookData);
      await loadBooks();
      setBooks(prev => prev.map(book => 
        book.id === id ? response.data : book
      ));
      return response.data;
    } catch (err) {
      setError('Ошибка при обновлении книги');
      throw err;
    }
  };

  // Удаление книги
  const deleteBook = async (id) => {
    try {
      await bookService.delete(id);
      await loadBooks();
      setBooks(prev => prev.filter(book => book.id !== id));
    } catch (err) {
      setError('Ошибка при удалении книги');
      throw err;
    }
  };

  // Загружаем книги при монтировании
  useEffect(() => {
    loadBooks();
  }, []);

  return {
    books,
    loading,
    error,
    createBook,
    updateBook, // 🆕 ДОБАВЛЯЕМ
    deleteBook,
    refreshBooks: loadBooks
  };
};