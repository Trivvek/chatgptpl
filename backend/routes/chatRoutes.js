const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const authenticateToken = require('../middleware/authMiddleware');

router.use(authenticateToken);

router.post('/new', chatController.createChat);
router.get('/:chatId', chatController.getChatDetails);
router.get('/', chatController.getChats);

router.post('/:chatId/messages', chatController.addMessage);

module.exports = router;