const pool = require('../config/db');

class TeacherSalaryModel {
    static async create(data) {
        const {
            academy_id, teacher_id, salary_type, base_salary, subject_id = null,
            class_grade_id = null, experience_years = null, qualification_bonus = 0,
            performance_bonus = 0, total_salary, effective_from, effective_to = null
        } = data;

        const [result] = await pool.execute(
            `INSERT INTO teacher_salaries 
            (academy_id, teacher_id, salary_type, base_salary, subject_id, class_grade_id, 
             experience_years, qualification_bonus, performance_bonus, total_salary, 
             effective_from, effective_to) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [academy_id, teacher_id, salary_type, base_salary, subject_id, class_grade_id,
                experience_years, qualification_bonus, performance_bonus, total_salary,
                effective_from, effective_to]
        );
        return result.insertId;
    }

    static async findById(id, academyId = null) {
        let query = 'SELECT * FROM teacher_salaries WHERE id = ? AND deleted_at IS NULL';
        const params = [id];
        if (academyId) {
            query += ' AND academy_id = ?';
            params.push(academyId);
        }
        const [rows] = await pool.execute(query, params);
        return rows[0];
    }

    static async findByTeacher(teacherId, academyId = null) {
        let query = `
            SELECT ts.*, s.name as subject_name, cg.name as class_name
            FROM teacher_salaries ts
            LEFT JOIN subjects s ON ts.subject_id = s.id
            LEFT JOIN class_grades cg ON ts.class_grade_id = cg.id
            WHERE ts.teacher_id = ? AND ts.deleted_at IS NULL`;
        const params = [teacherId];
        if (academyId) {
            query += ' AND ts.academy_id = ?';
            params.push(academyId);
        }
        query += ' ORDER BY ts.effective_from DESC';
        const [rows] = await pool.execute(query, params);
        return rows;
    }

    static async findActive(teacherId, academyId = null) {
        let query = `
            SELECT * FROM teacher_salaries 
            WHERE teacher_id = ? AND is_active = TRUE AND deleted_at IS NULL
            AND (effective_to IS NULL OR effective_to >= CURDATE())`;
        const params = [teacherId];
        if (academyId) {
            query += ' AND academy_id = ?';
            params.push(academyId);
        }
        const [rows] = await pool.execute(query, params);
        return rows[0];
    }

    static async findAll(academyId, filters = {}) {
        let query = `
            SELECT ts.*, u.full_name as teacher_name, u.email as teacher_email
            FROM teacher_salaries ts
            JOIN users u ON ts.teacher_id = u.id
            WHERE ts.deleted_at IS NULL AND ts.academy_id = ?`;
        const params = [academyId];

        if (filters.teacher_id) {
            query += ' AND ts.teacher_id = ?';
            params.push(filters.teacher_id);
        }
        if (filters.is_active !== undefined) {
            query += ' AND ts.is_active = ?';
            params.push(filters.is_active);
        }
        query += ' ORDER BY ts.effective_from DESC';
        const [rows] = await pool.execute(query, params);
        return rows;
    }

    static async update(id, data) {
        const fields = Object.keys(data).map(key => `${key} = ?`).join(', ');
        const values = Object.values(data);
        const [result] = await pool.execute(
            `UPDATE teacher_salaries SET ${fields} WHERE id = ?`,
            [...values, id]
        );
        return result.affectedRows > 0;
    }

    static async softDelete(id) {
        const [result] = await pool.execute(
            'UPDATE teacher_salaries SET deleted_at = NOW() WHERE id = ?',
            [id]
        );
        return result.affectedRows > 0;
    }
}

module.exports = TeacherSalaryModel;