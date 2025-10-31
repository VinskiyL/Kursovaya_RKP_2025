import { BookCard } from './BookCard';
import { Button } from '../../../components/ui/Button';

export const BookList = ({ 
  books, 
  loading, 
  error, 
  onEdit, 
  onDelete, 
  onCreate 
}) => {
  if (loading) return <div className="text-center py-8">Загрузка...</div>;
  if (error) return <div className="text-red-500 text-center py-8">Ошибка: {error}</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Список книг</h2>
        <Button onClick={onCreate}>
          Добавить книгу
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {books.map(book => (
          <BookCard
            key={book.id}
            book={book}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>

      {books.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Книги не найдены
        </div>
      )}
    </div>
  );
};