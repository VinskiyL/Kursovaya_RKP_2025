import { useState, useEffect } from 'react';
import { GenreList } from '../features/genres/components/GenreList';
import { GenreForm } from '../features/genres/components/GenreForm';
import { useGenres } from '../hooks/useGenres';

export const GenresPage = () => {
  const { genres, loading, error, createGenre, updateGenre, deleteGenre } = useGenres();
  const [editingGenre, setEditingGenre] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  
  // 🆕 ПОИСК И ПАГИНАЦИЯ
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const genresPerPage = 10;
  
  // 🆕 ФИЛЬТРАЦИЯ ЖАНРОВ ПО ПОИСКУ
  const filteredGenres = genres.filter(genre => {
    if (!searchQuery.trim()) return true;
    
    const query = searchQuery.toLowerCase().trim();
    
    // Ищем по названию жанра
    return genre.name?.toLowerCase().includes(query) || false;
  });

  // 🆕 ВЫЧИСЛЯЕМ ДАННЫЕ ДЛЯ ПАГИНАЦИИ
  const totalGenres = filteredGenres.length;
  const totalPages = Math.ceil(totalGenres / genresPerPage);
  
  // 🆕 СБРАСЫВАЕМ НА ПЕРВУЮ СТРАНИЦУ ПРИ ПОИСКЕ
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);
  
  // 🆕 ПОЛУЧАЕМ ЖАНРЫ ДЛЯ ТЕКУЩЕЙ СТРАНИЦЫ
  const getCurrentPageGenres = () => {
    if (searchQuery) {
      // ЕСЛИ ЕСТЬ ПОИСК - ПОКАЗЫВАЕМ ВСЁ
      return filteredGenres;
    }
    
    // ЕСЛИ НЕТ ПОИСКА - ПАГИНИРУЕМ
    const startIndex = (currentPage - 1) * genresPerPage;
    const endIndex = startIndex + genresPerPage;
    return filteredGenres.slice(startIndex, endIndex);
  };

  // 🆕 ФУНКЦИИ ДЛЯ ПАГИНАЦИИ
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

  // 🆕 ГЕНЕРИРУЕМ НОМЕРА СТРАНИЦ
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

  const handleCreate = () => {
    setEditingGenre(null);
    setShowCreateForm(true);
  };

  const handleEdit = (genre) => {
    setEditingGenre(genre);
    setShowCreateForm(true);
  };

  const handleDelete = async (genreId) => {
    if (window.confirm('Вы уверены что хотите удалить жанр?')) {
      try {
        await deleteGenre(genreId);
        // 🆕 ЕСЛИ УДАЛИЛИ ВСЕ ЖАНРЫ НА СТРАНИЦЕ - ПЕРЕЙТИ НА ПРЕДЫДУЩУЮ
        if (getCurrentPageGenres().length === 0 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      } catch (err) {
        alert('Ошибка при удалении жанра');
      }
    }
  };

  const handleFormSubmit = async (genreData) => {
    try {
      setFormLoading(true);
      
      if (editingGenre) {
        await updateGenre(editingGenre.id, {
          id: editingGenre.id,
          ...genreData
        });
      } else {
        await createGenre(genreData);
      }
      
      setShowCreateForm(false);
      setEditingGenre(null);
    } catch (err) {
      alert('Ошибка при сохранении жанра');
    } finally {
      setFormLoading(false);
    }
  };

  const handleFormCancel = () => {
    setShowCreateForm(false);
    setEditingGenre(null);
  };

  return (
    <>
      {/* 🆕 ПОЛЕ ПОИСКА */}
      <div className="container mx-auto px-4 py-6">
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
        
        {/* 🆕 ИНФОРМАЦИЯ О РЕЗУЛЬТАТАХ */}
        <div className="mb-4 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            {searchQuery ? (
              <>Найдено жанров: <span className="font-semibold">{totalGenres}</span></>
            ) : (
              <>Всего жанров: <span className="font-semibold">{genres.length}</span></>
            )}
          </div>
          
          {/* 🆕 ПАГИНАЦИЯ - ПОКАЗЫВАЕМ ТОЛЬКО ЕСЛИ НЕТ ПОИСКА */}
          {!searchQuery && totalPages > 1 && (
            <div className="text-sm text-gray-600">
              Страница <span className="font-semibold">{currentPage}</span> из <span className="font-semibold">{totalPages}</span>
            </div>
          )}
        </div>
        
        {/* ОСНОВНОЙ КОНТЕНТ */}
        <GenreList
          genres={getCurrentPageGenres()}
          loading={loading}
          error={error}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onCreate={handleCreate}
        />
        
        {/* 🆕 КНОПКИ ПАГИНАЦИИ - ТОЛЬКО ЕСЛИ НЕТ ПОИСКА */}
        {!searchQuery && totalPages > 1 && (
          <div className="mt-8 flex justify-center items-center space-x-2">
            {/* КНОПКА "НАЗАД" */}
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
            
            {/* НОМЕРА СТРАНИЦ */}
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
            
            {/* КНОПКА "ВПЕРЁД" */}
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

      {/* МОДАЛЬНОЕ ОКНО */}
      {showCreateForm && (
        <div 
          className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center"
          style={{ zIndex: 1000 }}
        >
          <div 
            className="bg-white p-6 rounded-lg w-96 max-h-[90vh] overflow-y-auto"
            style={{ zIndex: 1001 }}
          >
            <h3 className="text-xl font-bold mb-4">
              {editingGenre ? 'Редактировать жанр' : 'Создать жанр'}
            </h3>
            
            <GenreForm
              genre={editingGenre}
              onSubmit={handleFormSubmit}
              onCancel={handleFormCancel}
              loading={formLoading}
            />
          </div>
        </div>
      )}
    </>
  );
};