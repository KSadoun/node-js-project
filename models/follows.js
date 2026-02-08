const mongoose = require('mongoose');
const User = require('./users'); 

const followSchema = new mongoose.Schema({
    followerId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    followingId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
}, {timestamps: true});

followSchema.index({ followerId: 1, followingId: 1 }, { unique: true });

const Follow = mongoose.model('Follow', followSchema);

module.exports = Follow;