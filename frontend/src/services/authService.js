import api from './api';

export const authService = {
    // Registrar usuario
    async register(name, email, password) {
        const response = await api.post('/auth/register', {
            name,
            email,
            password
        });
        return response.data;
    },

    // Iniciar sesión
    async login(email, password) {
        const response = await api.post('/auth/login', {
            email,
            password
        });
        return response.data;
    }
};

export default authService;
