const ApiError = require('../utils/ApiError');

/**
 * Factory function: creates a validation middleware from a Joi schema.
 * @param {Object} schema - Joi schema with optional `body`, `query`, `params` keys.
 */
function validate(schema) {
  return (req, res, next) => {
    const errors = [];

    for (const [key, joiSchema] of Object.entries(schema)) {
      if (!['body', 'query', 'params'].includes(key)) continue;

      const { error, value } = joiSchema.validate(req[key], {
        abortEarly: false,
        stripUnknown: true,
        convert: true,
      });

      if (error) {
        errors.push(
          ...error.details.map((d) => ({
            field: d.path.join('.'),
            message: d.message.replace(/"/g, ''),
          }))
        );
      } else {
        // Replace with sanitized values
        req[key] = value;
      }
    }

    if (errors.length > 0) {
      return next(ApiError.validationError('Validation failed', errors));
    }

    next();
  };
}

module.exports = validate;
