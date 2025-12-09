import { useState } from 'react';
import { Button } from '../../../components/ui/Button';

export const AuthorRow = ({ 
  author, 
  onUpdate, 
  onDelete,
  isLoading 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    authorSurname: author.authorSurname || '',
    authorName: author.authorName || '',
    authorPatronymic: author.authorPatronymic || ''
  });

  // 🎯 Формируем ФИО для отображения
  const getFullName = (data = editData) => {
    const parts = [data.authorSurname, data.authorName, data.authorPatronymic];
    return parts.filter(part => part && part.trim() !== '').join(' ');
  };

  // 🎯 Обработчик сохранения
  const handleSave = async () => {
    try {
      await onUpdate(author.id, editData);
      setIsEditing(false);
    } catch (err) {
      alert(err.response?.data?.message || 'Ошибка обновления автора');
    }
  };

  // 🎯 Обработчик отмены
  const handleCancel = () => {
    setEditData({
      authorSurname: author.authorSurname || '',
      authorName: author.authorName || '',
      authorPatronymic: author.authorPatronymic || ''
    });
    setIsEditing(false);
  };

  // 🎯 Обработчик удаления
  const handleDelete = () => {
    if (window.confirm(`Удалить автора "${getFullName(author)}"?`)) {
      onDelete(author.id);
    }
  };

  return (
    <div className="px-6 py-4 flex justify-between items-center border-b border-gray-100 hover:bg-gray-50">
      {isEditing ? (
        // 🎯 РЕЖИМ РЕДАКТИРОВАНИЯ
        <div className="flex-1 flex flex-col md:flex-row md:items-center gap-3">
          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-2">
            <input
              type="text"
              placeholder="Фамилия *"
              value={editData.authorSurname}
              onChange={(e) => setEditData({...editData, authorSurname: e.target.value})}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
              required
            />
            <input
              type="text"
              placeholder="Имя"
              value={editData.authorName}
              onChange={(e) => setEditData({...editData, authorName: e.target.value})}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
            <input
              type="text"
              placeholder="Отчество"
              value={editData.authorPatronymic}
              onChange={(e) => setEditData({...editData, authorPatronymic: e.target.value})}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="primary"
              onClick={handleSave}
              disabled={isLoading || !editData.authorSurname.trim()}
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
              {getFullName(author)}
            </div>
            <div className="text-sm text-gray-500">
              ID: {author.id}
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