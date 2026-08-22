const Joi = require('joi');

const dispatchSOS = {
  body: Joi.object({
    pilgrimName: Joi.string().trim().max(100).required().messages({
      'any.required': 'Pilgrim name is required',
    }),
    location: Joi.string().trim().max(200).required().messages({
      'any.required': 'Location is required',
    }),
    emergencyType: Joi.string().trim().max(100).default('General Emergency SOS'),
    medicalDetails: Joi.object({
      bloodGroup: Joi.string().max(10).allow(''),
      allergies: Joi.string().max(500).allow(''),
      conditions: Joi.string().max(500).allow(''),
    }).default({}),
    contactPhone: Joi.string().max(20).allow('').default(''),
  }),
};

module.exports = { dispatchSOS };
