const Joi = require('joi');

const resetPasswordBody = Joi.object({
    oldPassword: Joi.string().min(8).max(30).required(),
    newPassword: Joi.string().min(8).max(30).required(),
    confirmPassword: Joi.string().valid(Joi.ref('newPassword')).required()
});

const schema = {
    body: resetPasswordBody,}

module.exports = schema;
