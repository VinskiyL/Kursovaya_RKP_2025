import axios from 'axios';

// Базовые настройки axios
const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  timeout: 10000,
});

// Перехватчик для ошибок
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export default api;