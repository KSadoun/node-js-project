const Joi = require('joi');

const updateUserBodySchema = Joi.object({
    name: Joi.string().alphanum().min(3).max(30),
    email: Joi.string().email(),
    age: Joi.number().min(18).max(150)
});

const updateUserParamsSchema = Joi.object({
    id: Joi.string().hex().length(24).required(),
}).required();


const schema = {
    body: updateUserBodySchema,
    params: updateUserParamsSchema,
}

module.exports = schema;
