const express = require('express');
const aiController = require('../controllers/ai.controller');
const { optionalAuth } = require('../middlewares/auth.middleware');

const router = express.Router();

// AI Safety Assistant — optionalAuth allows both guests and authenticated users
router.post('/safety-assistant', optionalAuth, aiController.safetyAssistant);

module.exports = router;
