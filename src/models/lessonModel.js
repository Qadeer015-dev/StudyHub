const pool = require('../config/db');

class LessonModel {
    static async create(data) {
        const {
            academy_id, class_subject_id, title, description = null,
            chapter_number = null, chapter_name = null, page_numbers = null,
            lesson_order, estimated_duration_minutes = null
        } = data;

        const [result] = await pool.execute(
            `INSERT INTO lessons 
            (academy_id, class_subject_id, title, description, chapter_number, chapter_name, 
             page_numbers, lesson_order, estimated_duration_minutes) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [academy_id, class_subject_id, title, description, chapter_number, chapter_name,
                page_numbers, lesson_order, estimated_duration_minutes]
        );
        return result.insertId;
    }

    static async findById(id, academyId = null) {
        let query = 'SELECT * FROM lessons WHERE id = ? AND deleted_at IS NULL';
        const params = [id];
        if (academyId) {
            query += ' AND academy_id = ?';
            params.push(academyId);
        }
        const [rows] = await pool.execute(query, params);
        return rows[0];
    }

    static async findByClassSubject(classSubjectId, academyId = null) {
        let query = `
            SELECT l.*, cs.class_grade_id, cs.subject_id 
            FROM lessons l
            JOIN class_subjects cs ON l.class_subject_id = cs.id
            WHERE l.class_subject_id = ? AND l.deleted_at IS NULL`;
        const params = [classSubjectId];
        if (academyId) {
            query += ' AND l.academy_id = ?';
            params.push(academyId);
        }
        query += ' ORDER BY l.lesson_order ASC';
        const [rows] = await pool.execute(query, params);
        return rows;
    }

    static async update(id, data) {
        const fields = Object.keys(data).map(key => `${key} = ?`).join(', ');
        const values = Object.values(data);
        const [result] = await pool.execute(
            `UPDATE lessons SET ${fields} WHERE id = ?`,
            [...values, id]
        );
        return result.affectedRows > 0;
    }

    static async softDelete(id) {
        const [result] = await pool.execute(
            'UPDATE lessons SET deleted_at = NOW() WHERE id = ?',
            [id]
        );
        return result.affectedRows > 0;
    }
}

module.exports = LessonModel;