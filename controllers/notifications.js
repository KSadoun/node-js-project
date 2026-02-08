
const APIError = require('../utils/APIError');
const notificationsService = require('../services/notifications');

const getUserNotifications = async (req, res, next) => {
    const userId = req.user.userId;
    const notifications = await notificationsService.getUserNotifications(userId, req.query);
    
    if (!notifications) {
        throw new APIError("Couldn't fetch notifications!", 400);
    }

    res.status(200).json({ 
        success: true, 
        message: "Notifications fetched successfully", 
        data: notifications
    });
}

const markNotificationsAsRead = async (req, res, next) => {
    const userId = req.user.userId;
    const notificationId = req.params.id;
    const updatedNotification = await notificationsService.markAsRead(userId, notificationId);
    
    if (!updatedNotification) {
        throw new APIError("Couldn't mark notification as read!", 400);
    }

    res.status(200).json({ 
        success: true, 
        message: "Notification marked as read successfully", 
        data: updatedNotification
    });
}

const markAllNotificationsAsRead = async (req, res, next) => {
    const userId = req.user.userId;
    const updatedNotifications = await notificationsService.markAllAsRead(userId);
    
    if (!updatedNotifications) {
        throw new APIError("Couldn't mark notifications as read!", 400);
    }
    
    res.status(200).json({
        success: true,
        message: "Successful marked all notifications as read",
        data: updatedNotifications
    })
}



module.exports = {
    getUserNotifications,
    markNotificationsAsRead,
    markAllNotificationsAsRead
}
