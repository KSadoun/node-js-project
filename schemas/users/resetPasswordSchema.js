const Joi = require('joi');

const resetPasswordBody = Joi.object({
    password: Joi.string().min(8).max(30).required(),
    repeatPassword: Joi.string().valid(Joi.ref('password')).required()
});

const resetPasswordQuery = Joi.object({
    token: Joi.string()
    .hex()     
    .length(64)
    .required()
    .messages({
      'string.hex': 'Invalid token format',
      'string.length': 'Token must be exactly 64 characters',
      'any.required': 'Token is required'
    }),
}).required();


const schema = {
    body: resetPasswordBody,
    params: resetPasswordQuery,
}

module.exports = schema;
