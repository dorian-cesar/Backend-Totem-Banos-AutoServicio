const express = require('express');
const { register, login, me, requireAuth } = require('../controllers/authController');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

// Protegido con JWT
router.get('/me', requireAuth, me);

module.exports = router;
