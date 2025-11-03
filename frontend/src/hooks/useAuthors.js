import { useState, useEffect } from 'react';
import { authorService } from '../services/authorService';

export const useAuthors = () => {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Загрузка всех авторов
  const loadAuthors = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await authorService.getAll();
      setAuthors(response.data);
    } catch (err) {
      setError('Ошибка при загрузке авторов');
      console.error('Error loading authors:', err);
    } finally {
      setLoading(false);
    }
  };

  // Создание автора
  const createAuthor = async (authorData) => {
    try {
      const response = await authorService.create(authorData);
      await loadBooks();
      setAuthors(prev => [...prev, response.data]);
      return response.data;
    } catch (err) {
      setError('Ошибка при создании автора');
      throw err;
    }
  };

  // Обновление автора
  const updateAuthor = async (id, authorData) => {
    try {
      const response = await authorService.update(id, authorData);
      await loadBooks();
      setAuthors(prev => prev.map(author => 
        author.id === id ? response.data : author
      ));
      return response.data;
    } catch (err) {
      setError('Ошибка при обновлении автора');
      throw err;
    }
  };

  // Удаление автора
  const deleteAuthor = async (id) => {
    try {
      await authorService.delete(id);
      await loadBooks();
      setAuthors(prev => prev.filter(author => author.id !== id));
    } catch (err) {
      setError('Ошибка при удалении автора');
      throw err;
    }
  };

  // Загружаем авторов при монтировании
  useEffect(() => {
    loadAuthors();
  }, []);

  return {
    authors,
    loading,
    error,
    createAuthor,
    updateAuthor,
    deleteAuthor,
    refreshAuthors: loadAuthors
  };
};