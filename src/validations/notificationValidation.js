const { body, param, query } = require('express-validator');

const sendNotificationValidation = [
    body('receiver_id').isInt(),
    body('title').notEmpty(),
    body('message').notEmpty(),
    body('notification_type').isIn(['attendance', 'homework', 'exam', 'fee', 'performance', 'admission', 'general']),
    body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']),
    body('metadata').optional().isObject()
];

const bulkSendValidation = [
    body('notifications').isArray({ min: 1 }),
    body('notifications.*.receiver_id').isInt(),
    body('notifications.*.title').notEmpty(),
    body('notifications.*.message').notEmpty(),
    body('notifications.*.notification_type').isIn(['attendance', 'homework', 'exam', 'fee', 'performance', 'admission', 'general']),
    body('notifications.*.priority').optional().isIn(['low', 'medium', 'high', 'urgent']),
    body('notifications.*.metadata').optional().isObject()
];

const idParamValidation = [param('id').isInt()];

module.exports = {
    sendNotificationValidation,
    bulkSendValidation,
    idParamValidation
};