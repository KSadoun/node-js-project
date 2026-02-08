const mongoose = require('mongoose');
const Bookmark = require('../models/bookmarks');

const APIError = require('../utils/APIError');


const getUserBookmarks = async (userId) => {
    const bookmarks = await Bookmark.find({ userId }).populate('postId');
    
    if (!bookmarks) {
        throw new APIError("No bookmarks found for this user", 404);
    }

    return bookmarks;
}

const addBookmark = async (userId, postId) => {
    
    console.log (userId, postId);

    if (!mongoose.Types.ObjectId.isValid(postId)) {
        throw new APIError("Invalid post ID", 400);
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new APIError("Invalid user ID", 400);
    }
    
    const bookmark = await Bookmark.create({ userId, postId });
    return bookmark;
}

const deleteBookmark = async (userId, postId) => {

    if (!mongoose.Types.ObjectId.isValid(postId)) {
        throw new APIError("Invalid post ID", 400);
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new APIError("Invalid user ID", 400);
    }

    const deletedBookmark = await Bookmark.findOneAndDelete({ userId, postId });
    if (!deletedBookmark) {
        throw new APIError("Bookmark not found", 404);
    }
    return deletedBookmark;
}

module.exports = {
    addBookmark,
    deleteBookmark,
    getUserBookmarks
}; 