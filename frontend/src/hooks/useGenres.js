import { useState, useEffect } from 'react';
import { genreService } from '../services/genreService';

export const useGenres = () => {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Загрузка всех жанров
  const loadGenres = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await genreService.getAll();
      setGenres(response.data);
    } catch (err) {
      setError('Ошибка при загрузке жанров');
      console.error('Error loading genres:', err);
    } finally {
      setLoading(false);
    }
  };

  // Создание жанра
  const createGenre = async (genreData) => {
    try {
      const response = await genreService.create(genreData);
      await loadBooks();
      setGenres(prev => [...prev, response.data]);
      return response.data;
    } catch (err) {
      setError('Ошибка при создании жанра');
      throw err;
    }
  };

  // Обновление жанра
  const updateGenre = async (id, genreData) => {
    try {
      const response = await genreService.update(id, genreData);
      await loadBooks();
      setGenres(prev => prev.map(genre => 
        genre.id === id ? response.data : genre
      ));
      return response.data;
    } catch (err) {
      setError('Ошибка при обновлении жанра');
      throw err;
    }
  };

  // Удаление жанра
  const deleteGenre = async (id) => {
    try {
      await genreService.delete(id);
      await loadBooks();
      setGenres(prev => prev.filter(genre => genre.id !== id));
    } catch (err) {
      setError('Ошибка при удалении жанра');
      throw err;
    }
  };

  // Загружаем жанры при монтировании
  useEffect(() => {
    loadGenres();
  }, []);

  return {
    genres,
    loading,
    error,
    createGenre,
    updateGenre,
    deleteGenre,
    refreshGenres: loadGenres
  };
};