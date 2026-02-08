const Joi = require('joi');

const createPostBody = Joi.object({
    title: Joi.string().min(3).max(200).required(),
    content: Joi.string().min(10).required(),
    author: Joi.string().min(2).max(100).required(),
    tags: Joi.array().items(Joi.string()),
    status: Joi.string().valid('draft', 'published', 'scheduled').default('draft'),
    likes: Joi.number().min(0).default(0),

}).required();

const createPostSchema = {
    body: createPostBody,
}

module.exports = createPostSchema;
