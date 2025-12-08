import { useState } from 'react';
import { BookingList } from '../features/bookings/components/BookingList';
import { useBookings } from '../hooks/useBookings';

export const BookingsPage = () => {
    const { 
        bookings, 
        loading, 
        error, 
        loadBookings, 
        issueBooking, 
        returnBooking, 
        deleteBooking 
    } = useBookings();
    
    const [notification, setNotification] = useState(null);

    /**
     * Показать уведомление
     */
    const showNotification = (message, type = 'info') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    /**
     * Обработка выдачи книги
     */
    const handleIssue = async (id, bookTitle) => {
        if (!window.confirm(`Вы уверены, что хотите выдать книгу "${bookTitle}"?`)) {
            return;
        }

        const result = await issueBooking(id);
        if (result.success) {
            showNotification(`Книга "${bookTitle}" успешно выдана`, 'success');
        } else {
            showNotification(result.error, 'error');
        }
    };

    /**
     * Обработка возврата книги
     */
    const handleReturn = async (id, bookTitle) => {
        if (!window.confirm(`Вы уверены, что хотите вернуть книгу "${bookTitle}"?`)) {
            return;
        }

        const result = await returnBooking(id);
        if (result.success) {
            showNotification(`Книга "${bookTitle}" успешно возвращена`, 'success');
        } else {
            showNotification(result.error, 'error');
        }
    };

    /**
     * Обработка удаления брони
     */
    const handleDelete = async (id, bookTitle) => {
        if (!window.confirm(`Вы уверены, что хотите удалить бронь на книгу "${bookTitle}"?`)) {
            return;
        }

        const result = await deleteBooking(id);
        if (result.success) {
            showNotification(`Бронь на книгу "${bookTitle}" успешно удалена`, 'success');
        } else {
            showNotification(result.error, 'error');
        }
    };

    /**
     * Обновить список бронирований
     */
    const handleRefresh = async () => {
        await loadBookings();
        showNotification('Список обновлён', 'info');
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-800">Управление бронированиями</h1>
                    <button
                        onClick={handleRefresh}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                        disabled={loading}
                    >
                        Обновить список
                    </button>
                </div>
                <p className="text-gray-600 mt-2">
                    Просмотр, выдача и возврат книг читателям
                </p>
            </div>

            {notification && (
                <div className={`mb-6 p-4 rounded border ${
                    notification.type === 'success' 
                        ? 'bg-green-50 border-green-200 text-green-700' 
                        : notification.type === 'error'
                        ? 'bg-red-50 border-red-200 text-red-700'
                        : 'bg-blue-50 border-blue-200 text-blue-700'
                }`}>
                    {notification.message}
                </div>
            )}

            <BookingList
                bookings={bookings}
                loading={loading}
                error={error}
                onIssue={handleIssue}
                onReturn={handleReturn}
                onDelete={handleDelete}
            />

            {!loading && bookings.length > 0 && (
                <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                    <div className="grid grid-cols-3 gap-4">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-gray-800">
                                {bookings.filter(b => !b.issued).length}
                            </div>
                            <div className="text-gray-600">Не выданы</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">
                                {bookings.filter(b => b.issued && !b.returned).length}
                            </div>
                            <div className="text-gray-600">Выданы</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">
                                {bookings.filter(b => b.issued && b.returned).length}
                            </div>
                            <div className="text-gray-600">Возвращены</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};