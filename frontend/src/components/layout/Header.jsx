import { Link, useLocation } from 'react-router-dom';

export const Header = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Главная' },
    { path: '/books', label: 'Книги' },
    { path: '/authors', label: 'Авторы' },
    { path: '/genres', label: 'Жанры' },
  ];

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">
            Библиотека Кафедры
          </h1>
          
          <nav className="flex space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === item.path
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};