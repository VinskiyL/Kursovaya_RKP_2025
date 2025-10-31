import { Button } from '../../../components/ui/Button';

export const BookCard = ({ book, onEdit, onDelete }) => {
  return (
    <div className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      <h3 className="text-xl font-semibold mb-2">{book.title}</h3>
      <p className="text-gray-600 mb-1">Авторы: {book.authorsMark}</p>
      <p className="text-gray-600 mb-1">Год: {book.datePublication}</p>
      <p className="text-gray-600 mb-3">Страниц: {book.volume}</p>
      
      <div className="flex gap-2">
        <Button variant="secondary" onClick={() => onEdit(book)}>
          Редактировать
        </Button>
        <Button variant="danger" onClick={() => onDelete(book.id)}>
          Удалить
        </Button>
      </div>
    </div>
  );
};