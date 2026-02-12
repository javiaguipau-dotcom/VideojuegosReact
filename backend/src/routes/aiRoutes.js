const express = require('express');
const router = express.Router();
const { chatWithAI } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

// AI Chat endpoint - protected route
router.post('/chat', protect, chatWithAI);

module.exports = router;
