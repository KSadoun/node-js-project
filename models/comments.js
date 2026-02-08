const mongoose = require('mongoose');
const Post = require('./posts'); 
const User = require('./users'); 

const commentSchema = new mongoose.Schema({
    content: { type: String, min: 1, max: 1000, required: true },
    postId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Post' },
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    parentCommentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment' },
    likes: { type: Number, default: 0},
    isEdited: { type: Boolean, default: false },
}, {timestamps: true});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;