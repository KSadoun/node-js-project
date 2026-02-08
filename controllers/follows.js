const Follow = require("../models/follows");
const User = require("../models/users");

const followService = require("../services/follows");

const followUser = async (req, res, next) => {
    const followerId = req.user.userId;
    const followingId = req.params.userId;
    const follow = await followService.followUser(followerId, followingId);

    res.status(201).json({
        success: true,
        message: "User followed successfully",
        data: follow
    });
}

const unfollowUser = async (req, res, next) => {
    const followerId = req.user.userId;
    const followingId = req.params.userId;
    const unfollow = await followService.unfollowUser(followerId, followingId);
    res.status(200).json({
        success: true,
        message: "User unfollowed successfully",
        data: unfollow
    });
}

const getFollowers = async (req, res, next) => {
    const userId = req.params.userId;
    const followers = await followService.getFollowers(userId, req.query);  
    res.status(200).json({
        success: true,
        message: "Followers fetched successfully",
        data: followers
    });
}

const getFollowing = async (req, res, next) => {
    const userId = req.params.userId;
    const following = await followService.getFollowing(userId, req.query);
    res.status(200).json({
        success: true,
        message: "Following fetched successfully",
        data: following
    });
}

module.exports = {
    followUser,
    unfollowUser,
    getFollowers,
    getFollowing
};