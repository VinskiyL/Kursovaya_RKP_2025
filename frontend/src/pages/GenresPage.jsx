import { useState, useEffect } from 'react';
import { GenreList } from '../features/genres/components/GenreList';
import { useGenres } from '../hooks/useGenres';

export const GenresPage = () => {
  const { 
    genres: allGenres, 
    loading, 
    error, 
    createGenre, 
    updateGenre, 
    deleteGenre 
  } = useGenres();
  
  // 🎯 Состояние для создания нового жанра
  const [creatingGenre, setCreatingGenre] = useState(false);
  const [newGenreName, setNewGenreName] = useState('');

  // 🎯 ПОИСК И ПАГИНАЦИЯ
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const genresPerPage = 10;
  
  // 🎯 ФИЛЬТРАЦИЯ ЖАНРОВ ПО ПОИСКУ
  const filteredGenres = allGenres.filter(genre => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase().trim();
    return genre.name?.toLowerCase().includes(query) || false;
  });

  // 🎯 ВЫЧИСЛЯЕМ ДАННЫЕ ДЛЯ ПАГИНАЦИИ
  const totalGenres = filteredGenres.length;
  const totalPages = Math.ceil(totalGenres / genresPerPage);
  
  // 🎯 СБРАСЫВАЕМ НА ПЕРВУЮ СТРАНИЦУ ПРИ ПОИСКЕ
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);
  
  // 🎯 ПОЛУЧАЕМ ЖАНРЫ ДЛЯ ТЕКУЩЕЙ СТРАНИЦЫ
  const getCurrentPageGenres = () => {
    if (searchQuery) {
      return filteredGenres;
    }
    const startIndex = (currentPage - 1) * genresPerPage;
    const endIndex = startIndex + genresPerPage;
    return filteredGenres.slice(startIndex, endIndex);
  };

  // 🎯 ФУНКЦИИ ДЛЯ ПАГИНАЦИИ (аналогично авторам)
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToPage = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 🎯 ГЕНЕРИРУЕМ НОМЕРА СТРАНИЦ
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    
    return pages;
  };

  // 🎯 Обработчик создания нового жанра
  const handleCreate = () => {
    setCreatingGenre(true);
    setNewGenreName('');
  };

  // 🎯 Обработчик сохранения нового жанра
  const handleCreateSave = async () => {
    if (!newGenreName.trim()) {
      alert('Название жанра не может быть пустым');
      return;
    }

    try {
      await createGenre({ name: newGenreName });
      setCreatingGenre(false);
    } catch (err) {
      alert(err.response?.data?.message || 'Ошибка создания жанра');
    }
  };

  // 🎯 Обработчик отмены создания
  const handleCreateCancel = () => {
    setCreatingGenre(false);
  };

  // 🎯 Обработчик обновления жанра
  const handleUpdate = async (id, updateData) => {
    try {
      await updateGenre(id, updateData);
    } catch (err) {
      alert(err.response?.data?.message || 'Ошибка обновления жанра');
    }
  };

  // 🎯 Обработчик удаления жанра
  const handleDelete = async (id) => {
    try {
      await deleteGenre(id);
    } catch (err) {
      alert(err.response?.data?.message || 'Ошибка удаления жанра');
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* 🎯 ЗАГОЛОВОК */}
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Жанры</h1>
      
      {/* 🎯 ПОЛЕ ПОИСКА */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Поиск жанров по названию..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="absolute left-3 top-2.5 text-gray-400">
            🔍
          </div>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Ищет по названию жанра
        </p>
      </div>
      
      {/* 🎯 СОЗДАНИЕ НОВОГО ЖАНРА (inline) */}
      {creatingGenre && (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Название жанра *"
              value={newGenreName}
              onChange={(e) => setNewGenreName(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            
            <div className="flex gap-2">
              <button
                onClick={handleCreateSave}
                disabled={!newGenreName.trim()}
                className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Создать
              </button>
              <button
                onClick={handleCreateCancel}
                className="px-3 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* 🎯 ИНФОРМАЦИЯ О РЕЗУЛЬТАТАХ */}
      <div className="mb-4 flex justify-between items-center">
        <div className="text-sm text-gray-600">
          {searchQuery ? (
            <>Найдено жанров: <span className="font-semibold">{totalGenres}</span></>
          ) : (
            <>Всего жанров: <span className="font-semibold">{allGenres.length}</span></>
          )}
        </div>
        
        {/* 🎯 ПАГИНАЦИЯ - ПОКАЗЫВАЕМ ТОЛЬКО ЕСЛИ НЕТ ПОИСКА */}
        {!searchQuery && totalPages > 1 && (
          <div className="text-sm text-gray-600">
            Страница <span className="font-semibold">{currentPage}</span> из <span className="font-semibold">{totalPages}</span>
          </div>
        )}
      </div>
      
      {/* 🎯 СПИСОК ЖАНРОВ */}
      <GenreList
        genres={getCurrentPageGenres()}
        loading={loading}
        error={error}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        isLoading={loading}
      />
      
      {/* 🎯 КНОПКИ ПАГИНАЦИИ - ТОЛЬКО ЕСЛИ НЕТ ПОИСКА */}
      {!searchQuery && totalPages > 1 && (
        <div className="mt-8 flex justify-center items-center space-x-2">
          <button
            onClick={goToPrevPage}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded border ${
              currentPage === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
            }`}
          >
            ← Назад
          </button>
          
          <div className="flex space-x-1">
            {getPageNumbers().map((page, index) => (
              page === '...' ? (
                <span key={`dots-${index}`} className="px-3 py-2">
                  ...
                </span>
              ) : (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={`px-3 py-1 rounded ${
                    currentPage === page
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                  }`}
                >
                  {page}
                </button>
              )
            ))}
          </div>
          
          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded border ${
              currentPage === totalPages
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
            }`}
          >
            Вперёд →
          </button>
        </div>
      )}
    </div>
  );
};