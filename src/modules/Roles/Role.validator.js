const Joi = require('joi');
const { bodyParamValidation, queryParamValidation } = require('../../helpers/validator.js');

const roleCreateInput = (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(50).required(),  
        description: Joi.string().min(6).required(),  
        permissions: Joi.array().items(Joi.string()).optional(), 
    });
    return bodyParamValidation(req, res, next, schema);
};

const roleUpdateInput = (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(50).optional(),  
        description: Joi.string().min(6).optional(),  
        permissions: Joi.array().items(Joi.string()).optional(), 
        status: Joi.boolean().optional(), 
        isDeleted: Joi.boolean().optional(),
    });
    return bodyParamValidation(req, res, next, schema);
};

module.exports = {
    roleCreateInput,
    roleUpdateInput,
};
