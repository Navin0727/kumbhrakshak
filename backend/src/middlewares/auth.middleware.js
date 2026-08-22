const jwt = require('jsonwebtoken');
const { env } = require('../config/env');
const ApiError = require('../utils/ApiError');
const User = require('../models/User');

/**
 * Verify JWT and attach user to request.
 * Required for protected routes.
 */
async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw ApiError.unauthorized('No authentication token provided');
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, env.JWT_SECRET);

    const user = await User.findById(decoded.id).select('-__v');
    if (!user) {
      throw ApiError.unauthorized('User not found — token invalid');
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof ApiError) {
      return next(error);
    }
    next(error); // JWT errors handled by errorHandler
  }
}

/**
 * Optional authentication — attaches user if token present, continues either way.
 * Useful for endpoints that work for both guests and authenticated users.
 */
async function optionalAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-__v');
      if (user) {
        req.user = user;
      }
    }
  } catch (_) {
    // Silently ignore — user remains unauthenticated
  }
  next();
}

/**
 * Role-based authorization middleware.
 * @param  {...string} roles - Allowed roles (e.g., 'admin', 'official')
 */
function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return next(ApiError.unauthorized('Authentication required'));
    }
    if (!roles.includes(req.user.role)) {
      return next(ApiError.forbidden(`Role '${req.user.role}' is not authorized for this action`));
    }
    next();
  };
}

module.exports = { authenticate, optionalAuth, authorize };
