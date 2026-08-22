const Joi = require('joi');

const requestOtp = {
  body: Joi.object({
    phoneNumber: Joi.string()
      .pattern(/^\d{10}$/)
      .required()
      .messages({
        'string.pattern.base': 'Phone number must be a valid 10-digit number',
        'any.required': 'Phone number is required',
      }),
    fullName: Joi.string().trim().min(2).max(100).required().messages({
      'string.min': 'Full name must be at least 2 characters',
      'any.required': 'Full name is required',
    }),
    bloodGroup: Joi.string()
      .valid('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown')
      .default('Unknown'),
    ageGroup: Joi.string().valid('18-30', '31-50', '51-65', '65+', '').default(''),
    originCity: Joi.string().max(100).allow('').default(''),
  }),
};

const verifyOtp = {
  body: Joi.object({
    phoneNumber: Joi.string()
      .pattern(/^\d{10}$/)
      .required()
      .messages({
        'string.pattern.base': 'Phone number must be a valid 10-digit number',
        'any.required': 'Phone number is required',
      }),
    otp: Joi.string().length(4).required().messages({
      'string.length': 'OTP must be exactly 4 digits',
      'any.required': 'OTP is required',
    }),
    fullName: Joi.string().trim().min(2).max(100).required(),
    bloodGroup: Joi.string()
      .valid('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown')
      .default('Unknown'),
    ageGroup: Joi.string().valid('18-30', '31-50', '51-65', '65+', '').default(''),
    language: Joi.string().valid('en', 'hi', 'mr', 'gu', 'sa').default('en'),
  }),
};

const loginPassId = {
  body: Joi.object({
    passId: Joi.string().trim().min(3).max(50).required().messages({
      'any.required': 'Pilgrim Pass ID is required',
    }),
    passSecret: Joi.string().max(10).allow('').default(''),
  }),
};

const loginOfficial = {
  body: Joi.object({
    badgeNumber: Joi.string().trim().min(3).max(50).required().messages({
      'any.required': 'Badge number is required',
    }),
    dutySector: Joi.string().max(100).allow('').default(''),
  }),
};

const updateProfile = {
  body: Joi.object({
    fullName: Joi.string().trim().min(2).max(100),
    ageGroup: Joi.string().valid('18-30', '31-50', '51-65', '65+', ''),
    language: Joi.string().valid('en', 'hi', 'mr', 'gu', 'sa'),
    bloodGroup: Joi.string().valid('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'),
    allergies: Joi.string().max(500),
    medicalConditions: Joi.string().max(500),
    currentMedications: Joi.string().max(500),
    mobilityAssistance: Joi.boolean(),
    emergencyContact: Joi.object({
      name: Joi.string().max(100).allow(''),
      phone: Joi.string().max(20).allow(''),
      relationship: Joi.string().valid('Spouse', 'Parent', 'Child', 'Sibling', 'Friend', 'Other', ''),
    }),
  }),
};

module.exports = {
  requestOtp,
  verifyOtp,
  loginPassId,
  loginOfficial,
  updateProfile,
};
