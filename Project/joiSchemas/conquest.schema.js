const joi = require('@hapi/joi');

exports.createConquestSchema = joi.object({

    ConquestName: joi.string().min(4).max(45).required(),
    InitialRegisterDate: joi.date().iso().required(),
    EndRegisterDate: joi.date().iso().required(),
    InitialEventDate: joi.date().iso().required(),
    days: joi.number().integer().positive().required(),
    Prize: joi.string().min(4).max(45).required(),
    MembersGuildForCalculate: joi.number().integer().positive().required()
});

exports.updateConquestSchema = joi.object({

    ConquestName: joi.string().alphanum().min(4).max(45).optional(),
    InitialRegisterDate: joi.date().iso().optional(),
    EndRegisterDate: joi.date().iso().optional(),
    InitialEventDate: joi.date().iso().optional(),
    days: joi.number().integer().positive().optional(),
    Prize: joi.string().alphanum().min(4).max(45).optional(),
    CreateDate: joi.date().iso().optional(),
    ConquestStatus_idConquestStatus: joi.number().integer().positive().optional(),
    MembersGuildForCalculate: joi.number().integer().positive().optional()
});

exports.registerUserInConquestSchema = joi.object({

    Conquest_idConquest: joi.number().integer().positive().required()
})