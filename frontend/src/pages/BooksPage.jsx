import { useState } from 'react';
import { BookList } from '../features/books/components/BookList';
import { BookForm } from '../features/books/components/BookForm';
import { useBooks } from '../hooks/useBooks';

export const BooksPage = () => {
  const { books, loading, error, createBook, updateBook, deleteBook } = useBooks();
  const [editingBook, setEditingBook] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

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
      setFormLoading(true);
      
      if (editingBook) {
        // 🆕 Редактирование книги
        await updateBook(editingBook.id, {
          id: editingBook.id,
          ...bookData
        });
      } else {
        // Создание книги
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
            />
          </div>
        </div>
      )}
    </>
  );
};