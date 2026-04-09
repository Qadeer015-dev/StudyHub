const pool = require('../config/db');

class ClassGradeModel {
    static async create(data) {
        const {
            academy_id,
            name,
            display_name,
            grade_level,
            description = null
        } = data;

        const [result] = await pool.execute(
            `INSERT INTO class_grades (academy_id, name, display_name, grade_level, description) 
             VALUES (?, ?, ?, ?, ?)`,
            [academy_id, name, display_name, grade_level, description]
        );
        return result.insertId;
    }

    static async findAll(academyId = null) {
        let query = 'SELECT * FROM class_grades WHERE deleted_at IS NULL';
        const params = [];
        if (academyId) {
            query += ' AND academy_id = ?';
            params.push(academyId);
        }
        query += ' ORDER BY grade_level ASC';
        const [rows] = await pool.execute(query, params);
        return rows;
    }

    static async findById(id, academyId = null) {
        let query = 'SELECT * FROM class_grades WHERE id = ? AND deleted_at IS NULL';
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
            `UPDATE class_grades SET ${fields} WHERE id = ?`,
            [...values, id]
        );
        return result.affectedRows > 0;
    }

    static async softDelete(id) {
        const [result] = await pool.execute(
            'UPDATE class_grades SET deleted_at = NOW() WHERE id = ?',
            [id]
        );
        return result.affectedRows > 0;
    }
}

module.exports = ClassGradeModel;