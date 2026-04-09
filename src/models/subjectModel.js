const pool = require('../config/db');

class SubjectModel {
    static async create(data) {
        const {
            academy_id,
            name,
            display_name,
            subject_code = null,
            description = null,
            difficulty_level = 'intermediate'
        } = data;

        const [result] = await pool.execute(
            `INSERT INTO subjects (academy_id, name, display_name, subject_code, description, difficulty_level) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [academy_id, name, display_name, subject_code, description, difficulty_level]
        );
        return result.insertId;
    }

    static async findAll(academyId = null) {
        let query = 'SELECT * FROM subjects WHERE deleted_at IS NULL';
        const params = [];
        if (academyId) {
            query += ' AND academy_id = ?';
            params.push(academyId);
        }
        const [rows] = await pool.execute(query, params);
        return rows;
    }

    static async findById(id, academyId = null) {
        let query = 'SELECT * FROM subjects WHERE id = ? AND deleted_at IS NULL';
        const params = [id];
        if (academyId) {
            query += ' AND academy_id = ?';
            params.push(academyId);
        }
        const [rows] = await pool.execute(query, params);
        return rows[0];
    }

    static async update(id, data) {
        const fields = Object.keys(data).map(key => `${key} = ?`).join(', ');
        const values = Object.values(data);
        const [result] = await pool.execute(
            `UPDATE subjects SET ${fields} WHERE id = ?`,
            [...values, id]
        );
        return result.affectedRows > 0;
    }

    static async softDelete(id) {
        const [result] = await pool.execute(
            'UPDATE subjects SET deleted_at = NOW() WHERE id = ?',
            [id]
        );
        return result.affectedRows > 0;
    }
}

module.exports = SubjectModel;