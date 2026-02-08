const express = require('express');
const router = express.Router();
const schemas = require('../schemas');
const validate = require('../middlewares/validate');
const authenticate = require('../middlewares/authenticate')

const commentsController = require('../controllers/comments');

router.get('/', authenticate, validate(schemas.getCommentsSchema), commentsController.getComments);
router.get('/:id', authenticate, commentsController.getComment);
router.post('/', authenticate, validate(schemas.createCommentSchema), commentsController.createComment);
router.patch('/:id', authenticate, validate(schemas.updateCommentSchema), commentsController.updateComment);
router.delete('/:id', authenticate, commentsController.deleteComment);



module.exports = router;