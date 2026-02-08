

const APIError = require('../utils/APIError');
const likesService = require('../services/likes');
const notificationsService = require('../services/notifications');

const toggleLike = async (req, res, next) => {
    const userId = req.user.userId;
    const like = await likesService.toggleLike(userId, req.body.targetType, req.body.targetId);
    
    const notification = await notificationsService.createNotification({
        userId: req.body.targetType === 'Post' ? req.body.targetId : undefined,
        type: 'like',
        relatedUserId: userId,
        relatedPostId: req.body.targetType === 'Post' ? req.body.targetId : undefined,
        relatedCommentId: req.body.targetType === 'Comment' ? req.body.targetId : undefined
    });

    if (!notification) {
        throw new APIError("Couldn't create notification!", 400);
    }

    if (!like) {
        throw new APIError("Couldn't toggle the like!", 400);
    }

    res.status(200).json({ 
        success: true, 
        message: "like toggled successfully", 
        data: like
    });
}

const getLikesCount = async (req, res, next) => {
    const userId = req.user.userId;
    const likesCount = await likesService.getLikesCount(req.query.targetType, req.query.targetId);
    
    if (likesCount < 0) {
        throw new APIError("Couldn't toggle the like!", 400);
    }

    res.status(200).json({
        success: true,
        message: "Successful fetch",
        data: likesCount
    })
}

const isLikedByUser = async (req, res, next) => {

    const userId = req.user.userId;
    const isLikedByUser = await likesService.isLikedByUser(userId, req.query.targetType, req.query.targetId);

    res.status(200).json({
        success: true,
        message: "Successful fetch",
        data: isLikedByUser
    });
}


const getUserLikes = async (req, res, next) => {

    // TODO: Pagination

    const userId = req.user.userId;
    const getUserLikes = await likesService.getUserLikes(userId, req.query);

    res.status(200).json({
        success: true,
        message: "Successful fetch",
        data: getUserLikes
    });
}

module.exports = {
    toggleLike,
    getLikesCount,
    isLikedByUser,
    getUserLikes
}
