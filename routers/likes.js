const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authenticate')
const likesController = require('../controllers/likes')

router.post('/', authenticate, likesController.toggleLike);
router.get('/count', likesController.getLikesCount);
router.get('/check', likesController.isLikedByUser);
// router.get('/', authenticate, likesController.toggleLike);


module.exports = router;