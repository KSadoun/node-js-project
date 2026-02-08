const mongoose = require('mongoose');
const Post = require('../models/posts');
const Comment = require('../models/comments')

const APIError = require('../utils/APIError');

const getAllComments = async (query, postId, userId) => {
    let comments;
    if (postId) {
        comments = await Comment.find({postId});
    }
    else {
        comments = await Comment.find()
    }
    return comments;
}

const getCommentById = async (id, userId) => {
    const comment = await Comment.findOne({ "_id": id });
    if (!comment) {
        throw new APIError("No Comment found", 400);
    }

    return comment;
}

const getCommentsByPost = async (postId, userId) => {
    const comments = await Comment.find({ "postId": postId });
    if (!comments) {
        throw new APIError("No Comment found", 400);
    }

    return comments;
}

const createComment = async (commentData, userId) => {
    console.log(commentData);
    const { postId, content } = commentData;

    if (!postId || !content) {
        throw new APIError("post id and comment cant be null", 400);
    }

    const comment = Comment.create({ ...commentData, userId });
    return comment;
}


const updateCommentById = async (id, commentData, userId) => {
    const { author } = commentData;

    if (!author) throw new APIError("Author field is required", 400);

    comment = Comment.findOneAndUpdate({
        ...commentData,
        "author": author,
        "editedAt": Date.now()
    });

    return comment;

}

const deleteCommentById = async (id, userId) => {
    const comment = Comment.find({id});
    if (!comment) {
        throw new APIError("comment not found.", 400);
    }

    comment.findOneAndDelete({ id });
    return comment;
}

module.exports = { 
    getAllComments,
    getCommentById,
    updateCommentById,
    deleteCommentById,
    getCommentsByPost,
    createComment,
}