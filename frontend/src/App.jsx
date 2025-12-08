// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { HomePage } from './pages/HomePage';
import { BooksPage } from './pages/BooksPage';
import { AuthorsPage } from './pages/AuthorsPage';
import { GenresPage } from './pages/GenresPage';
import { BookingsPage } from './pages/BookingsPage'; 

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/books" element={<BooksPage />} />
            <Route path="/authors" element={<AuthorsPage />} />
            <Route path="/genres" element={<GenresPage />} />
            <Route path="/bookings" element={<BookingsPage />} /> 
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;