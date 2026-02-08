const Bookmark = require("../models/bookmarks");
const User = require("../models/users");

const bookmarkService = require("../services/bookmarks");


const getUserBookmarks = async (req, res, next) => {
    const userId = req.user.userId;
    const bookmarks = await bookmarkService.getUserBookmarks(userId, req.query);
    res.status(200).json({ 
        success: true,
        message: "Bookmarks fetched successfully",
        data: bookmarks
    });
}

const addBookmark = async (req, res, next) => {
    const userId = req.user.userId;
    const postId = req.params.postId;

    console.log(userId, postId);

    const bookmark = await bookmarkService.addBookmark(userId, postId);

    res.status(201).json({ 
        success: true, 
        message: "Bookmark added successfully", 
        data: bookmark
    });
}

const deleteBookmark = async (req, res, next) => {
    const userId = req.user.userId;
    const postId = req.params.postId;

    const deletedBookmark = await bookmarkService.deleteBookmark(userId, postId);

    res.status(200).json({ 
        success: true, 
        message: "Bookmark removed successfully", 
        data: deletedBookmark
    });
}

module.exports = {
    addBookmark,
    deleteBookmark,
    getUserBookmarks
};