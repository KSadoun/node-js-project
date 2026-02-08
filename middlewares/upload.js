const multer = require('multer');
const path = require('path');
const APIError = require('../utils/APIError');

const allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];

// File validation helper
const fileFilter = (allowedMimes, fieldName) => {
    return (req, file, cb) => {
        // Validate MIME type
        if (!allowedMimes.includes(file.mimetype)) {
            return cb(new APIError(`Invalid file type for ${fieldName}. Allowed types: ${allowedMimes.join(', ')}`, 400));
        }
        cb(null, true);
    };
};

// Profile picture upload configuration
const profilePictureUpload = multer({
    dest: 'uploads/profile/',
    limits: {
        fileSize: 2 * 1024 * 1024 // 2MB
    },
    fileFilter: fileFilter(
        ['image/jpeg', 'image/png', 'image/webp'],
        'profile picture'
    )
});

// Post image upload configuration
const postImageUpload = multer({
    dest: 'uploads/posts/',
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    },
    fileFilter: fileFilter(
        ['image/jpeg', 'image/png', 'image/webp'],
        'post image'
    )
});

module.exports = {
    profilePicture: profilePictureUpload.single('profilePicture'),
    post: postImageUpload.array('images', 10), 
    postSingle: postImageUpload.single('image')
}