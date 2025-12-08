import { useState, useEffect } from 'react';
import { BookList } from '../features/books/components/BookList';
import { BookForm } from '../features/books/components/BookForm';
import { useBooks } from '../hooks/useBooks';

export const BooksPage = () => {
  // 🆕 ВОТ ТУТ ИСПРАВЛЯЕМ - деструктурируем ВСЕ методы
  const { 
    books, 
    loading, 
    error, 
    createBook, 
    updateBook, 
    deleteBook,
    // 🆕 ДОБАВЛЯЕМ ЭТИ 4 МЕТОДА - они должны быть в useBooks.js
    addAuthorToBook,
    removeAuthorFromBook,
    addGenreToBook,
    removeGenreFromBook 
  } = useBooks();
  
  const [editingBook, setEditingBook] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 10;
  
  // ФИЛЬТРАЦИЯ КНИГ ПО ЗАПРОСУ
  const filteredBooks = books.filter(book => {
    if (!searchQuery.trim()) return true;
    
    const query = searchQuery.toLowerCase().trim();
    
    const matchesTitle = book.title?.toLowerCase().includes(query) || false;
    
    const matchesAuthor = book.authors?.some(author => {
      const fullName = `${author.authorSurname || ''} ${author.authorName || ''}`.toLowerCase();
      return fullName.includes(query);
    }) || false;
    
    const matchesGenre = book.genres?.some(genre => 
      genre.name?.toLowerCase().includes(query) || false
    ) || false;
    
    return matchesTitle || matchesAuthor || matchesGenre;
  });

  // ВЫЧИСЛЯЕМ ДАННЫЕ ДЛЯ ПАГИНАЦИИ
  const totalBooks = filteredBooks.length;
  const totalPages = Math.ceil(totalBooks / booksPerPage);
  
  // СБРАСЫВАЕМ НА ПЕРВУЮ СТРАНИЦУ ПРИ ПОИСКЕ
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);
  
  // ПОЛУЧАЕМ КНИГИ ДЛЯ ТЕКУЩЕЙ СТРАНИЦЫ
  const getCurrentPageBooks = () => {
    if (searchQuery) {
      // ЕСЛИ ЕСТЬ ПОИСК - ПОКАЗЫВАЕМ ВСЁ
      return filteredBooks;
    }
    
    // ЕСЛИ НЕТ ПОИСКА - ПАГИНИРУЕМ
    const startIndex = (currentPage - 1) * booksPerPage;
    const endIndex = startIndex + booksPerPage;
    return filteredBooks.slice(startIndex, endIndex);
  };

  // ФУНКЦИИ ДЛЯ ПАГИНАЦИИ
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

  const handleCreate = () => {
    setEditingBook(null);
    setShowCreateForm(true);
  };

  const handleEdit = (book) => {
    setEditingBook(book);
    setShowCreateForm(true);
  };

  const handleDelete = async (bookId) => {
    if (window.confirm('Вы уверены что хотите удалить книгу?')) {
      try {
        await deleteBook(bookId);
        // ЕСЛИ УДАЛИЛИ ВСЕ КНИГИ НА СТРАНИЦЕ - ПЕРЕЙТИ НА ПРЕДЫДУЩУЮ
        if (getCurrentPageBooks().length === 0 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      } catch (err) {
        alert('Ошибка при удалении книги');
      }
    }
  };

  const handleFormSubmit = async (bookData) => {
    try {
      setFormLoading(true);
      
      if (editingBook) {
        await updateBook(editingBook.id, {
          id: editingBook.id,
          ...bookData
        });
      } else {
        await createBook(bookData);
      }
      
      setShowCreateForm(false);
      setEditingBook(null);
    } catch (err) {
      alert('Ошибка при сохранении книги');
    } finally {
      setFormLoading(false);
    }
  };

  const handleFormCancel = () => {
    setShowCreateForm(false);
    setEditingBook(null);
  };

  // ГЕНЕРИРУЕМ НОМЕРА СТРАНИЦ ДЛЯ ОТОБРАЖЕНИЯ
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

  // 🆕 СОЗДАЁМ ЗАГЛУШКИ ДЛЯ МЕТОДОВ, ЕСЛИ ИХ НЕТ В useBooks
  // (удали этот блок, если методы уже есть в useBooks)
  const stubAddAuthorToBook = async (bookId, authorId) => {
    console.log('Добавить автора к книге:', { bookId, authorId });
    alert('Функционал добавления автора к книге в разработке');
    return Promise.resolve();
  };

  const stubRemoveAuthorFromBook = async (bookId, authorId) => {
    console.log('Удалить автора из книги:', { bookId, authorId });
    alert('Функционал удаления автора из книги в разработке');
    return Promise.resolve();
  };

  const stubAddGenreToBook = async (bookId, genreId) => {
    console.log('Добавить жанр к книге:', { bookId, genreId });
    alert('Функционал добавления жанра к книге в разработке');
    return Promise.resolve();
  };

  const stubRemoveGenreFromBook = async (bookId, genreId) => {
    console.log('Удалить жанр из книги:', { bookId, genreId });
    alert('Функционал удаления жанра из книги в разработке');
    return Promise.resolve();
  };

  // 🆕 ВЫБИРАЕМ КАКИЕ МЕТОДЫ ИСПОЛЬЗОВАТЬ:
  // Если методы есть в useBooks - используем их, иначе заглушки
  const actualAddAuthorToBook = addAuthorToBook || stubAddAuthorToBook;
  const actualRemoveAuthorFromBook = removeAuthorFromBook || stubRemoveAuthorFromBook;
  const actualAddGenreToBook = addGenreToBook || stubAddGenreToBook;
  const actualRemoveGenreFromBook = removeGenreFromBook || stubRemoveGenreFromBook;

  return (
    <>
      {/* ПОЛЕ ПОИСКА */}
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Поиск книг, авторов, жанров..."
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
            Ищет по названию книги, фамилии/имени автора, названию жанра
          </p>
        </div>
        
        {/* ИНФОРМАЦИЯ О РЕЗУЛЬТАТАХ */}
        <div className="mb-4 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            {searchQuery ? (
              <>Найдено книг: <span className="font-semibold">{totalBooks}</span></>
            ) : (
              <>Всего книг: <span className="font-semibold">{books.length}</span></>
            )}
          </div>
          
          {/* ПАГИНАЦИЯ - ПОКАЗЫВАЕМ ТОЛЬКО ЕСЛИ НЕТ ПОИСКА */}
          {!searchQuery && totalPages > 1 && (
            <div className="text-sm text-gray-600">
              Страница <span className="font-semibold">{currentPage}</span> из <span className="font-semibold">{totalPages}</span>
            </div>
          )}
        </div>
        
        {/* ОСНОВНОЙ КОНТЕНТ */}
        <BookList
          books={getCurrentPageBooks()}
          loading={loading}
          error={error}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onCreate={handleCreate}
        />
        
        {/* КНОПКИ ПАГИНАЦИИ - ТОЛЬКО ЕСЛИ НЕТ ПОИСКА */}
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

      {/* МОДАЛЬНОЕ ОКНО РЕДАКТИРОВАНИЯ */}
      {showCreateForm && (
        <div 
          className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center"
          style={{ zIndex: 1000 }}
        >
          <div 
            className="bg-white p-6 rounded-lg w-[90vw] max-w-4xl max-h-[90vh] overflow-y-auto"
            style={{ zIndex: 1001 }}
          >
            <h3 className="text-xl font-bold mb-4">
              {editingBook ? 'Редактировать книгу' : 'Создать книгу'}
            </h3>
            
            <BookForm
              book={editingBook}
              onSubmit={handleFormSubmit}
              onCancel={handleFormCancel}
              loading={formLoading}
              // 🆕 ПЕРЕДАЁМ МЕТОДЫ (настоящие или заглушки)
              onAddAuthorToBook={actualAddAuthorToBook}
              onRemoveAuthorFromBook={actualRemoveAuthorFromBook}
              onAddGenreToBook={actualAddGenreToBook}
              onRemoveGenreFromBook={actualRemoveGenreFromBook}
            />
          </div>
        </div>
      )}
    </>
  );
};