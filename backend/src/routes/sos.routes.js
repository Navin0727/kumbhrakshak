const express = require('express');
const sosController = require('../controllers/sos.controller');
const { optionalAuth } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate');
const sosValidator = require('../validators/sos.validator');
const { sosLimiter } = require('../middlewares/rateLimiter');

const router = express.Router();

// SOS dispatch — uses optionalAuth so guests can also dispatch
router.post(
  '/dispatch',
  sosLimiter,
  optionalAuth,
  validate(sosValidator.dispatchSOS),
  sosController.dispatchSOS
);

// Get SOS incident status
router.get('/:incidentId', optionalAuth, sosController.getIncident);

module.exports = router;
