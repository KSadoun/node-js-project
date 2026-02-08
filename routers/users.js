const express = require('express');
const router = express.Router();
const schemas = require('../schemas');
const validate = require('../middlewares/validate');
const authenticate = require('../middlewares/authenticate')
const restrictTo = require('../middlewares/restrictTo')
const upload = require('../middlewares/upload')


const usersController = require('../controllers/users');
const likesController = require('../controllers/likes');
const passwordReset = require('../controllers/passwordReset');
const bookmarksController = require('../controllers/bookmarks');
const followController = require('../controllers/follows');


// TODO: VALIDATION SCHEMAS FOR SEARCH IN USERS AND POSTS

// search
router.get("/search", authenticate, usersController.search);

// bookmarks
router.get ("/bookmarks", authenticate, bookmarksController.getUserBookmarks);

// follows
router.post("/:userId/follow", authenticate, followController.followUser);
router.delete("/:userId/follow", authenticate, followController.unfollowUser);
router.get("/:userId/followers", authenticate, followController.getFollowers);
router.get("/:userId/following", authenticate, followController.getFollowing);

// password reset
router.post("/forgot-password", validate(schemas.forgotPasswordSchema), passwordReset.forgotPassword);
router.post("/reset-password", validate(schemas.resetPasswordSchema), passwordReset.resetPassword);
router.patch("/change-password", authenticate, validate(schemas.changePasswordSchema), passwordReset.changePassword);

// profile picture
router.post("/profile-picture", authenticate, upload.profilePicture, usersController.uploadProfilePicture);
router.delete("/profile-picture", authenticate, usersController.deleteProfilePicture);

// user authentication
router.post("/sign-up", validate(schemas.signUpSchema), usersController.signUp);
router.post("/sign-in", validate(schemas.signInSchema), usersController.signIn);

// user management
router.get("/", authenticate, restrictTo(['admin', 'user']), usersController.getAllUsers);
router.get("/:id", authenticate, restrictTo(['admin', 'user']), usersController.getUserById);
router.patch("/:id", authenticate, restrictTo(['admin']), validate(schemas.updateUserSchema), usersController.updateUser);
router.delete("/:id", authenticate, restrictTo(['admin']),  usersController.deleteUser);



router.get("/:userId/likes", authenticate, likesController.getUserLikes);

module.exports = router;
