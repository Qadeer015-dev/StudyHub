const pool = require('../config/db');

class ParentProfileModel {
    static async create(data) {
        const {
            academy_id, user_id, occupation = null, annual_income = null,
            office_address = null, office_phone = null, qualification = null
        } = data;

        const [result] = await pool.execute(
            `INSERT INTO parent_profiles 
            (academy_id, user_id, occupation, annual_income, office_address, office_phone, qualification) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [academy_id, user_id, occupation, annual_income, office_address, office_phone, qualification]
        );
        return result.insertId;
    }

    static async findById(id, academyId = null) {
        let query = 'SELECT * FROM parent_profiles WHERE id = ? AND deleted_at IS NULL';
        const params = [id];
        if (academyId) {
            query += ' AND academy_id = ?';
            params.push(academyId);
        }
        const [rows] = await pool.execute(query, params);
        return rows[0];
    }

    static async findByUserId(userId, academyId = null) {
        let query = 'SELECT * FROM parent_profiles WHERE user_id = ? AND deleted_at IS NULL';
        const params = [userId];
        if (academyId) {
            query += ' AND academy_id = ?';
            params.push(academyId);
        }
        const [rows] = await pool.execute(query, params);
        return rows[0];
    }

    static async findAll(academyId = null) {
        let query = 'SELECT * FROM parent_profiles WHERE deleted_at IS NULL';
        const params = [];
        if (academyId) {
            query += ' AND academy_id = ?';
            params.push(academyId);
        }
        const [rows] = await pool.execute(query, params);
        return rows;
    }

    static async update(id, data) {
        const fields = Object.keys(data).map(key => `${key} = ?`).join(', ');
        const values = Object.values(data);
        const [result] = await pool.execute(
            `UPDATE parent_profiles SET ${fields} WHERE id = ?`,
            [...values, id]
        );
        return result.affectedRows > 0;
    }

    static async softDelete(id) {
        const [result] = await pool.execute(
            'UPDATE parent_profiles SET deleted_at = NOW() WHERE id = ?',
            [id]
        );
        return result.affectedRows > 0;
    }
}

module.exports = ParentProfileModel;