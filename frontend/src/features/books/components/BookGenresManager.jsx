import { useState, useEffect, useRef } from 'react';
import { Button } from '../../../components/ui/Button';
import { genreService } from '../../../services/genreService';

export const BookGenresManager = ({ 
  bookId, 
  currentGenres = [], 
  onAddGenre, 
  onRemoveGenre,
  disabled = false 
}) => {
  const [allGenres, setAllGenres] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const loadGenres = async () => {
      try {
        setLoading(true);
        const response = await genreService.getAll();
        setAllGenres(response.data);
      } catch (err) {
        console.error('Ошибка при загрузке жанров:', err);
      } finally {
        setLoading(false);
      }
    };
    
    loadGenres();
  }, []);

  // Закрываем дропдаун при клике вне компонента
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Фильтруем жанры
  const availableGenres = allGenres.filter(genre => {
    const isAlreadyAdded = currentGenres.some(g => g.id === genre.id);
    const matchesSearch = searchQuery === '' || 
      genre.name.toLowerCase().includes(searchQuery.toLowerCase());
    return !isAlreadyAdded && matchesSearch;
  });

  const handleAddGenre = async () => {
    if (!selectedGenre) return;
    
    try {
      await onAddGenre(bookId, selectedGenre.id);
      setSelectedGenre(null);
      setSearchQuery('');
      setShowDropdown(false);
    } catch (err) {
      alert('Ошибка при добавлении жанра');
    }
  };

  const handleRemoveGenre = async (genreId) => {
    if (window.confirm('Удалить жанр из книги?')) {
      try {
        await onRemoveGenre(bookId, genreId);
      } catch (err) {
        alert('Ошибка при удалении жанра');
      }
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setShowDropdown(true);
    setSelectedGenre(null);
  };

  const handleSelectFromDropdown = (genre) => {
    setSelectedGenre(genre);
    setSearchQuery(genre.name);
    setShowDropdown(false);
  };

  const handleClearSelection = () => {
    setSelectedGenre(null);
    setSearchQuery('');
  };

  return (
    <div className="space-y-4">
      <h4 className="font-medium text-gray-900">Жанры книги</h4>
      
      {/* Текущие жанры */}
      {currentGenres.length === 0 ? (
        <p className="text-sm text-gray-500 italic">Нет добавленных жанров</p>
      ) : (
        <div className="space-y-2">
          {currentGenres.map(genre => (
            <div 
              key={genre.id} 
              className="flex items-center justify-between p-2 bg-gray-50 rounded"
            >
              <div>
                <span className="font-medium">{genre.name}</span>
                <span className="text-sm text-gray-500 ml-2">ID: {genre.id}</span>
              </div>
              <Button
                type="button"
                variant="danger"
                size="sm"
                onClick={() => handleRemoveGenre(genre.id)}
                disabled={disabled}
              >
                ✕ Удалить
              </Button>
            </div>
          ))}
        </div>
      )}
      
      {/* Добавление нового жанра */}
      <div className="border-t pt-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Добавить жанр
          </label>
          
          {/* Поле поиска с выпадающим списком */}
          <div className="relative" ref={dropdownRef}>
            <div className="relative">
              <input
                type="text"
                placeholder="Начните вводить название жанра..."
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => setShowDropdown(true)}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md text-sm"
                disabled={disabled || loading}
              />
              
              {/* Кнопка очистки */}
              {searchQuery && (
                <button
                  type="button"
                  onClick={handleClearSelection}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  disabled={disabled}
                >
                  ✕
                </button>
              )}
            </div>
            
            {/* Выпадающий список результатов поиска */}
            {showDropdown && searchQuery && availableGenres.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                {availableGenres.map(genre => (
                  <div
                    key={genre.id}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                    onClick={() => handleSelectFromDropdown(genre)}
                  >
                    <div className="font-medium">{genre.name}</div>
                    <div className="text-xs text-gray-500">ID: {genre.id}</div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Сообщение если ничего не найдено */}
            {showDropdown && searchQuery && availableGenres.length === 0 && allGenres.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg p-3">
                <p className="text-sm text-gray-500 text-center">
                  Жанры не найдены. Возможно, все доступные жанры уже добавлены.
                </p>
              </div>
            )}
          </div>
          
          {/* Кнопка добавления (если жанр выбран через выпадающий список) */}
          {selectedGenre && (
            <div className="flex items-center gap-2 p-2 bg-blue-50 rounded border border-blue-200">
              <div className="flex-1">
                <div className="font-medium text-blue-800">
                  Выбран: {selectedGenre.name}
                </div>
                <div className="text-xs text-blue-600">ID: {selectedGenre.id}</div>
              </div>
              <Button
                type="button"
                onClick={handleAddGenre}
                disabled={disabled}
                className="whitespace-nowrap"
              >
                Добавить
              </Button>
            </div>
          )}
          
          {/* Старый select для совместимости */}
          <div className="mt-2">
            <select
              value={selectedGenre?.id || ''}
              onChange={(e) => {
                const genre = allGenres.find(g => g.id === parseInt(e.target.value));
                if (genre) {
                  setSelectedGenre(genre);
                  setSearchQuery(genre.name);
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              disabled={disabled || loading || availableGenres.length === 0}
            >
              <option value="">Или выберите из списка</option>
              {availableGenres.map(genre => (
                <option key={genre.id} value={genre.id}>
                  {genre.name} (ID: {genre.id})
                </option>
              ))}
            </select>
          </div>
          
          {/* Сообщение если все жанры добавлены */}
          {availableGenres.length === 0 && allGenres.length > 0 && (
            <p className="text-sm text-gray-500">
              Все доступные жанры уже добавлены к этой книге
            </p>
          )}
          
          {/* Кнопка добавления через select */}
          {selectedGenre && (
            <Button
              type="button"
              onClick={handleAddGenre}
              disabled={disabled || !selectedGenre || loading}
              className="w-full"
            >
              Добавить жанр
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};