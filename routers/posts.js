const express = require('express');
const router = express.Router();
const schemas = require('../schemas');
const validate = require('../middlewares/validate');
const authenticate = require('../middlewares/authenticate')

const multerMiddleware = require('../middlewares/upload')

const bookmarksController = require('../controllers/bookmarks');
const postsController = require('../controllers/posts');
const commentsController = require('../controllers/comments');

router.get("/search", authenticate, postsController.search);

router.get("/drafts", authenticate, postsController.getDrafts);
router.post("/:id/publish", authenticate, postsController.publishPost);
router.post("/:id/schedule", authenticate, postsController.schedulePost);



router.post("/:postId/bookmark", authenticate, bookmarksController.addBookmark);
router.delete("/:postId/bookmark", authenticate, bookmarksController.deleteBookmark);

router.post("/:id/view", postsController.incrementViews);

router.post("/", authenticate, multerMiddleware.post, validate(schemas.createPostSchema), postsController.createPost);
router.get("/",  authenticate, validate(schemas.getAllPostsSchema), postsController.getAllPosts);
router.get("/:id", authenticate, postsController.getPostById);
router.patch("/:id", authenticate, validate(schemas.updatePostSchema), postsController.updatePost);
router.post("/:id/images", authenticate, multerMiddleware.post, postsController.uploadPostImages);
router.delete("/:id/images", authenticate, postsController.deletePostImage);
router.delete("/:id", authenticate, postsController.deletePost);

// get post comments
router.get('/:id/comments', authenticate, commentsController.getPostComments);


module.exports = router; 