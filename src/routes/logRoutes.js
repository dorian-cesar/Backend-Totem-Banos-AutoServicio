const express = require('express');
const { listLogs, listPaginatedLogs } = require('../controllers/logController');
const { requireAuth } = require('../controllers/authController');

const router = express.Router();

// Logs filtrados (ej: por usuario, endpoint, fechas)
router.get('/', requireAuth, listLogs);

// Logs paginados (para grandes volúmenes)
router.get('/all', requireAuth, listPaginatedLogs);

module.exports = router;
