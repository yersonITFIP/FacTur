const Expense = require('../models/Expense');

const expenseController = {
    // Crear un nuevo gasto
    async create(req, res) {
        try {
            const { name, description, value } = req.body;
            const userId = req.userId;

            // Validaciones
            if (!name || !value) {
                return res.status(400).json({
                    success: false,
                    message: 'Nombre y valor son obligatorios.'
                });
            }

            const numericValue = parseFloat(value);
            if (isNaN(numericValue) || numericValue <= 0) {
                return res.status(400).json({
                    success: false,
                    message: 'El valor debe ser un número positivo.'
                });
            }

            const expenseId = await Expense.create({
                userId,
                name,
                description: description || '',
                value: numericValue
            });

            res.status(201).json({
                success: true,
                message: 'Gasto registrado exitosamente.',
                data: {
                    id: expenseId,
                    name,
                    description: description || '',
                    value: numericValue
                }
            });
        } catch (error) {
            console.error('Error en create expense:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor.'
            });
        }
    },

    // Obtener gastos de hoy
    async getToday(req, res) {
        try {
            const userId = req.userId;
            const expenses = await Expense.findTodayByUserId(userId);

            const total = expenses.reduce((sum, exp) => sum + parseFloat(exp.value), 0);

            res.json({
                success: true,
                data: {
                    expenses,
                    total: parseFloat(total.toFixed(2)),
                    count: expenses.length
                }
            });
        } catch (error) {
            console.error('Error en getToday:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor.'
            });
        }
    },

    // Obtener gastos de la semana
    async getWeek(req, res) {
        try {
            const userId = req.userId;
            const expenses = await Expense.findWeekByUserId(userId);

            const total = expenses.reduce((sum, exp) => sum + parseFloat(exp.value), 0);

            res.json({
                success: true,
                data: {
                    expenses,
                    total: parseFloat(total.toFixed(2)),
                    count: expenses.length
                }
            });
        } catch (error) {
            console.error('Error en getWeek:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor.'
            });
        }
    },

    // Obtener todos los gastos del usuario
    async getAll(req, res) {
        try {
            const userId = req.userId;
            const expenses = await Expense.findByUserId(userId);

            res.json({
                success: true,
                data: {
                    expenses,
                    count: expenses.length
                }
            });
        } catch (error) {
            console.error('Error en getAll:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor.'
            });
        }
    }
};

module.exports = expenseController;
