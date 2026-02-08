
const Like = require('../models/likes');
const mongoose = require('mongoose');

const toggleLike = async (userId, targetType, targetId) => {
    const isLiked = await isLikedByUser(userId, targetType, targetId);

    if (isLiked) {
        const like = await Like.findOneAndDelete({'userId': userId, 'targetType': targetType, 'targetId': targetId});
        // console.log("OLLLLLLLLLLLLLLLLLLLLLLLLD")
        return like;
    }
    else {
        const like = await Like.create({
            'userId': userId,
            'targetType': targetType,
            'targetId': targetId
        });
        // console.log("Newwwwwwwwwwwwwwwwwwww")
        return like;
    }
}

const getLikesCount = async (targetType, targetId) => {
    const likesCount = await Like.find({targetType, targetId}).length;
    return likesCount;
}

const isLikedByUser = async (userId, targetType, targetId) => {
    const like = await Like.findOne({userId, targetType, targetId});
    if (!like) return false;
    return true;
}


const getUserLikes = async (userId, query) => {
    return await Like.find({userId})
}

module.exports = {
    toggleLike,
    getLikesCount,
    isLikedByUser,
    getUserLikes

}