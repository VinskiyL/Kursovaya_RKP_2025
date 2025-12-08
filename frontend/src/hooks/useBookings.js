// src/hooks/useBookings.js
import { useState, useEffect, useCallback } from 'react';
import { bookingService } from '../services/bookingService';

export const useBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // 🆕 Состояния для пагинации и поиска
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchType, setSearchType] = useState('all'); // 'all', 'id', 'book', 'reader'

    /**
     * Загрузка всех бронирований
     */
    const loadBookings = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            
            // 🆕 Фильтрация на клиенте (если нет бэкенд-фильтрации)
            const response = await bookingService.getAll();
            let filteredBookings = response.data;
            
            // Применяем фильтр поиска
            if (searchQuery.trim()) {
                filteredBookings = filteredBookings.filter(booking => {
                    const query = searchQuery.toLowerCase().trim();
                    
                    switch (searchType) {
                        case 'id':
                            return booking.id.toString().includes(query);
                        case 'book':
                            return booking.bookTitle.toLowerCase().includes(query);
                        case 'reader':
                            return booking.readerFullName.toLowerCase().includes(query);
                        case 'all':
                        default:
                            return (
                                booking.id.toString().includes(query) ||
                                booking.bookTitle.toLowerCase().includes(query) ||
                                booking.readerFullName.toLowerCase().includes(query)
                            );
                    }
                });
            }
            
            // 🆕 Пагинация
            const pageSize = 10;
            const totalItems = filteredBookings.length;
            const totalPages = Math.ceil(totalItems / pageSize);
            
            const startIndex = (currentPage - 1) * pageSize;
            const paginatedBookings = filteredBookings.slice(startIndex, startIndex + pageSize);
            
            setBookings(paginatedBookings);
            setTotalPages(totalPages);
            
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Ошибка при загрузке бронирований';
            setError(errorMessage);
            console.error('Ошибка загрузки бронирований:', err);
        } finally {
            setLoading(false);
        }
    }, [currentPage, searchQuery, searchType]); // 🆕 Добавляем зависимости

    /**
     * Выдать книгу
     */
    const issueBooking = async (id) => {
        try {
            await bookingService.issue(id);
            await loadBookings(); // 🆕 Перезагружаем с учётом фильтров
            return { success: true };
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Ошибка при выдаче книги';
            return { success: false, error: errorMessage };
        }
    };

    /**
     * Вернуть книгу
     */
    const returnBooking = async (id) => {
        try {
            await bookingService.return(id);
            await loadBookings(); // 🆕 Перезагружаем с учётом фильтров
            return { success: true };
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Ошибка при возврате книги';
            return { success: false, error: errorMessage };
        }
    };

    /**
     * Удалить бронирование
     */
    const deleteBooking = async (id) => {
        try {
            await bookingService.delete(id);
            await loadBookings(); // 🆕 Перезагружаем с учётом фильтров
            return { success: true };
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Ошибка при удалении бронирования';
            return { success: false, error: errorMessage };
        }
    };

    /**
     * 🆕 Изменить страницу
     */
    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    /**
     * 🆕 Обработка поиска
     */
    const handleSearch = (query, type = 'all') => {
        setSearchQuery(query);
        setSearchType(type);
        setCurrentPage(1); // Сбрасываем на первую страницу при новом поиске
    };

    /**
     * 🆕 Сброс поиска
     */
    const resetSearch = () => {
        setSearchQuery('');
        setSearchType('all');
        setCurrentPage(1);
    };

    // Загружаем данные при изменении зависимостей
    useEffect(() => {
        loadBookings();
    }, [loadBookings]);

    return {
        // Данные
        bookings,
        loading,
        error,
        
        // Пагинация
        currentPage,
        totalPages,
        goToPage,
        
        // Поиск
        searchQuery,
        searchType,
        handleSearch,
        resetSearch,
        
        // Действия
        loadBookings,
        issueBooking,
        returnBooking,
        deleteBooking
    };
};