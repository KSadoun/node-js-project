const Joi = require('joi');

const forgotPasswordBody = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': 'Invalid email address',
    })
}).required();

const forgotPasswordSchema = {
    body: forgotPasswordBody,
}

module.exports = forgotPasswordSchema;
