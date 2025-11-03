import { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/Button';
import { FileUpload } from '../../../components/ui/FileUpload';
import { fileService } from '../../../services/fileService';

export const BookForm = ({ 
  book = null, 
  onSubmit, 
  onCancel, 
  loading = false 
}) => {
  const [formData, setFormData] = useState({
    index: '',
    authorsMark: '',
    title: '',
    placePublication: '',
    informationPublication: '',
    volume: '',
    quantityTotal: '',
    quantityRemaining: '',
    cover: '',
    datePublication: ''
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [oldCoverPath, setOldCoverPath] = useState(null); // 🆕 Храним старую обложку

  // Заполняем форму при редактировании
  useEffect(() => {
    if (book) {
      setFormData({
        index: book.index || '',
        authorsMark: book.authorsMark || '',
        title: book.title || '',
        placePublication: book.placePublication || '',
        informationPublication: book.informationPublication || '',
        volume: book.volume || '',
        quantityTotal: book.quantityTotal || '',
        quantityRemaining: book.quantityRemaining || '',
        cover: book.cover || '',
        datePublication: book.datePublication || ''
      });

      // Устанавливаем preview текущей обложки
      if (book.cover) {
        setSelectedFile(`http://localhost:8080/${book.cover}`);
        setOldCoverPath(book.cover); // 🆕 Сохраняем путь старой обложки
      }
    } else {
      // Сброс формы при создании новой книги
      setFormData({
        index: '',
        authorsMark: '',
        title: '',
        placePublication: '',
        informationPublication: '',
        volume: '',
        quantityTotal: '',
        quantityRemaining: '',
        cover: '',
        datePublication: ''
      });
      setSelectedFile(null);
      setOldCoverPath(null); // 🆕 Сбрасываем старую обложку
    }
  }, [book]);

  // 🆕 ФУНКЦИЯ ДЛЯ УДАЛЕНИЯ СТАРОЙ ОБЛОЖКИ
  const deleteOldCover = async () => {
    if (oldCoverPath) {
      try {
        await fileService.deleteCover(oldCoverPath);
        console.log('Старая обложка удалена:', oldCoverPath);
      } catch (err) {
        console.error('Ошибка при удалении старой обложки:', err);
        // Не прерываем выполнение если удаление не удалось
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name.includes('quantity') || name === 'volume' ? Number(value) : value
    }));
  };

  // Обработчик выбора файла
  const handleFileSelect = async (file) => {
    if (!file) {
      // Файл удален - удаляем и старую обложку если редактируем
      if (book && oldCoverPath) {
        await deleteOldCover();
        setOldCoverPath(null);
      }
      setSelectedFile(null);
      setFormData(prev => ({ ...prev, cover: '' }));
      return;
    }

    try {
      setUploading(true);
      
      // 🆕 УДАЛЯЕМ СТАРУЮ ОБЛОЖКУ ПЕРЕД ЗАГРУЗКОЙ НОВОЙ
      if (oldCoverPath) {
        await deleteOldCover();
      }

      const response = await fileService.uploadCover(file);
      const filePath = response.data.filePath;
      
      setSelectedFile(`http://localhost:8080/${filePath}`);
      setFormData(prev => ({ ...prev, cover: filePath }));
      setOldCoverPath(null); // 🆕 Сбрасываем т.к. старая удалена
    } catch (err) {
      alert('Ошибка при загрузке обложки');
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleQuantityTotalChange = (e) => {
    const value = Number(e.target.value);
    setFormData(prev => ({
      ...prev,
      quantityTotal: value,
      quantityRemaining: prev.quantityRemaining === prev.quantityTotal ? value : prev.quantityRemaining
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-h-[80vh] overflow-y-auto">
      {/* Секция обложки */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-3">Обложка книги</h4>
        <FileUpload
          onFileSelect={handleFileSelect}
          currentFile={selectedFile}
          disabled={uploading || loading}
        />
        {uploading && (
          <p className="text-sm text-blue-600 mt-2">Загрузка обложки...</p>
        )}
      </div>

      {/* Остальные поля (без изменений) */}
      <div className="grid grid-cols-2 gap-4">
        {/* Левая колонка */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Индекс *
            </label>
            <input
              type="text"
              name="index"
              value={formData.index}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Авторский знак *
            </label>
            <input
              type="text"
              name="authorsMark"
              value={formData.authorsMark}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Название книги *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Место издания *
            </label>
            <input
              type="text"
              name="placePublication"
              value={formData.placePublication}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Информация об издании *
            </label>
            <input
              type="text"
              name="informationPublication"
              value={formData.informationPublication}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
          </div>
        </div>

        {/* Правая колонка */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Объем (страниц) *
            </label>
            <input
              type="number"
              name="volume"
              value={formData.volume}
              onChange={handleChange}
              required
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Общее количество *
            </label>
            <input
              type="number"
              name="quantityTotal"
              value={formData.quantityTotal}
              onChange={handleQuantityTotalChange}
              required
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Оставшееся количество *
            </label>
            <input
              type="number"
              name="quantityRemaining"
              value={formData.quantityRemaining}
              onChange={handleChange}
              required
              min="0"
              max={formData.quantityTotal}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Год издания *
            </label>
            <input
              type="text"
              name="datePublication"
              value={formData.datePublication}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
              placeholder="2024"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-2 justify-end pt-4 border-t">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={loading || uploading}
        >
          Отмена
        </Button>
        <Button
          type="submit"
          disabled={loading || uploading}
        >
          {book ? 'Обновить' : 'Создать'}
        </Button>
      </div>
    </form>
  );
};