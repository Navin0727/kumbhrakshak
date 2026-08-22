const express = require('express');
const authController = require('../controllers/auth.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate');
const authValidator = require('../validators/auth.validator');
const { authLimiter } = require('../middlewares/rateLimiter');

const router = express.Router();

// OTP flow
router.post(
  '/request-otp',
  authLimiter,
  validate(authValidator.requestOtp),
  authController.requestOtp
);

router.post(
  '/verify-otp',
  authLimiter,
  validate(authValidator.verifyOtp),
  authController.verifyOtp
);

// Alternative login methods
router.post(
  '/login-pass-id',
  authLimiter,
  validate(authValidator.loginPassId),
  authController.loginPassId
);

router.post(
  '/login-official',
  authLimiter,
  validate(authValidator.loginOfficial),
  authController.loginOfficial
);

// Guest access
router.post('/guest', authController.guestAccess);

// Authenticated profile routes
router.get('/me', authenticate, authController.getMe);
router.put(
  '/profile',
  authenticate,
  validate(authValidator.updateProfile),
  authController.updateProfile
);

module.exports = router;
