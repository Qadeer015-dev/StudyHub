const router = require('../router')();
const { protect, restrictTo } = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const {
    sendNotificationValidation,
    bulkSendValidation,
    idParamValidation
} = require('../../validations/notificationValidation');
const controller = require('../../controllers/notificationController');

router.use(protect);

// User's own notifications
router.get('/notifications', controller.getMyNotifications);
router.get('/notifications/unread-count', controller.getUnreadCount);
router.patch('/notifications/:id/read', idParamValidation, validate, controller.markAsRead);
router.patch('/notifications/read-all', controller.markAllAsRead);
router.delete('/notifications/:id', idParamValidation, validate, controller.deleteNotification);

// Admin/Teacher send notifications
router.post('/notifications', restrictTo('admin', 'teacher'), sendNotificationValidation, validate, controller.sendNotification);
router.post('/notifications/bulk', restrictTo('admin', 'teacher'), bulkSendValidation, validate, controller.sendBulkNotifications);

// Admin view all notifications
router.get('/notifications/all', restrictTo('admin'), controller.getAllNotifications);

module.exports = router;