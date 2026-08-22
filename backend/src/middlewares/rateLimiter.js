const rateLimit = require('express-rate-limit');
const { env } = require('../config/env');

/**
 * General API rate limiter.
 */
const generalLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests, please try again later',
    code: 'RATE_LIMITED',
  },
});

/**
 * Strict rate limiter for auth endpoints (OTP requests).
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again after 15 minutes',
    code: 'RATE_LIMITED',
  },
});

/**
 * Strict rate limiter for SOS dispatch (prevent abuse).
 */
const sosLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many SOS requests — if this is a real emergency, call 112 or 108',
    code: 'RATE_LIMITED',
  },
});

module.exports = { generalLimiter, authLimiter, sosLimiter };
