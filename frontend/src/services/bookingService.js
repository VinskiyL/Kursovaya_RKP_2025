import api from './api';

export const bookingService = {
    /**
     * Получить все бронирования
     */
    getAll: () => api.get('/bookings'),
    
    /**
     * Выдать книгу (отметить как выданную)
     */
    issue: (id) => api.put(`/bookings/${id}/issue`),
    
    /**
     * Вернуть книгу (отметить как возвращённую)
     */
    return: (id) => api.put(`/bookings/${id}/return`),
    
    /**
     * Удалить бронирование
     */
    delete: (id) => api.delete(`/bookings/${id}`)
};

export default bookingService;