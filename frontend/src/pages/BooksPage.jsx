import { useState } from 'react';
import { BookList } from '../features/books/components/BookList';
import { useBooks } from '../hooks/useBooks';

export const BooksPage = () => {
  const { books, loading, error, createBook, deleteBook } = useBooks();
  const [editingBook, setEditingBook] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

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
      } catch (err) {
        alert('Ошибка при удалении книги');
      }
    }
  };

  const handleFormSubmit = async (bookData) => {
    try {
      if (editingBook) {
        // TODO: Реализовать обновление
        console.log('Обновляем книгу:', editingBook.id, bookData);
      } else {
        await createBook(bookData);
        setShowCreateForm(false);
      }
    } catch (err) {
      alert('Ошибка при сохранении книги');
    }
  };

  const handleFormCancel = () => {
    setShowCreateForm(false);
    setEditingBook(null);
  };

  return (
    <>
      {/* Основной контент ВНУТРИ контейнера */}
      <div className="container mx-auto px-4 py-8">
        <BookList
          books={books}
          loading={loading}
          error={error}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onCreate={handleCreate}
        />
      </div>

      {/* Модальное окно ВНЕ контейнера - на уровне всей страницы */}
      {showCreateForm && (
        <div 
          className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center"
          style={{ zIndex: 1000 }}
        >
          <div 
            className="bg-white p-6 rounded-lg w-96"
            style={{ zIndex: 1001 }}
          >
            <h3 className="text-xl font-bold mb-4">
              {editingBook ? 'Редактировать книгу' : 'Создать книгу'}
            </h3>
            <p className="mb-4">Форма будет здесь (следующий урок)</p>
            <div className="flex gap-2 justify-end">
              <button 
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                onClick={handleFormCancel}
              >
                Отмена
              </button>
              <button 
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={() => handleFormSubmit({})}
              >
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};