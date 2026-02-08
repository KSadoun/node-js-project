const mongoose = require('mongoose');
const User = require('../models/users');
const util = require('util');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const APIError = require('../utils/APIError');
const imageKitService = require('./imageKit');

const jwtSign = util.promisify(jwt.sign);

const signUp = async (userData) => {
    const { email, password } = userData;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        throw new APIError("User already exists", 400);
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({ ...userData, password: hashedPassword });
    return user;
}

const signIn = async (userData) => {
    const { email, password } = userData;
    const foundUser = await User.findOne({ email });

    if (!foundUser) {
        throw new APIError("email not registered", 401);
    }

    const hashed = await bcrypt.compare(password, foundUser.password);

    if(!hashed) {
        throw new APIError("password wrong", 401)
    }

    const payload = {
        userId: foundUser.id,
        role: foundUser.role
    }

    const token = await jwtSign(payload, process.env.JWT_SECRET);

    return { token, user: {...foundUser.toObject(), password: undefined }}
}

const search = async (email, name) => {
    const users = await User.find({
        $and: [
            { email: { $regex: `${email}`, $options: 'i' } },
            { name: { $regex: `${name}`, $options: 'i' } },
        ]
    });
    return users;
}

const getAllUsers = async (query) => {
    const { page = 1, limit = 2 } = query;
    const users = await User.find().skip((page-1) * limit).limit(limit);
    return users;
}

const getUserById = async (query) => {
    const { id } = query;
    if (!mongoose.isValidObjectId(id)) {
        throw new APIError("ID invalid", 400);
    }

    const user = await User.findOne({"_id": id});
    
    if (!user) {
        throw new APIError("User not found.", 404)
    }

    return user;
}

const updateUserById = async (id, userData) => {
    
    const { name, email, age } = userData;
    
    const update = await User.findOneAndUpdate({"_id": id}, {
        name,
        email,
        age
    }, { new: true });
    return update;
}

const deleteUserById = async (id) => {
    const deleted = await User.findByIdAndDelete(id);
    if (!deleted) throw new APIError("User not found", 404);
    return deleted;
}

const uploadProfilePicture = async (userId, file) => {
    if (!file) throw new APIError("No file provided", 400);

    // Upload to ImageKit
    const uploadedImage = await imageKitService.uploadImage(
        file,
        'profile-pictures',
        `profile-${userId}-${Date.now()}`
    );

    // Update user with new profile picture URL
    const user = await User.findByIdAndUpdate(
        userId,
        { profilePicture: uploadedImage.url },
        { new: true }
    );

    if (!user) throw new APIError("User not found", 404);

    return {
        fileId: uploadedImage.fileId,
        url: uploadedImage.url,
        user: { ...user.toObject(), password: undefined }
    };
}

const deleteProfilePicture = async (userId) => {
    const user = await User.findById(userId);
    if (!user) throw new APIError("User not found", 404);

    if (!user.profilePicture) {
        throw new APIError("No profile picture to delete", 404);
    }

    // Extract fileId from URL if stored, or manage deletion based on your setup
    // For now, we'll just clear the profile picture
    const updatedUser = await User.findByIdAndUpdate(
        userId,
        { profilePicture: null },
        { new: true }
    );

    return { 
        message: "Profile picture deleted successfully",
        user: { ...updatedUser.toObject(), password: undefined }
    };
}

module.exports = { signUp, signIn, getAllUsers, getUserById, updateUserById, deleteUserById, search, uploadProfilePicture, deleteProfilePicture };
