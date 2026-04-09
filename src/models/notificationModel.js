const pool = require('../config/db');

class NotificationModel {
    static async create(data) {
        const {
            academy_id, sender_id = null, receiver_id, title, message,
            notification_type, priority = 'medium', metadata = null
        } = data;

        const [result] = await pool.execute(
            `INSERT INTO notifications 
            (academy_id, sender_id, receiver_id, title, message, notification_type, priority, metadata) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [academy_id, sender_id, receiver_id, title, message, notification_type, priority, metadata]
        );
        return result.insertId;
    }

    static async bulkCreate(notifications) {
        if (!notifications.length) return 0;
        const values = notifications.map(n => [
            n.academy_id, n.sender_id || null, n.receiver_id, n.title, n.message,
            n.notification_type, n.priority || 'medium', n.metadata || null
        ]);
        const placeholders = notifications.map(() => '(?, ?, ?, ?, ?, ?, ?, ?)').join(', ');
        const flatValues = values.flat();
        const [result] = await pool.execute(
            `INSERT INTO notifications (academy_id, sender_id, receiver_id, title, message, notification_type, priority, metadata) 
             VALUES ${placeholders}`,
            flatValues
        );
        return result.affectedRows;
    }

    static async findById(id, academyId = null) {
        let query = 'SELECT * FROM notifications WHERE id = ?';
        const params = [id];
        if (academyId) {
            query += ' AND academy_id = ?';
            params.push(academyId);
        }
        const [rows] = await pool.execute(query, params);
        return rows[0];
    }

    static async findByReceiver(receiverId, academyId = null, filters = {}) {
        let query = `
            SELECT n.*, u.full_name as sender_name
            FROM notifications n
            LEFT JOIN users u ON n.sender_id = u.id
            WHERE n.receiver_id = ?`;
        const params = [receiverId];
        if (academyId) {
            query += ' AND n.academy_id = ?';
            params.push(academyId);
        }
        if (filters.is_read !== undefined) {
            query += ' AND n.is_read = ?';
            params.push(filters.is_read);
        }
        if (filters.notification_type) {
            query += ' AND n.notification_type = ?';
            params.push(filters.notification_type);
        }
        query += ' ORDER BY n.created_at DESC';
        const [rows] = await pool.execute(query, params);
        return rows;
    }

    static async findByAcademy(academyId, filters = {}) {
        let query = `
            SELECT n.*, 
                   sender.full_name as sender_name,
                   receiver.full_name as receiver_name
            FROM notifications n
            LEFT JOIN users sender ON n.sender_id = sender.id
            JOIN users receiver ON n.receiver_id = receiver.id
            WHERE n.academy_id = ?`;
        const params = [academyId];
        if (filters.is_read !== undefined) {
            query += ' AND n.is_read = ?';
            params.push(filters.is_read);
        }
        if (filters.notification_type) {
            query += ' AND n.notification_type = ?';
            params.push(filters.notification_type);
        }
        if (filters.receiver_id) {
            query += ' AND n.receiver_id = ?';
            params.push(filters.receiver_id);
        }
        query += ' ORDER BY n.created_at DESC LIMIT 100';
        const [rows] = await pool.execute(query, params);
        return rows;
    }

    static async markAsRead(id, receiverId) {
        const [result] = await pool.execute(
            'UPDATE notifications SET is_read = TRUE WHERE id = ? AND receiver_id = ?',
            [id, receiverId]
        );
        return result.affectedRows > 0;
    }

    static async markAllAsRead(receiverId, academyId = null) {
        let query = 'UPDATE notifications SET is_read = TRUE WHERE receiver_id = ?';
        const params = [receiverId];
        if (academyId) {
            query += ' AND academy_id = ?';
            params.push(academyId);
        }
        const [result] = await pool.execute(query, params);
        return result.affectedRows;
    }

    static async countUnread(receiverId, academyId = null) {
        let query = 'SELECT COUNT(*) as count FROM notifications WHERE receiver_id = ? AND is_read = FALSE';
        const params = [receiverId];
        if (academyId) {
            query += ' AND academy_id = ?';
            params.push(academyId);
        }
        const [rows] = await pool.execute(query, params);
        return rows[0].count;
    }

    static async delete(id) {
        const [result] = await pool.execute('DELETE FROM notifications WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
}

module.exports = NotificationModel;