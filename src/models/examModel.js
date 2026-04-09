const pool = require('../config/db');

class ExamModel {
    static async create(data) {
        const {
            academy_id, title, exam_type, class_subject_id, total_marks,
            passing_marks, duration_minutes = null, scheduled_date = null,
            description = null, syllabus_coverage = null
        } = data;

        const [result] = await pool.execute(
            `INSERT INTO exams 
            (academy_id, title, exam_type, class_subject_id, total_marks, passing_marks, 
             duration_minutes, scheduled_date, description, syllabus_coverage) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [academy_id, title, exam_type, class_subject_id, total_marks, passing_marks,
                duration_minutes, scheduled_date, description, syllabus_coverage]
        );
        return result.insertId;
    }

    static async findById(id, academyId = null) {
        let query = 'SELECT * FROM exams WHERE id = ? AND deleted_at IS NULL';
        const params = [id];
        if (academyId) {
            query += ' AND academy_id = ?';
            params.push(academyId);
        }
        const [rows] = await pool.execute(query, params);
        return rows[0];
    }

    static async findAll(academyId, filters = {}) {
        let query = 'SELECT * FROM exams WHERE deleted_at IS NULL AND academy_id = ?';
        const params = [academyId];

        if (filters.class_subject_id) {
            query += ' AND class_subject_id = ?';
            params.push(filters.class_subject_id);
        }
        if (filters.exam_type) {
            query += ' AND exam_type = ?';
            params.push(filters.exam_type);
        }
        query += ' ORDER BY scheduled_date DESC';
        const [rows] = await pool.execute(query, params);
        return rows;
    }

    static async update(id, data) {
        const fields = Object.keys(data).map(key => `${key} = ?`).join(', ');
        const values = Object.values(data);
        const [result] = await pool.execute(
            `UPDATE exams SET ${fields} WHERE id = ?`,
            [...values, id]
        );
        return result.affectedRows > 0;
    }

    static async softDelete(id) {
        const [result] = await pool.execute(
            'UPDATE exams SET deleted_at = NOW() WHERE id = ?',
            [id]
        );
        return result.affectedRows > 0;
    }
}

module.exports = ExamModel;