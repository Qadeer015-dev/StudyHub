const pool = require('../config/db');

class ClassSubjectModel {
    static async assignSubjectToClass(data) {
        const { academy_id, class_grade_id, subject_id, is_compulsory = true } = data;
        const [result] = await pool.execute(
            `INSERT INTO class_subjects (academy_id, class_grade_id, subject_id, is_compulsory) 
             VALUES (?, ?, ?, ?)`,
            [academy_id, class_grade_id, subject_id, is_compulsory]
        );
        return result.insertId;
    }

    static async findByClass(classGradeId, academyId = null) {
        let query = `
            SELECT cs.*, s.name as subject_name, s.display_name as subject_display_name, s.subject_code, s.difficulty_level
            FROM class_subjects cs
            JOIN subjects s ON cs.subject_id = s.id
            WHERE cs.class_grade_id = ? AND cs.is_active = TRUE
        `;
        const params = [classGradeId];
        if (academyId) {
            query += ' AND cs.academy_id = ?';
            params.push(academyId);
        }
        const [rows] = await pool.execute(query, params);
        return rows;
    }

    static async findBySubject(subjectId, academyId = null) {
        let query = `
            SELECT cs.*, cg.name as class_name, cg.display_name as class_display_name, cg.grade_level
            FROM class_subjects cs
            JOIN class_grades cg ON cs.class_grade_id = cg.id
            WHERE cs.subject_id = ? AND cs.is_active = TRUE
        `;
        const params = [subjectId];
        if (academyId) {
            query += ' AND cs.academy_id = ?';
            params.push(academyId);
        }
        const [rows] = await pool.execute(query, params);
        return rows;
    }

    static async findById(id, academyId = null) {
        let query = 'SELECT * FROM class_subjects WHERE id = ?';
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
            `UPDATE class_subjects SET ${fields} WHERE id = ?`,
            [...values, id]
        );
        return result.affectedRows > 0;
    }

    static async softDelete(id) {
        const [result] = await pool.execute(
            'UPDATE class_subjects SET is_active = FALSE WHERE id = ?',
            [id]
        );
        return result.affectedRows > 0;
    }
}

module.exports = ClassSubjectModel;