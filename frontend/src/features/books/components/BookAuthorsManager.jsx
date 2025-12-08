import { useState, useEffect, useRef } from 'react';
import { Button } from '../../../components/ui/Button';
import { authorService } from '../../../services/authorService';

export const BookAuthorsManager = ({ 
  bookId, 
  currentAuthors = [], 
  onAddAuthor, 
  onRemoveAuthor,
  disabled = false 
}) => {
  const [allAuthors, setAllAuthors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedAuthor, setSelectedAuthor] = useState(null);
  const dropdownRef = useRef(null);

  // Загружаем всех авторов
  useEffect(() => {
    const loadAuthors = async () => {
      try {
        setLoading(true);
        const response = await authorService.getAll();
        setAllAuthors(response.data);
      } catch (err) {
        console.error('Ошибка при загрузке авторов:', err);
      } finally {
        setLoading(false);
      }
    };
    
    loadAuthors();
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

  // Форматируем ФИО автора
  const formatAuthorName = (author) => {
    if (!author) return '';
    
    const parts = [];
    if (author.authorSurname) parts.push(author.authorSurname);
    if (author.authorName) parts.push(`${author.authorName.charAt(0)}.`);
    if (author.authorPatronymic) parts.push(`${author.authorPatronymic.charAt(0)}.`);
    return parts.join(' ');
  };

  // Полный ФИО для поиска
  const getFullName = (author) => {
    if (!author) return '';
    return `${author.authorSurname || ''} ${author.authorName || ''} ${author.authorPatronymic || ''}`.trim();
  };

  // Фильтруем авторов для выпадающего списка
  const availableAuthors = allAuthors.filter(author => {
    // Исключаем уже добавленных авторов
    const isAlreadyAdded = currentAuthors.some(a => a.id === author.id);
    
    // Фильтруем по поисковому запросу
    const matchesSearch = searchQuery === '' || 
      getFullName(author).toLowerCase().includes(searchQuery.toLowerCase());
    
    return !isAlreadyAdded && matchesSearch;
  });

  const handleAddAuthor = async () => {
    if (!selectedAuthor) return;
    
    try {
      await onAddAuthor(bookId, selectedAuthor.id);
      setSelectedAuthor(null);
      setSearchQuery('');
      setShowDropdown(false);
    } catch (err) {
      alert('Ошибка при добавлении автора');
    }
  };

  const handleAddAuthorFromDropdown = async (author) => {
    try {
      await onAddAuthor(bookId, author.id);
      setSelectedAuthor(null);
      setSearchQuery('');
      setShowDropdown(false);
    } catch (err) {
      alert('Ошибка при добавлении автора');
    }
  };

  const handleRemoveAuthor = async (authorId) => {
    if (window.confirm('Удалить автора из книги?')) {
      try {
        await onRemoveAuthor(bookId, authorId);
      } catch (err) {
        alert('Ошибка при удалении автора');
      }
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setShowDropdown(true);
    setSelectedAuthor(null);
  };

  const handleSelectFromDropdown = (author) => {
    setSelectedAuthor(author);
    setSearchQuery(formatAuthorName(author));
    setShowDropdown(false);
  };

  const handleClearSelection = () => {
    setSelectedAuthor(null);
    setSearchQuery('');
  };

  return (
    <div className="space-y-4">
      <h4 className="font-medium text-gray-900">Авторы книги</h4>
      
      {/* Текущие авторы */}
      {currentAuthors.length === 0 ? (
        <p className="text-sm text-gray-500 italic">Нет добавленных авторов</p>
      ) : (
        <div className="space-y-2">
          {currentAuthors.map(author => (
            <div 
              key={author.id} 
              className="flex items-center justify-between p-2 bg-gray-50 rounded"
            >
              <div>
                <span className="font-medium">{formatAuthorName(author)}</span>
                <span className="text-sm text-gray-500 ml-2">ID: {author.id}</span>
              </div>
              <Button
                type="button"
                variant="danger"
                size="sm"
                onClick={() => handleRemoveAuthor(author.id)}
                disabled={disabled}
              >
                ✕ Удалить
              </Button>
            </div>
          ))}
        </div>
      )}
      
      {/* Добавление нового автора */}
      <div className="border-t pt-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Добавить автора
          </label>
          
          {/* Поле поиска с выпадающим списком */}
          <div className="relative" ref={dropdownRef}>
            <div className="relative">
              <input
                type="text"
                placeholder="Начните вводить фамилию автора..."
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
            {showDropdown && searchQuery && availableAuthors.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                {availableAuthors.map(author => (
                  <div
                    key={author.id}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                    onClick={() => handleSelectFromDropdown(author)}
                  >
                    <div className="font-medium">{formatAuthorName(author)}</div>
                    <div className="text-xs text-gray-500">
                      ID: {author.id} • {getFullName(author)}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Сообщение если ничего не найдено */}
            {showDropdown && searchQuery && availableAuthors.length === 0 && allAuthors.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg p-3">
                <p className="text-sm text-gray-500 text-center">
                  Авторы не найдены. Возможно, все доступные авторы уже добавлены.
                </p>
              </div>
            )}
          </div>
          
          {/* Кнопка добавления (если автор выбран через выпадающий список) */}
          {selectedAuthor && (
            <div className="flex items-center gap-2 p-2 bg-blue-50 rounded border border-blue-200">
              <div className="flex-1">
                <div className="font-medium text-blue-800">
                  Выбран: {formatAuthorName(selectedAuthor)}
                </div>
                <div className="text-xs text-blue-600">ID: {selectedAuthor.id}</div>
              </div>
              <Button
                type="button"
                onClick={handleAddAuthor}
                disabled={disabled}
                className="whitespace-nowrap"
              >
                Добавить
              </Button>
            </div>
          )}
          
          {/* Старый select для совместимости (можно скрыть если не нужен) */}
          <div className="mt-2">
            <select
              value={selectedAuthor?.id || ''}
              onChange={(e) => {
                const author = allAuthors.find(a => a.id === parseInt(e.target.value));
                if (author) {
                  setSelectedAuthor(author);
                  setSearchQuery(formatAuthorName(author));
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              disabled={disabled || loading || availableAuthors.length === 0}
            >
              <option value="">Или выберите из списка</option>
              {availableAuthors.map(author => (
                <option key={author.id} value={author.id}>
                  {formatAuthorName(author)} (ID: {author.id})
                </option>
              ))}
            </select>
          </div>
          
          {/* Сообщение если все авторы добавлены */}
          {availableAuthors.length === 0 && allAuthors.length > 0 && (
            <p className="text-sm text-gray-500">
              Все доступные авторы уже добавлены к этой книге
            </p>
          )}
          
          {/* Кнопка добавления через select */}
          {selectedAuthor && (
            <Button
              type="button"
              onClick={handleAddAuthor}
              disabled={disabled || !selectedAuthor || loading}
              className="w-full"
            >
              Добавить автора
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};