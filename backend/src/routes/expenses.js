const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');
const authMiddleware = require('../middleware/auth');

// Todas las rutas requieren autenticación
router.use(authMiddleware);

router.post('/', expenseController.create);
router.get('/today', expenseController.getToday);
router.get('/week', expenseController.getWeek);
router.get('/', expenseController.getAll);

module.exports = router;
