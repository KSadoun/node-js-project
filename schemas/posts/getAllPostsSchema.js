const Joi = require('joi');

const getAllPostsQuery = Joi.object({
    page: Joi.number().min(1),
    limit: Joi.number().min(1).max(100)
});

const getAllPostsSchema = {
    query: getAllPostsQuery
}

module.exports = getAllPostsSchema;
