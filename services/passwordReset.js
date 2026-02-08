
const User = require('../models/users');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const APIError = require("../utils/APIError")


// const resetRequestCache = new Map

// TODO: rate limiting on reset password

const generateResetToken = () => {
    const token = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto
        .createHash('sha256')
        .update(token)
        .digest('hex');
    return {
        token, hashedToken
    }
}

const saveResetToken = async (userId, token) => {
    const time = Date.now() + 3600000 / 4; // 15 minutes from now
    const hashedToken = crypto
        .createHash('sha256')
        .update(token)
        .digest('hex');
    const user = await User.findOneAndUpdate({_id: userId}, {
        passwordResetToken: hashedToken,
        passwordResetExpires: time
    });
    
    return user;
}

const verifyResetToken = async (token) => {
    const hashedToken = crypto
        .createHash('sha256')
        .update(token)
        .digest('hex');
        
    const user = await User.findOne({
        "passwordResetToken": hashedToken,
        "passwordResetExpires": { $gt: Date.now() }
    });
    
    if (!user) throw new APIError("Can't find this token!", 404);
    return user;

}

const resetPassword = async (token, newPassword) => {
    const hashedToken = crypto
        .createHash('sha256')
        .update(token)
        .digest('hex');
    
    const user = await User.findOneAndUpdate({"passwordResetToken": hashedToken}, {
        "passwordResetToken": "",
        "passwordResetExpires": "",
        "password": await bcrypt.hash(newPassword, 12)
    }, {new: true});

    return user;

}

const changePassword = async (userId, oldPassword, newPassword) => {
    
    const user = await User.findById(userId);
    if (!user) throw new APIError("User not found!", 404);

    // old password wrong
    if (!await bcrypt.compare(oldPassword, user.password)) throw new APIError("Wrong Old Password", 401);
    
    // new pass = old pass
    if (oldPassword === newPassword) throw new APIError("new password cant be same as old", 400); 
        
    user.password = await bcrypt.hash(newPassword, 12); 
    await user.save();
    return user;
}

module.exports = {
    generateResetToken,
    saveResetToken,
    verifyResetToken,
    resetPassword,
    changePassword
}