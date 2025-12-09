import { useState, useEffect } from 'react';
import { AuthorList } from '../features/authors/components/AuthorList';
import { useAuthors } from '../hooks/useAuthors';

export const AuthorsPage = () => {
  const { 
    authors: allAuthors, 
    loading, 
    error, 
    createAuthor, 
    updateAuthor, 
    deleteAuthor 
  } = useAuthors();
  
  // 🎯 Состояние для создания нового автора
  const [creatingAuthor, setCreatingAuthor] = useState(false);
  const [newAuthorData, setNewAuthorData] = useState({
    authorSurname: '',
    authorName: '',
    authorPatronymic: ''
  });

  // 🎯 ПОИСК И ПАГИНАЦИЯ
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const authorsPerPage = 10;
  
  // 🎯 ФИЛЬТРАЦИЯ АВТОРОВ ПО ПОИСКУ
  const filteredAuthors = allAuthors.filter(author => {
    if (!searchQuery.trim()) return true;
    
    const query = searchQuery.toLowerCase().trim();
    
    // Ищем по фамилии, имени, отчеству
    const matchesSurname = author.authorSurname?.toLowerCase().includes(query) || false;
    const matchesName = author.authorName?.toLowerCase().includes(query) || false;
    const matchesPatronymic = author.authorPatronymic?.toLowerCase().includes(query) || false;
    
    // Ищем по полному ФИО
    const fullName = `${author.authorSurname || ''} ${author.authorName || ''} ${author.authorPatronymic || ''}`.toLowerCase();
    const matchesFullName = fullName.includes(query);
    
    return matchesSurname || matchesName || matchesPatronymic || matchesFullName;
  });

  // 🎯 ВЫЧИСЛЯЕМ ДАННЫЕ ДЛЯ ПАГИНАЦИИ
  const totalAuthors = filteredAuthors.length;
  const totalPages = Math.ceil(totalAuthors / authorsPerPage);
  
  // 🎯 СБРАСЫВАЕМ НА ПЕРВУЮ СТРАНИЦУ ПРИ ПОИСКЕ
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);
  
  // 🎯 ПОЛУЧАЕМ АВТОРОВ ДЛЯ ТЕКУЩЕЙ СТРАНИЦЫ
  const getCurrentPageAuthors = () => {
    if (searchQuery) {
      // ЕСЛИ ЕСТЬ ПОИСК - ПОКАЗЫВАЕМ ВСЁ
      return filteredAuthors;
    }
    
    // ЕСЛИ НЕТ ПОИСКА - ПАГИНИРУЕМ
    const startIndex = (currentPage - 1) * authorsPerPage;
    const endIndex = startIndex + authorsPerPage;
    return filteredAuthors.slice(startIndex, endIndex);
  };

  // 🎯 ФУНКЦИИ ДЛЯ ПАГИНАЦИИ
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

  // 🎯 ГЕНЕРИРУЕМ НОМЕРА СТРАНИЦ ДЛЯ ОТОБРАЖЕНИЯ
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Показываем все страницы
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Показываем с "..." посредине
      if (currentPage <= 3) {
        // Начало: 1, 2, 3, ..., last
        pages.push(1, 2, 3, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Конец: 1, ..., last-2, last-1, last
        pages.push(1, '...', totalPages - 2, totalPages - 1, totalPages);
      } else {
        // Середина: 1, ..., current-1, current, current+1, ..., last
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    
    return pages;
  };

  // 🎯 Обработчик создания нового автора
  const handleCreate = () => {
    setCreatingAuthor(true);
    setNewAuthorData({
      authorSurname: '',
      authorName: '',
      authorPatronymic: ''
    });
  };

  // 🎯 Обработчик сохранения нового автора
  const handleCreateSave = async () => {
    if (!newAuthorData.authorSurname.trim()) {
      alert('Фамилия обязательна для заполнения');
      return;
    }

    try {
      await createAuthor(newAuthorData);
      setCreatingAuthor(false);
    } catch (err) {
      alert(err.response?.data?.message || 'Ошибка создания автора');
    }
  };

  // 🎯 Обработчик отмены создания
  const handleCreateCancel = () => {
    setCreatingAuthor(false);
  };

  // 🎯 Обработчик обновления автора
  const handleUpdate = async (id, updateData) => {
    try {
      await updateAuthor(id, updateData);
    } catch (err) {
      alert(err.response?.data?.message || 'Ошибка обновления автора');
    }
  };

  // 🎯 Обработчик удаления автора
  const handleDelete = async (id) => {
    try {
      await deleteAuthor(id);
    } catch (err) {
      alert(err.response?.data?.message || 'Ошибка удаления автора');
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* 🎯 ЗАГОЛОВОК */}
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Авторы</h1>
      
      {/* 🎯 ПОЛЕ ПОИСКА */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Поиск авторов по ФИО..."
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
          Ищет по фамилии, имени, отчеству или полному ФИО
        </p>
      </div>
      
      {/* 🎯 СОЗДАНИЕ НОВОГО АВТОРА (inline) */}
      {creatingAuthor && (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-2">
              <input
                type="text"
                placeholder="Фамилия *"
                value={newAuthorData.authorSurname}
                onChange={(e) => setNewAuthorData({...newAuthorData, authorSurname: e.target.value})}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="text"
                placeholder="Имя"
                value={newAuthorData.authorName}
                onChange={(e) => setNewAuthorData({...newAuthorData, authorName: e.target.value})}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Отчество"
                value={newAuthorData.authorPatronymic}
                onChange={(e) => setNewAuthorData({...newAuthorData, authorPatronymic: e.target.value})}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={handleCreateSave}
                disabled={!newAuthorData.authorSurname.trim()}
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
            <>Найдено авторов: <span className="font-semibold">{totalAuthors}</span></>
          ) : (
            <>Всего авторов: <span className="font-semibold">{allAuthors.length}</span></>
          )}
        </div>
        
        {/* 🎯 ПАГИНАЦИЯ - ПОКАЗЫВАЕМ ТОЛЬКО ЕСЛИ НЕТ ПОИСКА */}
        {!searchQuery && totalPages > 1 && (
          <div className="text-sm text-gray-600">
            Страница <span className="font-semibold">{currentPage}</span> из <span className="font-semibold">{totalPages}</span>
          </div>
        )}
      </div>
      
      {/* 🎯 СПИСОК АВТОРОВ */}
      <AuthorList
        authors={getCurrentPageAuthors()}
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
  );
};