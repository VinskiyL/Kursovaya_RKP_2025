import { useState, useRef, useEffect } from 'react';
import { Button } from './Button';

export const FileUpload = ({ 
  onFileSelect, 
  currentFile = null,
  accept = "image/*",
  maxSize = 5 * 1024 * 1024, // 5MB
  disabled = false
}) => {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  // 🆕 ОБНОВЛЯЕМ PREVIEW ПРИ ИЗМЕНЕНИИ currentFile
  useEffect(() => {
    if (currentFile) {
      setPreviewUrl(currentFile);
    } else {
      setPreviewUrl(null);
    }
  }, [currentFile]);

  const handleFileSelect = (file) => {
    if (!file) {
      // Файл удален
      setPreviewUrl(null);
      onFileSelect(null);
      return;
    }

    // Проверка размера
    if (file.size > maxSize) {
      alert(`Файл слишком большой. Максимальный размер: ${maxSize / 1024 / 1024}MB`);
      return;
    }

    // Проверка типа
    if (!file.type.startsWith('image/')) {
      alert('Пожалуйста, выберите изображение');
      return;
    }

    // Создаем preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target.result);
    };
    reader.readAsDataURL(file);

    // Передаем файл родителю
    onFileSelect(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = () => {
    setPreviewUrl(null);
    onFileSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      {/* Скрытый input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => handleFileSelect(e.target.files[0])}
        accept={accept}
        className="hidden"
        disabled={disabled}
      />

      {/* Preview текущего файла */}
      {previewUrl && (
        <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
          <img 
            src={previewUrl} 
            alt="Preview" 
            className="w-16 h-24 object-cover rounded"
          />
          <div className="flex-1">
            <p className="text-sm text-gray-600">
              {typeof currentFile === 'string' && currentFile.startsWith('http') 
                ? 'Текущая обложка' 
                : 'Новая обложка выбрана'
              }
            </p>
            <Button 
              type="button" 
              variant="danger" 
              size="sm"
              onClick={handleRemove}
              disabled={disabled}
            >
              Удалить
            </Button>
          </div>
        </div>
      )}

      {/* Область загрузки */}
      {!previewUrl && (
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
            ${dragOver 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={handleClick}
        >
          <div className="space-y-2">
            <div className="text-gray-500">
              <svg className="mx-auto h-12 w-12" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                Нажмите для загрузки обложки
              </p>
              <p className="text-xs text-gray-500">
                или перетащите изображение сюда
              </p>
              <p className="text-xs text-gray-400 mt-1">
                PNG, JPG, GIF до 5MB
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};