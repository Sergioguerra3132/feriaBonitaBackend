const joi = require('@hapi/joi');

exports.createZombieSchema = joi.object({

    ZombieName: joi.string().alphanum().min(4).max(45).required(),
    ZombiePoints: joi.number().integer().positive().required()
});

exports.updateZombieSchema = joi.object({

    ZombieName: joi.string().alphanum().min(4).max(45).optional(),
    ZombiePoints: joi.number().integer().positive().optional()
});