const joi = require('@hapi/joi');

exports.createMatchSchema = joi.object({

    conquestId: joi.number().integer().positive().required()
});

exports.updateMatchSchema = joi.object({

    MatchDate: joi.date().iso().optional(),
    MatchEndDate: joi.date().iso().optional(),
    Conquest_has_sysUser_Conquest_idConquest: joi.number().integer().positive().optional(),
    Conquest_has_sysUser_sysUser_idsysuser: joi.number().integer().positive().optional()
});