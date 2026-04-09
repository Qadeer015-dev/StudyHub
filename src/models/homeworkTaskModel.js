const pool = require('../config/db');

class HomeworkTaskModel {
    static async create(data) {
        const {
            academy_id, teacher_id, class_grade_id = null, subject_id = null,
            title, description = null, instructions = null, due_date = null,
            max_points = null
        } = data;

        const [result] = await pool.execute(
            `INSERT INTO homework_tasks 
            (academy_id, teacher_id, class_grade_id, subject_id, title, description, instructions, due_date, max_points) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [academy_id, teacher_id, class_grade_id, subject_id, title, description, instructions, due_date, max_points]
        );
        return result.insertId;
    }

    static async findById(id, academyId = null) {
        let query = 'SELECT * FROM homework_tasks WHERE id = ? AND deleted_at IS NULL';
        const params = [id];
        if (academyId) {
            query += ' AND academy_id = ?';
            params.push(academyId);
        }
        const [rows] = await pool.execute(query, params);
        return rows[0];
    }

    static async findAll(academyId, filters = {}) {
        let query = 'SELECT * FROM homework_tasks WHERE deleted_at IS NULL AND academy_id = ?';
        const params = [academyId];

        if (filters.class_grade_id) {
            query += ' AND class_grade_id = ?';
            params.push(filters.class_grade_id);
        }
        if (filters.subject_id) {
            query += ' AND subject_id = ?';
            params.push(filters.subject_id);
        }
        if (filters.teacher_id) {
            query += ' AND teacher_id = ?';
            params.push(filters.teacher_id);
        }
        query += ' ORDER BY due_date ASC';
        const [rows] = await pool.execute(query, params);
        return rows;
    }

    static async update(id, data) {
        const fields = Object.keys(data).map(key => `${key} = ?`).join(', ');
        const values = Object.values(data);
        const [result] = await pool.execute(
            `UPDATE homework_tasks SET ${fields} WHERE id = ?`,
            [...values, id]
        );
        return result.affectedRows > 0;
    }

    static async softDelete(id) {
        const [result] = await pool.execute(
            'UPDATE homework_tasks SET deleted_at = NOW() WHERE id = ?',
            [id]
        );
        return result.affectedRows > 0;
    }
}

module.exports = HomeworkTaskModel;