const Joi = require('joi');

const validator = {};


validator.registerUser = {
  body: Joi.object({
    username: Joi.string().max(255).required(),
    email: Joi.string().email().max(255).required(),
    password: Joi.string().max(255).required(),
    name: Joi.string().max(255).required(),
    age: Joi.number().integer().min(0).optional().allow(null),
    phone: Joi.string().max(255).optional().allow(null),
    country: Joi.string().max(255).optional().allow(null),
  }),
};


module.exports = validator;
