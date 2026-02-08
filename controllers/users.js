
const userService = require('../services/users');
const mongoose = require('mongoose');
const { sendWelcomeEmail, sendPasswordResetEmail, sendPasswordResetConfirmation, sendCommentNotification, sendReplyNotification } = require('../services/email');





const signUp = async (req, res, next) => {

        const user = await userService.signUp(req.body);
        
        // Send welcome email to the new user
        await sendWelcomeEmail(user);

        
        res.status(201).json({ 
            success: true, 
            message: "User created successfully", 
            data: user 
        });

};

const signIn = async (req, res, next) => {
    const { token, user } = await userService.signIn(req.body);
    
    // await sendPasswordResetEmail(user, 'JLHhkljhU8293Hlkjh32kljh2H2Mhk');
    // await sendPasswordResetConfirmation(user);
    // await sendReplyNotification({name: "Khalid", email: "commenter@email.com"}, "Mohammed", "ur stupid", "no u r stupid")
    
    res.status(201).json({ 
        success: true, 
        message: "User Found", 
        token: token,
        user: user 
    });
};


const search = async (req, res, next) => {
    const { email, name } = req.query;
    if (!email && !name) throw new APIError("no query found!", 404);
    // console.log();
    
    const users = await userService.search(email, name);
    if (!users || users.length === 0) {
        throw new APIError("No users found matching the query", 404);
    }

    res.status(201).json({ 
        success: true, 
        message: "Users found", 
        data: users
    });

}


const getAllUsers = async (req, res, next) => {
    const users = await userService.getAllUsers(req.query);
    res.status(200).json({ 
        success: true, 
        count: users.length, 
        data: users 
    });
};

const getUserById = async (req, res, next) => {
    const user = await userService.getUserById({ id: req.params.id });
    res.status(200).json({ 
        success: true, 
        data: user 
    });
};

const updateUser = async (req, res, next) => {
    const { id } = req.params;
    
    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ 
            success: false, 
            message: "Invalid user ID" 
        });
    }
    
    const updatedUser = await userService.updateUserById(id, req.body);
    res.status(200).json({ 
        success: true, 
        message: "User updated successfully", 
        data: updatedUser 
    });
};

const deleteUser = async (req, res, next) => {
    const { id } = req.params;
    
    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ 
            success: false, 
            message: "Invalid user ID" 
        });
    }
    
    const deletedUser = await userService.deleteUserById(id);
    res.status(200).json({ 
        success: true, 
        message: "User deleted successfully", 
        data: deletedUser 
    });
};


const uploadProfilePicture = async (req, res, next) => {
    const userId = req.user.userId;
    const file = req.file;

    if (!file) {
        return res.status(400).json({ 
            success: false, 
            message: "No file provided" 
        });
    }

    const result = await userService.uploadProfilePicture(userId, file);
    
    res.status(200).json({ 
        success: true, 
        message: "Profile picture uploaded successfully", 
        data: result 
    });
}

const deleteProfilePicture = async (req, res, next) => {
    const userId = req.user.userId;
    
    const result = await userService.deleteProfilePicture(userId);
    
    res.status(200).json({ 
        success: true, 
        message: result.message, 
        data: result.user 
    });
}

module.exports = {
    signUp,
    signIn,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    uploadProfilePicture,
    deleteProfilePicture,
    search
};
