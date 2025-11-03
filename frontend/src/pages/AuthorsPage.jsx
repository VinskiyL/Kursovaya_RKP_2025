import { useState } from 'react';
import { AuthorList } from '../features/authors/components/AuthorList';
import { AuthorForm } from '../features/authors/components/AuthorForm';
import { useAuthors } from '../hooks/useAuthors';

export const AuthorsPage = () => {
  const { authors, loading, error, createAuthor, updateAuthor, deleteAuthor } = useAuthors();
  const [editingAuthor, setEditingAuthor] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

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
      {/* Основной контент */}
      <div className="container mx-auto px-4 py-8">
        <AuthorList
          authors={authors}
          loading={loading}
          error={error}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onCreate={handleCreate}
        />
      </div>

      {/* Модальное окно */}
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