const Joi = require('joi');
const mongoose = require('mongoose');

const objectId = Joi.string().custom((value, helpers) => {
    return mongoose.Types.ObjectId.isValid(value) ? value : helpers.error('any.invalid');
});


const updateCommentBodySchema = Joi.object({
    content: Joi.string().min(10).required(),
    postId: objectId.required(),
    parentCommentId: objectId,
    author: Joi.string().min(3),
    likes: Joi.number().default(0),
    isEdited: Joi.number().min(0).default(0),
    editedAt: Joi.number().min(0).default(0)
}).required();

const updateCommentParamsSchema = Joi.object({
    id: Joi.string().hex().length(24).required(),
}).required();


const schema = {
    body: updateCommentBodySchema,
    params: updateCommentParamsSchema,
}

module.exports = schema;
