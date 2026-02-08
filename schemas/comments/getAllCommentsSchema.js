const Joi = require('joi');

const getAllCommentsQuery = Joi.object({
    page: Joi.number().min(1),
    limit: Joi.number().min(1).max(100)
});

const getAllCommentsSchema = {
    query: getAllCommentsQuery
}

module.exports = getAllCommentsSchema;
