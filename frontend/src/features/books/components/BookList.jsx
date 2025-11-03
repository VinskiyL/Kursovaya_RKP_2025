import { Button } from '../../../components/ui/Button';

export const BookList = ({ 
  books, 
  loading, 
  error, 
  onEdit, 
  onDelete, 
  onCreate 
}) => {
  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="text-lg">Загрузка книг...</div>
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
      {/* Заголовок и кнопка создания */}
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-xl font-semibold">Книги</h2>
        <Button onClick={onCreate}>
          + Добавить книгу
        </Button>
      </div>

      {/* Список книг */}
      {books.length === 0 ? (
        <div className="px-6 py-8 text-center text-gray-500">
          Нет добавленных книг
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {books.map((book) => (
            <div key={book.id} className="px-6 py-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-start gap-4">
                    {/* ОБЛОЖКА - ИСПРАВЛЕННЫЙ КОД */}
                    {book.cover && (
                      <div className="flex-shrink-0">
                        <img 
                          src={`http://localhost:8080/${book.cover}`} 
                          alt={book.title}
                          className="w-16 h-24 object-cover rounded border"
                          onError={(e) => {
                            // Если картинка не загрузилась, скрываем
                            e.target.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-900">
                        {book.title}
                      </h3>
                      <div className="mt-2 grid grid-cols-2 gap-x-8 gap-y-1 text-sm text-gray-600">
                        <div><span className="font-medium">Индекс:</span> {book.index}</div>
                        <div><span className="font-medium">Авторский знак:</span> {book.authorsMark}</div>
                        <div><span className="font-medium">Место издания:</span> {book.placePublication}</div>
                        <div><span className="font-medium">Год:</span> {book.datePublication}</div>
                        <div><span className="font-medium">Объем:</span> {book.volume} стр.</div>
                        <div><span className="font-medium">В наличии:</span> {book.quantityRemaining}/{book.quantityTotal}</div>
                      </div>
                      {book.informationPublication && (
                        <div className="mt-1 text-sm text-gray-500">
                          <span className="font-medium">Издательство:</span> {book.informationPublication}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2 ml-4">
                  <Button 
                    variant="secondary" 
                    onClick={() => onEdit(book)}
                  >
                    Редактировать
                  </Button>
                  <Button 
                    variant="danger" 
                    onClick={() => onDelete(book.id)}
                  >
                    Удалить
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};