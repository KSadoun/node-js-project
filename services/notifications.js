const mongoose = require('mongoose');
const APIError = require('../utils/APIError');
const Notification = require('../models/notifications');



const createNotification = async (notificationData) => {
    const notification = await Notification.create(notificationData);
    return notification;
}


const getUserNotifications = async (userId, query) => {

    // pagination
    const limit = parseInt(query.limit, 10) || 10;
    const page = parseInt(query.page, 10) || 1;
    const skip = (page - 1) * limit;

    if (query.unreadOnly === 'true') {
        const notifications = await Notification.find({ userId, read: false }).sort({ createdAt: -1 }).skip(skip).limit(limit);
        return notifications;
    }
    else {
        const notifications = await Notification.find({ userId }).sort({ createdAt: -1 }).skip(skip).limit(limit);
        return notifications;
    }
}

const markAsRead = async (userId, notificationId) => {
    const notification = await Notification.findOneAndUpdate(
        { _id: notificationId, userId },
        { read: true },
        { new: true }
    );
    return notification;
}

const markAllAsRead = async (userId) => {
    const result = await Notification.updateMany(
        { userId, read: false },
        { read: true }
    );
    return result;
}

module.exports = { 
    createNotification,
    getUserNotifications,
    markAsRead,
    markAllAsRead
}