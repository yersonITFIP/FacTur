import axios from 'axios';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

const api = axios.create({
    baseURL: API_URL,
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json'
    }
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            return Promise.reject(error.response.data);
        } else if (error.request) {
            return Promise.reject({
                success: false,
                message: 'No se pudo conectar con el servidor. Verifica que el backend esté corriendo.'
            });
        }
        return Promise.reject(error);
    }
);

export default api;