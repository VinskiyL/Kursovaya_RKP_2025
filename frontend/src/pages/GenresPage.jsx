import { useState } from 'react';
import { GenreList } from '../features/genres/components/GenreList';
import { GenreForm } from '../features/genres/components/GenreForm';
import { useGenres } from '../hooks/useGenres';

export const GenresPage = () => {
  const { genres, loading, error, createGenre, updateGenre, deleteGenre } = useGenres();
  const [editingGenre, setEditingGenre] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

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
      {/* Основной контент */}
      <div className="container mx-auto px-4 py-8">
        <GenreList
          genres={genres}
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