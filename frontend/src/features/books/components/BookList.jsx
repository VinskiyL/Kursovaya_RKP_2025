import { Button } from '../../../components/ui/Button';

// 🆕 ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ДЛЯ ФОРМАТИРОВАНИЯ
const formatAuthors = (authors) => {
  if (!authors || authors.length === 0) return 'Нет авторов';
  
  // Форматируем ФИО: "Толстой Л.Н."
  const formatted = authors.map(author => {
    const parts = [];
    if (author.authorSurname) parts.push(author.authorSurname);
    if (author.authorName) parts.push(`${author.authorName.charAt(0)}.`);
    if (author.authorPatronymic) parts.push(`${author.authorPatronymic.charAt(0)}.`);
    return parts.join(' ');
  });
  
  // Показываем только первых 3 авторов, остальные "..."
  if (formatted.length > 3) {
    return formatted.slice(0, 3).join(', ') + '...';
  }
  
  return formatted.join(', ');
};

const formatGenres = (genres) => {
  if (!genres || genres.length === 0) return 'Нет жанров';
  
  // Просто список жанров через запятую
  const genreNames = genres.map(genre => genre.name);
  
  // Показываем только первых 3 жанра
  if (genreNames.length > 3) {
    return genreNames.slice(0, 3).join(', ') + '...';
  }
  
  return genreNames.join(', ');
};

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
                    {/* ОБЛОЖКА */}
                    {book.cover && (
                      <div className="flex-shrink-0">
                        <img 
                          src={`http://localhost:8080/${book.cover}`} 
                          alt={book.title}
                          className="w-16 h-24 object-cover rounded border"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      {/* 🆕 ЗАГОЛОВОК */}
                      <h3 className="font-semibold text-lg text-gray-900">
                        {book.title}
                      </h3>
                      
                      {/* 🆕 АВТОРЫ */}
                      <div className="mt-1 text-sm text-gray-600">
                        <span className="font-medium">Авторы:</span> {formatAuthors(book.authors)}
                      </div>
                      
                      {/* 🆕 ЖАНРЫ */}
                      <div className="mt-1 text-sm text-gray-600">
                        <span className="font-medium">Жанры:</span> {formatGenres(book.genres)}
                      </div>
                      
                      {/* 🆕 ОСТАЛЬНАЯ ИНФОРМАЦИЯ */}
                      <div className="mt-3 grid grid-cols-2 gap-x-8 gap-y-1 text-sm text-gray-600">
                        <div><span className="font-medium">Индекс:</span> {book.index}</div>
                        <div><span className="font-medium">Авторский знак:</span> {book.authorsMark}</div>
                        <div><span className="font-medium">Место издания:</span> {book.placePublication}</div>
                        <div><span className="font-medium">Год:</span> {book.datePublication}</div>
                        <div><span className="font-medium">Объем:</span> {book.volume} стр.</div>
                        <div><span className="font-medium">В наличии:</span> {book.quantityRemaining}/{book.quantityTotal}</div>
                      </div>
                      
                      {/* 🆕 ИНФОРМАЦИЯ ОБ ИЗДАНИИ */}
                      {book.informationPublication && (
                        <div className="mt-1 text-sm text-gray-500">
                          <span className="font-medium">Издательство:</span> {book.informationPublication}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* КНОПКИ ДЕЙСТВИЙ */}
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