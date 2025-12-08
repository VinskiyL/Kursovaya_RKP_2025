import { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/Button';
import { FileUpload } from '../../../components/ui/FileUpload';
import { fileService } from '../../../services/fileService';
import { authorService } from '../../../services/authorService'; // 🆕 ДОБАВЛЯЕМ
import { genreService } from '../../../services/genreService';   // 🆕 ДОБАВЛЯЕМ
import { BookAuthorsManager } from './BookAuthorsManager';
import { BookGenresManager } from './BookGenresManager';

export const BookForm = ({ 
  book = null, 
  onSubmit, 
  onCancel, 
  loading = false,
  onAddAuthorToBook,
  onRemoveAuthorFromBook,
  onAddGenreToBook,
  onRemoveGenreFromBook
}) => {
  const [formData, setFormData] = useState({
    index: '',
    authorsMark: '',
    title: '',
    placePublication: '',
    informationPublication: '',
    volume: '',
    quantityTotal: '',
    quantityRemaining: '',
    cover: '',
    datePublication: ''
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [oldCoverPath, setOldCoverPath] = useState(null);
  
  // 🆕 ЛОКАЛЬНЫЕ КОПИИ АВТОРОВ И ЖАНРОВ
  const [localAuthors, setLocalAuthors] = useState([]);
  const [localGenres, setLocalGenres] = useState([]);

  useEffect(() => {
    if (book) {
      setFormData({
        index: book.index || '',
        authorsMark: book.authorsMark || '',
        title: book.title || '',
        placePublication: book.placePublication || '',
        informationPublication: book.informationPublication || '',
        volume: book.volume || '',
        quantityTotal: book.quantityTotal || '',
        quantityRemaining: book.quantityRemaining || '',
        cover: book.cover || '',
        datePublication: book.datePublication || ''
      });

      // 🆕 ИНИЦИАЛИЗИРУЕМ ЛОКАЛЬНЫЕ СОСТОЯНИЯ РЕАЛЬНЫМИ ДАННЫМИ
      setLocalAuthors(book.authors || []);
      setLocalGenres(book.genres || []);

      if (book.cover) {
        setSelectedFile(`http://localhost:8080/${book.cover}`);
        setOldCoverPath(book.cover);
      }
    } else {
      setFormData({
        index: '',
        authorsMark: '',
        title: '',
        placePublication: '',
        informationPublication: '',
        volume: '',
        quantityTotal: '',
        quantityRemaining: '',
        cover: '',
        datePublication: ''
      });
      setLocalAuthors([]);
      setLocalGenres([]);
      setSelectedFile(null);
      setOldCoverPath(null);
    }
  }, [book]);

  // 🆕 СИНХРОНИЗАЦИЯ С РЕАЛЬНЫМИ ДАННЫМИ ПРИ ИЗМЕНЕНИИ book
  useEffect(() => {
    if (book) {
      // Обновляем localAuthors реальными данными из book.authors
      // Но сохраняем порядок из localAuthors
      const updatedAuthors = localAuthors.map(localAuthor => {
        const realAuthor = book.authors?.find(a => a.id === localAuthor.id);
        // Если есть реальные данные - используем их, иначе оставляем локальные
        return realAuthor || localAuthor;
      });
      
      // Добавляем авторов, которые есть в book.authors но нет в localAuthors
      book.authors?.forEach(realAuthor => {
        if (!updatedAuthors.some(a => a.id === realAuthor.id)) {
          updatedAuthors.push(realAuthor);
        }
      });
      
      // Убираем дубликаты
      const uniqueAuthors = Array.from(new Set(updatedAuthors.map(a => a.id)))
        .map(id => updatedAuthors.find(a => a.id === id));
      
      setLocalAuthors(uniqueAuthors);
      
      // Аналогично для жанров
      const updatedGenres = localGenres.map(localGenre => {
        const realGenre = book.genres?.find(g => g.id === localGenre.id);
        return realGenre || localGenre;
      });
      
      book.genres?.forEach(realGenre => {
        if (!updatedGenres.some(g => g.id === realGenre.id)) {
          updatedGenres.push(realGenre);
        }
      });
      
      const uniqueGenres = Array.from(new Set(updatedGenres.map(g => g.id)))
        .map(id => updatedGenres.find(g => g.id === id));
      
      setLocalGenres(uniqueGenres);
    }
  }, [book?.authors, book?.genres]); // 🆕 Следим только за authors и genres

  const deleteOldCover = async () => {
    if (oldCoverPath) {
      try {
        await fileService.deleteCover(oldCoverPath);
      } catch (err) {
        console.error('Ошибка при удалении старой обложки:', err);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name.includes('quantity') || name === 'volume' ? Number(value) : value
    }));
  };

  const handleFileSelect = async (file) => {
    if (!file) {
      if (book && oldCoverPath) {
        await deleteOldCover();
        setOldCoverPath(null);
      }
      setSelectedFile(null);
      setFormData(prev => ({ ...prev, cover: '' }));
      return;
    }

    try {
      setUploading(true);
      
      if (oldCoverPath) {
        await deleteOldCover();
      }

      const response = await fileService.uploadCover(file);
      const filePath = response.data.filePath;
      
      setSelectedFile(`http://localhost:8080/${filePath}`);
      setFormData(prev => ({ ...prev, cover: filePath }));
      setOldCoverPath(null);
    } catch (err) {
      alert('Ошибка при загрузке обложки');
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  // 🆕 УЛУЧШЕННЫЙ ОБРАБОТЧИК ДОБАВЛЕНИЯ АВТОРА
  const handleAddAuthor = async (bookId, authorId) => {
    try {
      // 1. ЗАГРУЖАЕМ ДАННЫЕ АВТОРА СРАЗУ
      const authorResponse = await authorService.getById(authorId);
      const authorData = authorResponse.data;
      
      // 2. СОЗДАЁМ ОБЪЕКТ АВТОРА С РЕАЛЬНЫМИ ДАННЫМИ
      const newAuthor = {
        id: authorData.id,
        authorSurname: authorData.authorSurname || '',
        authorName: authorData.authorName || '',
        authorPatronymic: authorData.authorPatronymic || ''
      };
      
      // 3. ДОБАВЛЯЕМ В ЛОКАЛЬНЫЙ СПИСОК (сразу с реальными данными!)
      setLocalAuthors(prev => {
        // Проверяем, не добавлен ли уже
        if (prev.some(a => a.id === newAuthor.id)) {
          return prev;
        }
        return [...prev, newAuthor];
      });
      
      // 4. ОТПРАВЛЯЕМ ЗАПРОС НА БЭК
      await onAddAuthorToBook(bookId, authorId);
      
    } catch (err) {
      console.error('Ошибка при добавлении автора:', err);
      
      // Если ошибка - удаляем из локального списка
      setLocalAuthors(prev => prev.filter(a => a.id !== authorId));
      
      alert('Ошибка при добавлении автора');
      throw err;
    }
  };

  // 🆕 УЛУЧШЕННЫЙ ОБРАБОТЧИК УДАЛЕНИЯ АВТОРА
  const handleRemoveAuthor = async (bookId, authorId) => {
    try {
      // 1. УДАЛЯЕМ ИЗ ЛОКАЛЬНОГО СПИСКА СРАЗУ
      setLocalAuthors(prev => prev.filter(author => author.id !== authorId));
      
      // 2. ОТПРАВЛЯЕМ ЗАПРОС НА БЭК
      await onRemoveAuthorFromBook(bookId, authorId);
      
    } catch (err) {
      console.error('Ошибка при удалении автора:', err);
      alert('Ошибка при удалении автора');
      throw err;
    }
  };

  // 🆕 УЛУЧШЕННЫЙ ОБРАБОТЧИК ДОБАВЛЕНИЯ ЖАНРА
  const handleAddGenre = async (bookId, genreId) => {
    try {
      // 1. ЗАГРУЖАЕМ ДАННЫЕ ЖАНРА СРАЗУ
      const genreResponse = await genreService.getById(genreId);
      const genreData = genreResponse.data;
      
      // 2. СОЗДАЁМ ОБЪЕКТ ЖАНРА С РЕАЛЬНЫМИ ДАННЫМИ
      const newGenre = {
        id: genreData.id,
        name: genreData.name || ''
      };
      
      // 3. ДОБАВЛЯЕМ В ЛОКАЛЬНЫЙ СПИСОК
      setLocalGenres(prev => {
        if (prev.some(g => g.id === newGenre.id)) {
          return prev;
        }
        return [...prev, newGenre];
      });
      
      // 4. ОТПРАВЛЯЕМ ЗАПРОС НА БЭК
      await onAddGenreToBook(bookId, genreId);
      
    } catch (err) {
      console.error('Ошибка при добавлении жанра:', err);
      
      setLocalGenres(prev => prev.filter(g => g.id !== genreId));
      
      alert('Ошибка при добавлении жанра');
      throw err;
    }
  };

  // 🆕 УЛУЧШЕННЫЙ ОБРАБОТЧИК УДАЛЕНИЯ ЖАНРА
  const handleRemoveGenre = async (bookId, genreId) => {
    try {
      // 1. УДАЛЯЕМ ИЗ ЛОКАЛЬНОГО СПИСКА СРАЗУ
      setLocalGenres(prev => prev.filter(genre => genre.id !== genreId));
      
      // 2. ОТПРАВЛЯЕМ ЗАПРОС НА БЭК
      await onRemoveGenreFromBook(bookId, genreId);
      
    } catch (err) {
      console.error('Ошибка при удалении жанра:', err);
      alert('Ошибка при удалении жанра');
      throw err;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleQuantityTotalChange = (e) => {
    const value = Number(e.target.value);
    setFormData(prev => ({
      ...prev,
      quantityTotal: value,
      quantityRemaining: prev.quantityRemaining === prev.quantityTotal ? value : prev.quantityRemaining
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-h-[80vh] overflow-y-auto">
      {/* Секция обложки */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-3">Обложка книги</h4>
        <FileUpload
          onFileSelect={handleFileSelect}
          currentFile={selectedFile}
          disabled={uploading || loading}
        />
        {uploading && (
          <p className="text-sm text-blue-600 mt-2">Загрузка обложки...</p>
        )}
      </div>

      {/* Основные поля в две колонки */}
      <div className="grid grid-cols-2 gap-4">
        {/* Левая колонка */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Индекс *
            </label>
            <input
              type="text"
              name="index"
              value={formData.index}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Авторский знак *
            </label>
            <input
              type="text"
              name="authorsMark"
              value={formData.authorsMark}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Название книги *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Место издания *
            </label>
            <input
              type="text"
              name="placePublication"
              value={formData.placePublication}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Информация об издании *
            </label>
            <input
              type="text"
              name="informationPublication"
              value={formData.informationPublication}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
          </div>
        </div>

        {/* Правая колонка */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Объем (страниц) *
            </label>
            <input
              type="number"
              name="volume"
              value={formData.volume}
              onChange={handleChange}
              required
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Общее количество *
            </label>
            <input
              type="number"
              name="quantityTotal"
              value={formData.quantityTotal}
              onChange={handleQuantityTotalChange}
              required
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Оставшееся количество *
            </label>
            <input
              type="number"
              name="quantityRemaining"
              value={formData.quantityRemaining}
              onChange={handleChange}
              required
              min="0"
              max={formData.quantityTotal}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Год издания *
            </label>
            <input
              type="text"
              name="datePublication"
              value={formData.datePublication}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
              placeholder="2024"
            />
          </div>
        </div>
      </div>

      {/* СЕКЦИЯ ДЛЯ УПРАВЛЕНИЯ СВЯЗЯМИ */}
      {book && (
        <>
          {/* Управление авторами */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <BookAuthorsManager
              bookId={book.id}
              currentAuthors={localAuthors}
              onAddAuthor={handleAddAuthor}
              onRemoveAuthor={handleRemoveAuthor}
              disabled={loading || uploading}
            />
          </div>

          {/* Управление жанрами */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <BookGenresManager
              bookId={book.id}
              currentGenres={localGenres}
              onAddGenre={handleAddGenre}
              onRemoveGenre={handleRemoveGenre}
              disabled={loading || uploading}
            />
          </div>
        </>
      )}

      {/* Кнопки */}
      <div className="flex gap-2 justify-end pt-4 border-t">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={loading || uploading}
        >
          Отмена
        </Button>
        <Button
          type="submit"
          disabled={loading || uploading}
        >
          {book ? 'Обновить книгу' : 'Создать книгу'}
        </Button>
      </div>
    </form>
  );
};