const joi = require('@hapi/joi');

exports.registerSchema = joi.object({

    userName: joi.string().alphanum().min(6).max(12).required(),
    email: joi.string().email().min(6).max(64).required(),
    password: joi.string().alphanum().min(6).max(12).required()

});

exports.loginSchema = joi.object({

    email: joi.string().email().min(6).max(64).required(),
    password: joi.string().alphanum().min(6).max(12).required()

});
  