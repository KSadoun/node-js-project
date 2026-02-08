const mongoose = require('mongoose');
const User = require('./users');

const likeSchema = mongoose.Schema.create({
    userId: { type: mongoose.Types.ObjectId, ref: User },
    targetType: { type: String, enum: ['Post', 'Comment'], required: true },
    targetId: { type: mongoose.Types.ObjectId, required: true },
}, {timestamps: true});

likeSchema.index({ 'userId': 1, 'targetType': 1, 'targetId': 1}, {unique: true});

const Like = mongoose.model('like', likeSchema)

module.exports = Like