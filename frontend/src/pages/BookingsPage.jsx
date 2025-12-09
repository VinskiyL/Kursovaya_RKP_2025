import { BookingList } from '../features/bookings/components/BookingList';
import { useBookings } from '../hooks/useBookings';

export const BookingsPage = () => {
  const { 
    bookings, 
    loading, 
    error, 
    issueBooking, 
    returnBooking, 
    deleteBooking,
    updateBooking // ✅ Есть!
  } = useBookings();

  // 🎯 Исправленный обработчик выдачи
  const handleIssue = async (id, bookTitle, dateIssue) => {
    const today = new Date().toISOString().split('T')[0];
    const issueDate = dateIssue?.split('T')[0] || dateIssue;
    
    // Если дата в прошлом
    if (issueDate < today) {
      const userConfirmed = window.confirm(
        `⚠️ Дата выдачи ${formatDisplayDate(issueDate)} уже прошла.\n` +
        `Исправить на сегодня (${formatDisplayDate(today)}) и выдать книгу?`
      );
      
      if (!userConfirmed) return;
      
      try {
        // 🎯 1. Находим текущую бронь
        const currentBooking = bookings.find(b => b.id === id);
        if (!currentBooking) {
          alert('Бронь не найдена');
          return;
        }
        
        // 🎯 2. Обновляем дату выдачи на сегодня
        await updateBooking(id, {
          quantity: currentBooking.quantity,
          dateIssue: today, // Меняем на сегодня
          dateReturn: currentBooking.dateReturn
        });
        
        // 🎯 3. Выдаём книгу
        await issueBooking(id);
        
      } catch (err) {
        alert(err.response?.data?.message || 'Ошибка выдачи книги');
      }
    } else {
      // Обычная выдача
      if (window.confirm(`Выдать книгу "${bookTitle}"?`)) {
        try {
          await issueBooking(id);
        } catch (err) {
          alert(err.response?.data?.message || 'Ошибка выдачи книги');
        }
      }
    }
  };

  // 🎯 Обработчик возврата
  const handleReturn = async (id, bookTitle) => {
    if (window.confirm(`Вернуть книгу "${bookTitle}"?`)) {
      try {
        await returnBooking(id);
      } catch (err) {
        alert(err.response?.data?.message || 'Ошибка возврата книги');
      }
    }
  };

  // 🎯 Обработчик удаления
  const handleDelete = async (id, bookTitle) => {
    if (window.confirm(`Удалить бронь на книгу "${bookTitle}"?`)) {
      try {
        await deleteBooking(id);
      } catch (err) {
        alert(err.response?.data?.message || 'Ошибка удаления брони');
      }
    }
  };

  // 🎯 Обработчик обновления (для inline-редактирования)
  const handleUpdate = async (id, updateData) => {
    try {
      await updateBooking(id, updateData);
    } catch (err) {
      alert(err.response?.data?.message || 'Ошибка обновления брони');
    }
  };

  // Вспомогательная функция для форматирования даты
  const formatDisplayDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <BookingList
        bookings={bookings}
        loading={loading}
        error={error}
        onIssue={handleIssue}
        onReturn={handleReturn}
        onDelete={handleDelete}
        onUpdate={handleUpdate}
        isLoading={loading}
      />
    </div>
  );
};