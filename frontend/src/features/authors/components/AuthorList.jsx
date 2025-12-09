import { AuthorRow } from './AuthorRow';
import { Button } from '../../../components/ui/Button';

export const AuthorList = ({ 
  authors, 
  loading, 
  error, 
  onCreate, 
  onUpdate, 
  onDelete,
  isLoading 
}) => {
  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="text-lg">Загрузка авторов...</div>
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
        <h2 className="text-xl font-semibold">Авторы</h2>
        <Button 
          onClick={onCreate}
          disabled={isLoading}
        >
          + Добавить автора
        </Button>
      </div>

      {/* Список авторов */}
      {authors.length === 0 ? (
        <div className="px-6 py-8 text-center text-gray-500">
          Нет добавленных авторов
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {authors.map((author) => (
            <AuthorRow
              key={author.id}
              author={author}
              onUpdate={onUpdate}
              onDelete={onDelete}
              isLoading={isLoading}
            />
          ))}
        </div>
      )}
    </div>
  );
};