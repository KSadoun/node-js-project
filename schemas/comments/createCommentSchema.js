const Joi = require('joi');
const mongoose = require('mongoose');

const objectId = Joi.string().custom((value, helpers) => {
    return mongoose.Types.ObjectId.isValid(value) ? value : helpers.error('any.invalid');
});


const createCommentBody = Joi.object({
    content: Joi.string().min(10).required(),
    postId: objectId.required(),
    parentCommentId: objectId,
    likes: Joi.number().default(0),
    isEdited: Joi.number().min(0).default(0),
    editedAt: Joi.number().min(0).default(0)
}).required();

const createCommentSchema = {
    body: createCommentBody,
}

module.exports = createCommentSchema;
