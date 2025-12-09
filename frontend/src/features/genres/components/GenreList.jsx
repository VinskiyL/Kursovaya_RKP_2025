import { GenreRow } from './GenreRow';
import { Button } from '../../../components/ui/Button';

export const GenreList = ({ 
  genres, 
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
        <div className="text-lg">Загрузка жанров...</div>
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
        <h2 className="text-xl font-semibold">Жанры</h2>
        <Button 
          onClick={onCreate}
          disabled={isLoading}
        >
          + Добавить жанр
        </Button>
      </div>

      {/* Список жанров */}
      {genres.length === 0 ? (
        <div className="px-6 py-8 text-center text-gray-500">
          Нет добавленных жанров
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {genres.map((genre) => (
            <GenreRow
              key={genre.id}
              genre={genre}
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