import { useState, useEffect } from 'react';
import { bookingService } from '../services/bookingService';

export const useBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Загрузка всех бронирований
  const loadBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await bookingService.getAll();
      setBookings(response.data);
    } catch (err) {
      setError('Ошибка при загрузке бронирований');
      console.error('Error loading bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  // Выдать книгу (обычный способ)
  const issueBooking = async (id) => {
    try {
      const response = await bookingService.issue(id);
      await loadBookings();
      return response.data;
    } catch (err) {
      throw err;
    }
  };

  // Вернуть книгу
  const returnBooking = async (id) => {
    try {
      const response = await bookingService.return(id);
      await loadBookings();
      return response.data;
    } catch (err) {
      throw err;
    }
  };

  // 🎯 Обновить бронь (количество, даты) - УЖЕ ЕСТЬ!
  const updateBooking = async (id, updateData) => {
    try {
      const response = await bookingService.update(id, updateData);
      await loadBookings();
      return response.data;
    } catch (err) {
      throw err;
    }
  };

  // Удалить бронь
  const deleteBooking = async (id) => {
    try {
      await bookingService.delete(id);
      await loadBookings();
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  return {
    bookings,
    loading,
    error,
    loadBookings,
    issueBooking,
    returnBooking,
    updateBooking, // ✅ Есть!
    deleteBooking,
    refreshBookings: loadBookings
  };
};