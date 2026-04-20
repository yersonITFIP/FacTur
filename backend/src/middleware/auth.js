const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'factur_secret_key_2024';

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            message: 'Acceso denegado. Token no proporcionado.'
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Token inválido o expirado.'
        });
    }
};

module.exports = authMiddleware;
