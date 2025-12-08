import { useState, useEffect } from 'react';
import { AuthorList } from '../features/authors/components/AuthorList';
import { AuthorForm } from '../features/authors/components/AuthorForm';
import { useAuthors } from '../hooks/useAuthors';

export const AuthorsPage = () => {
  const { authors, loading, error, createAuthor, updateAuthor, deleteAuthor } = useAuthors();
  const [editingAuthor, setEditingAuthor] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  
  // 🆕 ПОИСК И ПАГИНАЦИЯ
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const authorsPerPage = 10;
  
  // 🆕 ФИЛЬТРАЦИЯ АВТОРОВ ПО ПОИСКУ
  const filteredAuthors = authors.filter(author => {
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

  // 🆕 ВЫЧИСЛЯЕМ ДАННЫЕ ДЛЯ ПАГИНАЦИИ
  const totalAuthors = filteredAuthors.length;
  const totalPages = Math.ceil(totalAuthors / authorsPerPage);
  
  // 🆕 СБРАСЫВАЕМ НА ПЕРВУЮ СТРАНИЦУ ПРИ ПОИСКЕ
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);
  
  // 🆕 ПОЛУЧАЕМ АВТОРОВ ДЛЯ ТЕКУЩЕЙ СТРАНИЦЫ
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
    setEditingAuthor(null);
    setShowCreateForm(true);
  };

  const handleEdit = (author) => {
    setEditingAuthor(author);
    setShowCreateForm(true);
  };

  const handleDelete = async (authorId) => {
    if (window.confirm('Вы уверены что хотите удалить автора?')) {
      try {
        await deleteAuthor(authorId);
        // 🆕 ЕСЛИ УДАЛИЛИ ВСЕХ АВТОРОВ НА СТРАНИЦЕ - ПЕРЕЙТИ НА ПРЕДЫДУЩУЮ
        if (getCurrentPageAuthors().length === 0 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      } catch (err) {
        alert('Ошибка при удалении автора');
      }
    }
  };

  const handleFormSubmit = async (authorData) => {
    try {
      setFormLoading(true);
      
      if (editingAuthor) {
        await updateAuthor(editingAuthor.id, {
          id: editingAuthor.id,
          ...authorData
        });
      } else {
        await createAuthor(authorData);
      }
      
      setShowCreateForm(false);
      setEditingAuthor(null);
    } catch (err) {
      alert('Ошибка при сохранении автора');
    } finally {
      setFormLoading(false);
    }
  };

  const handleFormCancel = () => {
    setShowCreateForm(false);
    setEditingAuthor(null);
  };

  return (
    <>
      {/* 🆕 ПОЛЕ ПОИСКА */}
      <div className="container mx-auto px-4 py-6">
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
        
        {/* 🆕 ИНФОРМАЦИЯ О РЕЗУЛЬТАТАХ */}
        <div className="mb-4 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            {searchQuery ? (
              <>Найдено авторов: <span className="font-semibold">{totalAuthors}</span></>
            ) : (
              <>Всего авторов: <span className="font-semibold">{authors.length}</span></>
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
        <AuthorList
          authors={getCurrentPageAuthors()}
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
              {editingAuthor ? 'Редактировать автора' : 'Создать автора'}
            </h3>
            
            <AuthorForm
              author={editingAuthor}
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