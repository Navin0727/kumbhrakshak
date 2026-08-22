const Joi = require('joi');

const reportCase = {
  body: Joi.object({
    personName: Joi.string().trim().min(2).max(100).required(),
    age: Joi.number().integer().min(0).max(150).required(),
    gender: Joi.string().valid('Male', 'Female', 'Child').required(),
    lastSeenLocation: Joi.string().trim().max(200).required(),
    lastSeenTime: Joi.string().trim().max(100).required(),
    clothing: Joi.string().max(500).allow('').default(''),
    guardianName: Joi.string().trim().max(100).required(),
    guardianContact: Joi.string().trim().max(20).required(),
    photoUrl: Joi.string().uri().allow('').default(''),
    notes: Joi.string().max(1000).allow('').default(''),
  }),
};

const updateCase = {
  body: Joi.object({
    status: Joi.string().valid('MISSING', 'INVESTIGATING', 'REUNITED'),
    notes: Joi.string().max(1000),
  }),
  params: Joi.object({
    id: Joi.string().required(),
  }),
};

module.exports = { reportCase, updateCase };
