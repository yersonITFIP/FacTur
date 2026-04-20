const pool = require('../config/database');

class User {
    static async findByEmail(email) {
        const [rows] = await pool.query(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );
        return rows[0] || null;
    }

    static async findById(id) {
        const [rows] = await pool.query(
            'SELECT id, name, email, created_at FROM users WHERE id = ?',
            [id]
        );
        return rows[0] || null;
    }

    static async create({ name, email, password }) {
        const [result] = await pool.query(
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
            [name, email, password]
        );
        return result.insertId;
    }
}

module.exports = User;
