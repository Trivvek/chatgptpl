const express = require('express');
const router = express.Router();
const { registerUser, activateUser, loginUser, useToken, askGPT } = require('../controllers/authController');
const authenticateToken = require('../middleware/authMiddleware');

router.post('/use-token', authenticateToken, useToken);

router.post('/register', registerUser);

router.get('/activate/:token', activateUser);

router.post('/login', loginUser);

router.post('/ask', authenticateToken, askGPT);

module.exports = router;