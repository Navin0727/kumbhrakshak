const aiService = require('../services/ai.service');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

const safetyAssistant = asyncHandler(async (req, res) => {
  const { message, language, context } = req.body;

  if (!message) {
    throw ApiError.badRequest('Message is required');
  }

  const result = await aiService.generateResponse({
    message,
    language: language || 'English',
    context: context || {},
  });

  // Return the same response shape the frontend expects: { reply, fallback? }
  res.json(result);
});

module.exports = { safetyAssistant };
