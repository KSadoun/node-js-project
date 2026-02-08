const mongoose = require('mongoose');
const Follow = require('../models/follows');

const APIError = require('../utils/APIError');

const followUser = async (userId, targetUserId) => {

    console.log(userId, targetUserId);

    if (userId === targetUserId) {
        throw new APIError("You cannot follow yourself", 400);
    }

    const existingFollow = await Follow.findOne({ followerId: userId, followingId: targetUserId });
    if (existingFollow) {
        throw new APIError("You are already following this user", 400);
    }

    await mongoose.model('User').findByIdAndUpdate(userId, { $inc: { following: 1 } });
    await mongoose.model('User').findByIdAndUpdate(targetUserId, { $inc: { followers: 1 } });

    const follow = await Follow.create({ followerId: userId, followingId: targetUserId });
    return follow;
}

const unfollowUser = async (userId, targetUserId) => {

    const existingFollow = await Follow.findOne({ followerId: userId, followingId: targetUserId });
    if (!existingFollow) {
        throw new APIError("You are not following this user", 400);
    }

    const unfollow = await Follow.findOneAndDelete({ followerId: userId, followingId: targetUserId });

    await mongoose.model('User').findByIdAndUpdate(userId, { $inc: { following: -1 } });
    await mongoose.model('User').findByIdAndUpdate(targetUserId, { $inc: { followers: -1 } });

    return unfollow;
}

const getFollowers = async (userId, query) => {
    const limit = parseInt(query.limit, 10) || 10;
    const page = parseInt(query.page, 10) || 1;
    const skip = (page - 1) * limit;
    const followers = await Follow.find({ followingId: userId }).populate('followerId', 'name profilePicture').skip(skip).limit(limit);
    return followers;
}

const getFollowing = async (userId, query) => {
    const limit = parseInt(query.limit, 10) || 10;
    const page = parseInt(query.page, 10) || 1;
    const skip = (page - 1) * limit;
    const following = await Follow.find({ followerId: userId }).populate('followingId', 'name profilePicture').skip(skip).limit(limit);
    return following;
}


module.exports = {
    followUser,
    unfollowUser,
    getFollowers,
    getFollowing
}; 