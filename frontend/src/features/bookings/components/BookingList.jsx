import { Button } from '../../../components/ui/Button';
const BookingRow = ({ booking, onIssue, onReturn, onDelete }) => {
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
            <td className="py-3 px-4 border">{booking.id}</td>
            <td className="py-3 px-4 border">
                <div className="font-medium">{booking.bookTitle}</div>
                <div className="text-sm text-gray-500">ID: {booking.bookId}</div>
            </td>
            <td className="py-3 px-4 border">
                <div>{booking.readerFullName}</div>
                <div className="text-sm text-gray-500">ID: {booking.readerId}</div>
            </td>
            <td className="py-3 px-4 border text-center">{booking.quantity}</td>
            <td className="py-3 px-4 border">{booking.dateIssue}</td>
            <td className="py-3 px-4 border">{booking.dateReturn}</td>
            <td className="py-3 px-4 border">{getStatusBadge()}</td>
            <td className="py-3 px-4 border">
                <div className="flex flex-col space-y-2">
                    {!booking.issued && (
                        <Button
                            variant="primary"
                            onClick={() => onIssue(booking.id, booking.bookTitle)}
                            className="w-full"
                        >
                            Выдать книгу
                        </Button>
                    )}
                    {booking.issued && !booking.returned && (
                        <Button
                            variant="secondary"
                            onClick={() => onReturn(booking.id, booking.bookTitle)}
                            className="w-full"
                        >
                            Вернуть книгу
                        </Button>
                    )}
                    {(booking.returned || !booking.issued) && (
                        <Button
                            variant="danger"
                            onClick={() => onDelete(booking.id, booking.bookTitle)}
                            className="w-full"
                        >
                            Удалить бронь
                        </Button>
                    )}
                </div>
            </td>
        </tr>
    );
};

export const BookingList = ({ 
    bookings, 
    loading, 
    error, 
    onIssue, 
    onReturn, 
    onDelete 
}) => {
    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="text-lg text-gray-600">Загрузка бронирований...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                <div className="font-bold">Ошибка</div>
                <div>{error}</div>
                <button 
                    onClick={() => window.location.reload()}
                    className="mt-2 text-sm text-red-600 hover:text-red-800"
                >
                    Попробовать снова
                </button>
            </div>
        );
    }

    if (bookings.length === 0) {
        return (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded">
                Нет активных бронирований
            </div>
        );
    }

    return (
        <div className="overflow-x-auto shadow-md rounded-lg">
            <table className="min-w-full bg-white border border-gray-200">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="py-3 px-4 border-b text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                            ID
                        </th>
                        <th className="py-3 px-4 border-b text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                            Книга
                        </th>
                        <th className="py-3 px-4 border-b text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                            Читатель
                        </th>
                        <th className="py-3 px-4 border-b text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                            Кол-во
                        </th>
                        <th className="py-3 px-4 border-b text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                            Выдача
                        </th>
                        <th className="py-3 px-4 border-b text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                            Возврат
                        </th>
                        <th className="py-3 px-4 border-b text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                            Статус
                        </th>
                        <th className="py-3 px-4 border-b text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                            Действия
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {bookings.map((booking) => (
                        <BookingRow
                            key={booking.id}
                            booking={booking}
                            onIssue={onIssue}
                            onReturn={onReturn}
                            onDelete={onDelete}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
};