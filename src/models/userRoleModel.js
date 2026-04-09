const pool = require('../config/db');

class UserRoleModel {
    static async assignRole(userId, role, academyId = null, assignedBy = null) {
        const [result] = await pool.execute(
            `INSERT INTO user_roles (user_id, role, academy_id, assigned_by) 
             VALUES (?, ?, ?, ?)`,
            [userId, role, academyId, assignedBy]
        );
        return result.insertId;
    }

    static async getUserRoles(userId, academyId = null) {
        let query = `SELECT role, academy_id, is_active FROM user_roles WHERE user_id = ? AND is_active = TRUE`;
        const params = [userId];

        if (academyId) {
            query += ' AND (academy_id = ? OR academy_id IS NULL)';
            params.push(academyId);
        }

        const [rows] = await pool.execute(query, params);
        return rows;
    }

    static async hasRole(userId, role, academyId = null) {
        let query = `SELECT id FROM user_roles WHERE user_id = ? AND role = ? AND is_active = TRUE`;
        const params = [userId, role];

        if (academyId) {
            query += ' AND (academy_id = ? OR academy_id IS NULL)';
            params.push(academyId);
        }

        const [rows] = await pool.execute(query, params);
        return rows.length > 0;
    }

    static async deactivateRole(userId, role, academyId = null) {
        let query = `UPDATE user_roles SET is_active = FALSE WHERE user_id = ? AND role = ?`;
        const params = [userId, role];

        if (academyId) {
            query += ' AND academy_id = ?';
            params.push(academyId);
        }

        const [result] = await pool.execute(query, params);
        return result.affectedRows > 0;
    }
}

module.exports = UserRoleModel;