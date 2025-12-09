import { BookingRow } from './BookingRow';
import { Button } from '../../../components/ui/Button';

export const BookingList = ({ 
  bookings, 
  loading, 
  error, 
  onIssue, 
  onReturn, 
  onDelete,
  onUpdate, // 🆕 НОВЫЙ пропс для обновления
  isLoading 
}) => {
  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="text-lg">Загрузка бронирований...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="text-red-700">{error}</div>
        <Button 
          onClick={() => window.location.reload()} 
          variant="secondary" 
          className="mt-2"
        >
          Попробовать снова
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Заголовок */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold">Бронирования</h2>
        <p className="text-sm text-gray-500 mt-1">
          ✎ - редактировать (только если не выдано)
        </p>
      </div>

      {/* Список бронирований */}
      {bookings.length === 0 ? (
        <div className="px-6 py-8 text-center text-gray-500">
          Нет активных бронирований
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 border-b text-left text-xs font-medium text-gray-700 uppercase">
                  ID
                </th>
                <th className="py-3 px-4 border-b text-left text-xs font-medium text-gray-700 uppercase">
                  Книга
                </th>
                <th className="py-3 px-4 border-b text-left text-xs font-medium text-gray-700 uppercase">
                  Читатель
                </th>
                <th className="py-3 px-4 border-b text-left text-xs font-medium text-gray-700 uppercase">
                  Кол-во
                </th>
                <th className="py-3 px-4 border-b text-left text-xs font-medium text-gray-700 uppercase">
                  Выдача
                </th>
                <th className="py-3 px-4 border-b text-left text-xs font-medium text-gray-700 uppercase">
                  Возврат
                </th>
                <th className="py-3 px-4 border-b text-left text-xs font-medium text-gray-700 uppercase">
                  Статус
                </th>
                <th className="py-3 px-4 border-b text-left text-xs font-medium text-gray-700 uppercase">
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
                  onUpdate={onUpdate} // 🆕 Передаём метод обновления
                  isLoading={isLoading}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};