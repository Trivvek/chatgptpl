const express = require('express');
const router = express.Router();
const { registerUser, activateUser, loginUser, useToken, askGPT, getTokens } = require('../controllers/authController');
const authenticateToken = require('../middleware/authMiddleware');

router.post('/use-token', authenticateToken, useToken);
router.get('/tokens', authenticateToken, getTokens);
router.post('/register', registerUser);
router.get('/activate/:token', activateUser);
router.post('/login', loginUser);
router.post('/ask', authenticateToken, askGPT);

module.exports = router;