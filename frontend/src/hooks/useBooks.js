import { useState, useEffect } from 'react';
import { bookService } from '../services/bookService';

export const useBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Загрузка всех книг
  const loadBooks = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await bookService.getAll();
      setBooks(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Создание книги
  const createBook = async (bookData) => {
    try {
      const response = await bookService.create(bookData);
      setBooks(prev => [...prev, response.data]);
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Удаление книги
  const deleteBook = async (id) => {
    try {
      await bookService.delete(id);
      setBooks(prev => prev.filter(book => book.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Загружаем книги при монтировании компонента
  useEffect(() => {
    loadBooks();
  }, []);

  return {
    books,
    loading,
    error,
    createBook,
    deleteBook,
    refreshBooks: loadBooks
  };
};