const Joi = require('joi');

const getAllUsersQuery = Joi.object({
    page: Joi.number().min(1),
    limit: Joi.number().min(1).max(100)
});

const getAllUsersSchema = {
    query: getAllUsersQuery
}

module.exports = getAllUsersSchema;
