const joi = require('@hapi/joi');

exports.validateCodeSchema = joi.object({

    code: joi.string().alphanum().min(6).max(16).required(),

});

exports.generateCodeSchema = joi.object({

    userId: joi.number().required(),

});
