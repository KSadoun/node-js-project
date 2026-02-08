const mongoose = require('mongoose');
const User = require('./users');

const notificationSchema = mongoose.Schema.create({
    userId: { type: mongoose.Types.ObjectId, ref: User },
    type: { type: String, enum: ['like', 'comment', 'follow', 'reply'], required: true },
    relatedUserId: { type: mongoose.Types.ObjectId, ref: User },
    relatedPostId: { type: mongoose.Types.ObjectId },
    relatedCommentId: { type: mongoose.Types.ObjectId },
    read: { type: Boolean, default: false },
}, {timestamps: true});

// notificationSchema.index({ userId: 1, type: 1, relatedUserId: 1, relatedPostId: 1, relatedCommentId: 1 }, {unique: true});

const Notification = mongoose.model('notification', notificationSchema)

module.exports = Notification