import { useState } from 'react';
import { Button } from '../../../components/ui/Button';

export const BookingRow = ({ 
  booking, 
  onIssue, 
  onReturn, 
  onDelete,
  onUpdate, // 🆕 НОВЫЙ пропс для обновления
  isLoading 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    quantity: booking.quantity,
    dateIssue: booking.dateIssue,
    dateReturn: booking.dateReturn
  });

  // 🎯 Форматирование даты для отображения
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // 🎯 Форматирование даты для input[type="date"]
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // YYYY-MM-DD
  };

  // 🎯 Обработчик сохранения
  const handleSave = async () => {
    try {
      await onUpdate(booking.id, editData);
      setIsEditing(false);
    } catch (err) {
      alert(err.response?.data?.message || 'Ошибка обновления брони');
    }
  };

  // 🎯 Обработчик отмены
  const handleCancel = () => {
    setEditData({
      quantity: booking.quantity,
      dateIssue: booking.dateIssue,
      dateReturn: booking.dateReturn
    });
    setIsEditing(false);
  };

  // 🎯 Статус-бейдж
  const getStatusBadge = () => {
    if (!booking.issued) {
      return (
        <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
          Не выдана
        </span>
      );
    }
    if (!booking.returned) {
      return (
        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
          Выдана
        </span>
      );
    }
    return (
      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
        Возвращена
      </span>
    );
  };

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      {/* ID */}
      <td className="py-3 px-4 border">{booking.id}</td>
      
      {/* Книга */}
      <td className="py-3 px-4 border">
        <div className="font-medium">{booking.bookTitle}</div>
        <div className="text-sm text-gray-500">ID: {booking.bookId}</div>
      </td>
      
      {/* Читатель */}
      <td className="py-3 px-4 border">
        <div>{booking.readerFullName}</div>
        <div className="text-sm text-gray-500">ID: {booking.readerId}</div>
      </td>
      
      {/* 🆕 Количество с inline-редактированием */}
      <td className="py-3 px-4 border">
        {isEditing ? (
          <input
            type="number"
            min="1"
            max="5"
            value={editData.quantity}
            onChange={(e) => {
                const value = parseInt(e.target.value) || 1;
                // 🔥 Ограничиваем от 1 до 5
                const clampedValue = Math.max(1, Math.min(5, value));
                setEditData({...editData, quantity: clampedValue});
            }}
            className="w-full px-2 py-1 border border-gray-300 rounded text-center"
            disabled={isLoading}
          />
        ) : (
          <div className="flex items-center justify-between">
            <span>{booking.quantity} шт.</span>
            {!booking.issued && (
              <button
                onClick={() => setIsEditing(true)}
                className="text-blue-600 hover:text-blue-800 text-sm ml-2"
                title="Редактировать"
              >
                ✎
              </button>
            )}
          </div>
        )}
      </td>
      
      {/* 🆕 Дата выдачи с inline-редактированием */}
      <td className="py-3 px-4 border">
        {isEditing ? (
          <input
            type="date"
            value={formatDateForInput(editData.dateIssue)}
            onChange={(e) => setEditData({...editData, dateIssue: e.target.value})}
            className="w-full px-2 py-1 border border-gray-300 rounded"
            disabled={isLoading}
          />
        ) : (
          <div className="flex items-center justify-between">
            <span>{formatDate(booking.dateIssue)}</span>
            {!booking.issued && (
              <button
                onClick={() => setIsEditing(true)}
                className="text-blue-600 hover:text-blue-800 text-sm ml-2"
                title="Редактировать"
              >
                ✎
              </button>
            )}
          </div>
        )}
      </td>
      
      {/* 🆕 Дата возврата с inline-редактированием */}
      <td className="py-3 px-4 border">
        {isEditing ? (
          <input
            type="date"
            value={formatDateForInput(editData.dateReturn)}
            onChange={(e) => setEditData({...editData, dateReturn: e.target.value})}
            min={formatDateForInput(editData.dateIssue)} // 🎯 Минимум = дата выдачи
            className="w-full px-2 py-1 border border-gray-300 rounded"
            disabled={isLoading}
          />
        ) : (
          <div className="flex items-center justify-between">
            <span>{formatDate(booking.dateReturn)}</span>
            {!booking.issued && (
              <button
                onClick={() => setIsEditing(true)}
                className="text-blue-600 hover:text-blue-800 text-sm ml-2"
                title="Редактировать"
              >
                ✎
              </button>
            )}
          </div>
        )}
      </td>
      
      {/* Статус */}
      <td className="py-3 px-4 border">
        {getStatusBadge()}
      </td>
      
      {/* Действия */}
      <td className="py-3 px-4 border">
        {isEditing ? (
          // 🆕 Кнопки при редактировании
          <div className="flex flex-col gap-2">
            <Button
              variant="primary"
              onClick={handleSave}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'Сохранение...' : '✅ Сохранить'}
            </Button>
            <Button
              variant="secondary"
              onClick={handleCancel}
              disabled={isLoading}
              className="w-full"
            >
              ✕ Отмена
            </Button>
          </div>
        ) : (
          // Кнопки при просмотре
          <div className="flex flex-col gap-2">
            {!booking.issued && (
              <Button
                variant="primary"
                onClick={() => onIssue(booking.id, booking.bookTitle, booking.dateIssue)}
                disabled={isLoading}
                className="w-full"
              >
                Выдать книгу
              </Button>
            )}
            {booking.issued && !booking.returned && (
              <Button
                variant="secondary"
                onClick={() => onReturn(booking.id, booking.bookTitle)}
                disabled={isLoading}
                className="w-full"
              >
                Вернуть книгу
              </Button>
            )}
            {(booking.returned || !booking.issued) && (
              <Button
                variant="danger"
                onClick={() => onDelete(booking.id, booking.bookTitle)}
                disabled={isLoading}
                className="w-full"
              >
                Удалить бронь
              </Button>
            )}
          </div>
        )}
      </td>
    </tr>
  );
};