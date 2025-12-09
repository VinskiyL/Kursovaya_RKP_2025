import { useState } from 'react';
import { Button } from '../../../components/ui/Button';

export const GenreRow = ({ 
  genre, 
  onUpdate, 
  onDelete,
  isLoading 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(genre.name || '');

  // 🎯 Обработчик сохранения
  const handleSave = async () => {
    if (!editName.trim()) {
      alert('Название жанра не может быть пустым');
      return;
    }

    try {
      await onUpdate(genre.id, { name: editName });
      setIsEditing(false);
    } catch (err) {
      alert(err.response?.data?.message || 'Ошибка обновления жанра');
    }
  };

  // 🎯 Обработчик отмены
  const handleCancel = () => {
    setEditName(genre.name || '');
    setIsEditing(false);
  };

  // 🎯 Обработчик удаления
  const handleDelete = () => {
    if (window.confirm(`Удалить жанр "${genre.name}"?`)) {
      onDelete(genre.id);
    }
  };

  return (
    <div className="px-6 py-4 flex justify-between items-center border-b border-gray-100 hover:bg-gray-50">
      {isEditing ? (
        // 🎯 РЕЖИМ РЕДАКТИРОВАНИЯ
        <div className="flex-1 flex items-center gap-3">
          <input
            type="text"
            placeholder="Название жанра *"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
            required
          />
          
          <div className="flex gap-2">
            <Button
              variant="primary"
              onClick={handleSave}
              disabled={isLoading || !editName.trim()}
              className="px-3 py-1"
            >
              {isLoading ? 'Сохранение...' : '✓ Сохранить'}
            </Button>
            <Button
              variant="secondary"
              onClick={handleCancel}
              disabled={isLoading}
              className="px-3 py-1"
            >
              ✕ Отмена
            </Button>
          </div>
        </div>
      ) : (
        // 🎯 РЕЖИМ ПРОСМОТРА
        <div className="flex-1 flex justify-between items-center">
          <div>
            <div className="font-medium text-gray-900">
              {genre.name}
            </div>
            <div className="text-sm text-gray-500">
              ID: {genre.id}
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={() => setIsEditing(true)}
              disabled={isLoading}
              className="px-3 py-1"
            >
              ✎ Редактировать
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              disabled={isLoading}
              className="px-3 py-1"
            >
              Удалить
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};