const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authenticate')
const notificationsController = require('../controllers/notifications')

router.get('/', authenticate, notificationsController.getUserNotifications);
router.patch('/:id/read', authenticate, notificationsController.markNotificationsAsRead);
router.patch('/:id/read-all', authenticate, notificationsController.markAllNotificationsAsRead);

module.exports = router;