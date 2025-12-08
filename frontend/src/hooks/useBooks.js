import { useState, useEffect } from 'react';
import { bookService } from '../services/bookService';
import { authorService } from '../services/authorService'; // 🆕 ДОБАВЛЯЕМ
import { genreService } from '../services/genreService';   // 🆕 ДОБАВЛЯЕМ

export const useBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Загрузка всех книг
  const loadBooks = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await bookService.getAllWithDetails();
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
      await loadBooks(); // Перезагружаем список
      return response.data;
    } catch (err) {
      setError('Ошибка при создании книги');
      throw err;
    }
  };

  // Обновление книги
  const updateBook = async (id, bookData) => {
    try {
      const response = await bookService.update(id, bookData);
      await loadBooks(); // 🆕 ВАЖНО: перезагружаем со связями
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
      await loadBooks(); // Перезагружаем список
    } catch (err) {
      setError('Ошибка при удалении книги');
      throw err;
    }
  };

  // 🆕 ДОБАВИТЬ АВТОРА К КНИГЕ (УПРОЩЁННАЯ ВЕРСИЯ)
  const addAuthorToBook = async (bookId, authorId) => {
    try {
      // 1. Отправляем запрос на бэк
      await bookService.addAuthorToBook(bookId, authorId);
      
      // 2. 🆕 ПРОСТО ПЕРЕЗАГРУЖАЕМ КНИГИ (самый надёжный способ)
      await loadBooks();
      
      return true;
    } catch (err) {
      console.error('Ошибка при добавлении автора:', err);
      throw err;
    }
  };

  // 🆕 УДАЛИТЬ АВТОРА ИЗ КНИГИ
  const removeAuthorFromBook = async (bookId, authorId) => {
    try {
      await bookService.removeAuthorFromBook(bookId, authorId);
      
      // 🆕 ПЕРЕЗАГРУЖАЕМ КНИГИ
      await loadBooks();
    } catch (err) {
      console.error('Ошибка при удалении автора:', err);
      throw err;
    }
  };

  // 🆕 ДОБАВИТЬ ЖАНР К КНИГЕ
  const addGenreToBook = async (bookId, genreId) => {
    try {
      await bookService.addGenreToBook(bookId, genreId);
      
      // 🆕 ПЕРЕЗАГРУЖАЕМ КНИГИ
      await loadBooks();
    } catch (err) {
      console.error('Ошибка при добавлении жанра:', err);
      throw err;
    }
  };

  // 🆕 УДАЛИТЬ ЖАНР ИЗ КНИГИ
  const removeGenreFromBook = async (bookId, genreId) => {
    try {
      await bookService.removeGenreFromBook(bookId, genreId);
      
      // 🆕 ПЕРЕЗАГРУЖАЕМ КНИГИ
      await loadBooks();
    } catch (err) {
      console.error('Ошибка при удалении жанра:', err);
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
    updateBook,
    deleteBook,
    addAuthorToBook,
    removeAuthorFromBook,
    addGenreToBook,
    removeGenreFromBook,
    refreshBooks: loadBooks
  };
};