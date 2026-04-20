const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'factur_secret_key_2024';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

const authController = {
    // Registro de usuario
    async register(req, res) {
        try {
            const { name, email, password } = req.body;

            // Validaciones básicas
            if (!name || !email || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'Todos los campos son obligatorios.'
                });
            }

            if (password.length < 6) {
                return res.status(400).json({
                    success: false,
                    message: 'La contraseña debe tener al menos 6 caracteres.'
                });
            }

            // Verificar si el email ya existe
            const existingUser = await User.findByEmail(email);
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: 'El email ya está registrado.'
                });
            }

            // Hash de la contraseña
            const hashedPassword = await bcrypt.hash(password, 10);

            // Crear usuario
            const userId = await User.create({
                name,
                email,
                password: hashedPassword
            });

            // Generar token
            const token = jwt.sign({ userId }, JWT_SECRET, {
                expiresIn: JWT_EXPIRES_IN
            });

            res.status(201).json({
                success: true,
                message: 'Usuario registrado exitosamente.',
                data: {
                    token,
                    user: {
                        id: userId,
                        name,
                        email
                    }
                }
            });
        } catch (error) {
            console.error('Error en register:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor.'
            });
        }
    },

    // Login de usuario
    async login(req, res) {
        try {
            const { email, password } = req.body;

            // Validaciones básicas
            if (!email || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'Email y contraseña son obligatorios.'
                });
            }

            // Buscar usuario
            const user = await User.findByEmail(email);
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Credenciales inválidas.'
                });
            }

            // Verificar contraseña
            const isValidPassword = await bcrypt.compare(password, user.password);
            if (!isValidPassword) {
                return res.status(401).json({
                    success: false,
                    message: 'Credenciales inválidas.'
                });
            }

            // Generar token
            const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
                expiresIn: JWT_EXPIRES_IN
            });

            res.json({
                success: true,
                message: 'Login exitoso.',
                data: {
                    token,
                    user: {
                        id: user.id,
                        name: user.name,
                        email: user.email
                    }
                }
            });
        } catch (error) {
            console.error('Error en login:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor.'
            });
        }
    }
};

module.exports = authController;
