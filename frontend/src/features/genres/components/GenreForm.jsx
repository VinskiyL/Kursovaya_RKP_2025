import { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/Button';

export const GenreForm = ({ 
  genre = null, 
  onSubmit, 
  onCancel, 
  loading = false 
}) => {
  const [formData, setFormData] = useState({
    name: ''
  });

  // Заполняем форму при редактировании
  useEffect(() => {
    if (genre) {
      setFormData({
        name: genre.name || ''
      });
    }
  }, [genre]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">
          Название жанра *
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
          placeholder="Введите название жанра"
        />
      </div>

      <div className="flex gap-2 justify-end pt-4">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={loading}
        >
          Отмена
        </Button>
        <Button
          type="submit"
          disabled={loading}
        >
          {genre ? 'Обновить' : 'Создать'}
        </Button>
      </div>
    </form>
  );
};