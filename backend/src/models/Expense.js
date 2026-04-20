const pool = require('../config/database');

class Expense {
    static async create({ userId, name, description, value }) {
        const [result] = await pool.query(
            'INSERT INTO expenses (user_id, name, description, value) VALUES (?, ?, ?, ?)',
            [userId, name, description, value]
        );
        return result.insertId;
    }

    static async findByUserId(userId) {
        const [rows] = await pool.query(
            'SELECT * FROM expenses WHERE user_id = ? ORDER BY created_at DESC',
            [userId]
        );
        return rows;
    }

    static async findTodayByUserId(userId) {
        const [rows] = await pool.query(
            `SELECT * FROM expenses
             WHERE user_id = ? AND DATE(created_at) = CURDATE()
             ORDER BY created_at DESC`,
            [userId]
        );
        return rows;
    }

    static async findWeekByUserId(userId) {
        const [rows] = await pool.query(
            `SELECT * FROM expenses
             WHERE user_id = ? AND YEARWEEK(created_at, 1) = YEARWEEK(CURDATE(), 1)
             ORDER BY created_at DESC`,
            [userId]
        );
        return rows;
    }
}

module.exports = Expense;
