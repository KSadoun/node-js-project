const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    passwordResetToken: {type: String },
    passwordResetExpires: {type: Date},
    profilePicture: { type: String },
    followers: { type: Number, default: 0 },
    following: { type: Number, default: 0 },
    role: { type: String, required: true, enum: ['admin', 'user'], default: 'user' },
    age: { type: Number, required: true, min: 18, max: 150 },
}, { timestamps: true });

userSchema.index({"email": 1});


const User = mongoose.model('User', userSchema);

module.exports = User;