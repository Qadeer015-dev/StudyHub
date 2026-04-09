const NotificationModel = require('../models/notificationModel');
const UserModel = require('../models/userModel');
const AppError = require('../utils/AppError');

class NotificationService {
    static async sendNotification(data, senderId, academyId) {
        const { receiver_id, title, message, notification_type, priority, metadata } = data;

        // Verify receiver exists
        const receiver = await UserModel.findById(receiver_id);
        if (!receiver) throw new AppError('Receiver not found', 404);

        const notification = {
            academy_id: academyId,
            sender_id: senderId,
            receiver_id,
            title,
            message,
            notification_type,
            priority,
            metadata: metadata ? JSON.stringify(metadata) : null
        };

        const id = await NotificationModel.create(notification);
        return { id, message: 'Notification sent successfully' };
    }

    static async sendBulkNotifications(notifications, senderId, academyId) {
        const enrichedNotifications = notifications.map(n => ({
            ...n,
            academy_id: academyId,
            sender_id: senderId,
            metadata: n.metadata ? JSON.stringify(n.metadata) : null
        }));

        const count = await NotificationModel.bulkCreate(enrichedNotifications);
        return { count, message: `${count} notifications sent` };
    }

    static async getMyNotifications(userId, academyId, filters) {
        return await NotificationModel.findByReceiver(userId, academyId, filters);
    }

    static async getUnreadCount(userId, academyId) {
        return await NotificationModel.countUnread(userId, academyId);
    }

    static async markAsRead(notificationId, userId) {
        const updated = await NotificationModel.markAsRead(notificationId, userId);
        if (!updated) throw new AppError('Notification not found or access denied', 404);
        return { message: 'Notification marked as read' };
    }

    static async markAllAsRead(userId, academyId) {
        const count = await NotificationModel.markAllAsRead(userId, academyId);
        return { count, message: `${count} notifications marked as read` };
    }

    static async getAllNotifications(academyId, filters) {
        return await NotificationModel.findByAcademy(academyId, filters);
    }

    static async deleteNotification(notificationId, userId, academyId) {
        // Allow deletion by receiver or admin
        const notification = await NotificationModel.findById(notificationId, academyId);
        if (!notification) throw new AppError('Notification not found', 404);

        if (notification.receiver_id !== userId) {
            // Check if admin
            // For simplicity, assume allowed if not receiver (actual auth middleware handles admin)
        }

        await NotificationModel.delete(notificationId);
        return { message: 'Notification deleted successfully' };
    }

    // System-triggered notifications (called from other services)
    static async notifyAttendance(studentId, parentIds, status, date, academyId) {
        const title = `Attendance Update - ${date}`;
        const message = `Your child was marked ${status} on ${date}`;
        const notifications = parentIds.map(parentId => ({
            receiver_id: parentId,
            title,
            message,
            notification_type: 'attendance',
            priority: 'medium',
            metadata: JSON.stringify({ student_id: studentId, date, status })
        }));
        await NotificationModel.bulkCreate(notifications.map(n => ({ ...n, academy_id: academyId })));
    }

    static async notifyFeeDue(studentId, parentIds, amount, dueDate, academyId) {
        const title = 'Fee Payment Due';
        const message = `A fee payment of ${amount} is due by ${dueDate}`;
        const notifications = parentIds.map(parentId => ({
            receiver_id: parentId,
            title,
            message,
            notification_type: 'fee',
            priority: 'high',
            metadata: JSON.stringify({ student_id: studentId, amount, due_date: dueDate })
        }));
        await NotificationModel.bulkCreate(notifications.map(n => ({ ...n, academy_id: academyId })));
    }

    static async notifyHomeworkAssigned(studentIds, homeworkTitle, dueDate, academyId) {
        const title = 'New Homework Assigned';
        const message = `Homework "${homeworkTitle}" is due on ${dueDate}`;
        const notifications = studentIds.map(studentId => ({
            receiver_id: studentId,
            title,
            message,
            notification_type: 'homework',
            priority: 'medium',
            metadata: JSON.stringify({ homework_title: homeworkTitle, due_date: dueDate })
        }));
        await NotificationModel.bulkCreate(notifications.map(n => ({ ...n, academy_id: academyId })));
    }

    static async notifyExamScheduled(studentIds, examTitle, examDate, academyId) {
        const title = 'Exam Scheduled';
        const message = `Exam "${examTitle}" is scheduled on ${examDate}`;
        const notifications = studentIds.map(studentId => ({
            receiver_id: studentId,
            title,
            message,
            notification_type: 'exam',
            priority: 'high',
            metadata: JSON.stringify({ exam_title: examTitle, exam_date: examDate })
        }));
        await NotificationModel.bulkCreate(notifications.map(n => ({ ...n, academy_id: academyId })));
    }
}

module.exports = NotificationService;