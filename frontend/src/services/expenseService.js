import api from './api';

export const expenseService = {
    // Crear gasto
    async createExpense(token, { name, description, value }) {
        const response = await api.post('/expenses', {
            name,
            description,
            value
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    },

    // Obtener gastos de hoy
    async getTodayExpenses(token) {
        const response = await api.get('/expenses/today', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    },

    // Obtener gastos de la semana
    async getWeekExpenses(token) {
        const response = await api.get('/expenses/week', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    },

    // Obtener todos los gastos
    async getAllExpenses(token) {
        const response = await api.get('/expenses', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    }
};

export default expenseService;
