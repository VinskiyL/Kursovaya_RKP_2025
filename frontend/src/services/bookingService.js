import api from './api';

export const bookingService = {

    getAll: () => api.get('/bookings'),
    
    issue: (id) => api.put(`/bookings/${id}/issue`),

    return: (id) => api.put(`/bookings/${id}/return`),

    delete: (id) => api.delete(`/bookings/${id}`),

    update: (id, data) => api.put(`/bookings/${id}`, data)
};

export default bookingService;