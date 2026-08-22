const logger = require('../config/logger');
const ApiError = require('../utils/ApiError');
const { env } = require('../config/env');

/**
 * Centralized error handling middleware.
 * All errors flow through here for consistent API error responses.
 */
function errorHandler(err, req, res, _next) {
  // Default values
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal server error';
  let code = err.code || 'INTERNAL_ERROR';
  let errors = err.errors || [];

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    statusCode = 422;
    code = 'VALIDATION_ERROR';
    message = 'Validation failed';
    errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    statusCode = 409;
    code = 'DUPLICATE_ERROR';
    const field = Object.keys(err.keyValue)[0];
    message = `${field} already exists`;
    errors = [{ field, message }];
  }

  // Mongoose cast error (bad ObjectId)
  if (err.name === 'CastError') {
    statusCode = 400;
    code = 'INVALID_ID';
    message = `Invalid ${err.path}: ${err.value}`;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    code = 'INVALID_TOKEN';
    message = 'Invalid authentication token';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    code = 'TOKEN_EXPIRED';
    message = 'Authentication token has expired';
  }

  // Joi validation error
  if (err.isJoi) {
    statusCode = 422;
    code = 'VALIDATION_ERROR';
    message = 'Validation failed';
    errors = err.details.map((d) => ({
      field: d.path.join('.'),
      message: d.message,
    }));
  }

  // Log server errors
  if (statusCode >= 500) {
    logger.error(`${req.method} ${req.originalUrl} — ${message}`, {
      statusCode,
      stack: err.stack,
      userId: req.user?.id,
    });
  } else {
    logger.warn(`${req.method} ${req.originalUrl} — ${message}`, {
      statusCode,
      code,
    });
  }

  // Never expose stack traces in production
  const response = {
    success: false,
    message,
    code,
    errors,
  };

  if (env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
}

/**
 * 404 handler for unmatched routes.
 */
function notFoundHandler(req, res, next) {
  next(ApiError.notFound(`Route not found: ${req.method} ${req.originalUrl}`));
}

module.exports = { errorHandler, notFoundHandler };
