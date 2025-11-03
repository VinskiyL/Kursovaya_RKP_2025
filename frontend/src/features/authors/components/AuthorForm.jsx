import { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/Button';

export const AuthorForm = ({ 
  author = null, 
  onSubmit, 
  onCancel, 
  loading = false 
}) => {
  const [formData, setFormData] = useState({
    authorSurname: '',
    authorName: '',
    authorPatronymic: ''
  });

  // Заполняем форму при редактировании
  useEffect(() => {
    if (author) {
      setFormData({
        authorSurname: author.authorSurname || '',
        authorName: author.authorName || '',
        authorPatronymic: author.authorPatronymic || ''
      });
    }
  }, [author]);

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
          Фамилия *
        </label>
        <input
          type="text"
          name="authorSurname"
          value={formData.authorSurname}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Имя
        </label>
        <input
          type="text"
          name="authorName"
          value={formData.authorName}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Отчество
        </label>
        <input
          type="text"
          name="authorPatronymic"
          value={formData.authorPatronymic}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
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
          {author ? 'Обновить' : 'Создать'}
        </Button>
      </div>
    </form>
  );
};