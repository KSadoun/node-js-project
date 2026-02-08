
const Post = require("../models/posts");
const User = require("../models/users");

const notificationsService = require("../services/notifications");
const commentService = require("../services/comments");

const { sendCommentNotification } = require('../services/email');
// const { getPostById } = require("../services/posts");

const getComments = async (req, res, next) => {

    // TODO: pagination

    const postId = req.query.postId;
    const userId = req.user.userId;
    const comments = await commentService.getAllComments(req.query, postId, userId)
    res.status(200).json({ 
        success: true, 
        message: "Comments Fetched Successfully", 
        data: comments
    });
}

const getComment = async (req, res, next) => {
    const commentId = req.params.id;
    const comment = await commentService.getCommentById(commentId, req.user.id);
    res.status(200).json({ 
        success: true, 
        message: "Comment Fetched Successfully", 
        data: comment
    });
}

const getPostComments = async (req, res, next) => {
    const postId = req.params.id;
    const comments = await commentService.getCommentsByPost(postId, req.user.id);

    res.status(200).json({ 
        success: true, 
        message: "Comments Fetched Successfully", 
        data: comments
    });
}

const createComment = async (req, res, next) => {
    const userId = req.user.userId;
    const postId = req.body.postId;
    const post = await Post.findOne({ "_id": postId });
    const postAuthor = await User.findOne({ "_id": post.userId });
    const commenter = await User.findOne({ '_id': req.user.userId });
    const comment = await commentService.createComment(req.body, userId);
    
    if (req.body.parentCommentId) {
        const parentComment = await commentService.getCommentById(req.body.parentCommentId, req.user.id);
        if (!parentComment) {
            throw new APIError("Parent comment not found", 404);
        }

        // Notify the parent comment's author about the reply
        const replyNotification = await notificationsService.createNotification({
            userId: parentComment.userId,
            type: 'reply',
            relatedUserId: req.user.userId,
            relatedPostId: post._id,
            relatedCommentId: comment._id
        });
        if (!replyNotification) {
            throw new APIError("Couldn't create reply notification!", 400);
        }
    }

    if (postAuthor._id.toString() !== req.user.userId) {
        const notification = await notificationsService.createNotification({
            userId: postAuthor._id,
            type: 'comment',
            relatedUserId: req.user.userId,
            relatedPostId: post._id,
            relatedCommentId: comment._id
        });
    }


    if(!notification) {
        throw new APIError("Couldn't create notification!", 400);
    }

    res.status(201).json({ 
        success: true, 
        message: "Comment created successfully", 
        data: comment
    });
    
    await sendCommentNotification(postAuthor, commenter, post.title, req.body.content)

}

const updateComment = async (req, res, next) => {
    const commentId = req.params.id;

    if (!req.body.author) throw new APIError("Author field is required", 400);

    const comment = await commentService.updateCommentById(commentId , req.body, req.user.id);
    res.status(201).json({ 
        success: true, 
        message: "Comment updated successfully", 
        data: comment
    });
}

const deleteComment = async (req, res, next) => {
    const commentId = req.params.id;
    const comment = await commentService.deleteCommentById(commentId, req.user.id);

    res.status(201).json({ 
        success: true, 
        message: "Comment deleted successfully", 
        data: comment
    });

}



module.exports = {
    getComments,
    getComment,
    getPostComments,
    updateComment,
    deleteComment,
    createComment,
}