const mongoose = require('mongoose');
const Post = require('./posts'); 
const User = require('./users'); 

const bookmarkSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    postId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Post' },
}, {timestamps: true});

bookmarkSchema.index({ userId: 1, postId: 1 }, { unique: true });

const Bookmark = mongoose.model('Bookmark', bookmarkSchema);

module.exports = Bookmark;