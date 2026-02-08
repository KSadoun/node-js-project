const User = require('../models/users');
const passwordResetService = require('../services/passwordReset');
const emailService = require('../services/email');
const APIError = require("../utils/APIError")

const forgotPassword = async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        throw new APIError("No user found with this email", 404);
    }

    const token = passwordResetService.generateResetToken();

    console.log(token);
    const savedToken = await passwordResetService.saveResetToken(user._id, token.token);

    if (!savedToken) {
        throw new APIError("Error saving reset token", 500);
    }

    const email = await emailService.sendPasswordResetEmail(user, token.token);

    if (!email) {
        throw new APIError("Error sending password reset email", 500);
    }

    res.status(200).json({
        success: true,
        message: "Password reset email sent successfully",
        data: email
    });

}

const resetPassword = async (req, res, next) => {
    const token = req.query.token;
    const newPassword = req.body.newPassword;

    const verify = await passwordResetService.verifyResetToken(token);

    if (!verify) {
        throw new APIError("Invalid or expired token", 400);
    }

    const user = await passwordResetService.resetPassword(token, newPassword);

    if (!user) {
        throw new APIError("Error resetting password", 500);
    }

    const email = await emailService.sendPasswordResetConfirmation(user)

    res.status(200).json({
        success: true,
        message: "Password reset successfully",
        data: user
    });
}

const changePassword = async (req, res, next) => {

    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
        throw new APIError("Please enter all fields", 400);
    }
    const user = await passwordResetService.changePassword(req.user.userId, oldPassword, newPassword);
    
    const email = await emailService.sendPasswordResetConfirmation(user)

    res.status(200).json({
        success: true,
        message: "Password changed successfully",
        data: { id: user._id, email: user.email }
    });
}

module.exports = {
    forgotPassword,
    resetPassword,
    changePassword
}