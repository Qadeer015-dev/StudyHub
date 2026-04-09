const NotificationService = require('../services/notificationService');

exports.sendNotification = async (req, res, next) => {
    try {
        const result = await NotificationService.sendNotification(req.body, req.user.id, req.user.academy_id);
        res.status(201).json({ success: true, ...result });
    } catch (error) { next(error); }
};

exports.sendBulkNotifications = async (req, res, next) => {
    try {
        const result = await NotificationService.sendBulkNotifications(req.body.notifications, req.user.id, req.user.academy_id);
        res.status(201).json({ success: true, ...result });
    } catch (error) { next(error); }
};

exports.getMyNotifications = async (req, res, next) => {
    try {
        const notifications = await NotificationService.getMyNotifications(req.user.id, req.user.academy_id, req.query);
        const unreadCount = await NotificationService.getUnreadCount(req.user.id, req.user.academy_id);
        res.json({ success: true, unread_count: unreadCount, data: notifications });
    } catch (error) { next(error); }
};

exports.getUnreadCount = async (req, res, next) => {
    try {
        const count = await NotificationService.getUnreadCount(req.user.id, req.user.academy_id);
        res.json({ success: true, unread_count: count });
    } catch (error) { next(error); }
};

exports.markAsRead = async (req, res, next) => {
    try {
        const result = await NotificationService.markAsRead(req.params.id, req.user.id);
        res.json({ success: true, ...result });
    } catch (error) { next(error); }
};

exports.markAllAsRead = async (req, res, next) => {
    try {
        const result = await NotificationService.markAllAsRead(req.user.id, req.user.academy_id);
        res.json({ success: true, ...result });
    } catch (error) { next(error); }
};

exports.getAllNotifications = async (req, res, next) => {
    try {
        const notifications = await NotificationService.getAllNotifications(req.user.academy_id, req.query);
        res.json({ success: true, data: notifications });
    } catch (error) { next(error); }
};

exports.deleteNotification = async (req, res, next) => {
    try {
        const result = await NotificationService.deleteNotification(req.params.id, req.user.id, req.user.academy_id);
        res.json({ success: true, ...result });
    } catch (error) { next(error); }
};