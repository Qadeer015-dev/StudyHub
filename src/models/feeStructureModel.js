const pool = require('../config/db');

class FeeStructureModel {
    static async create(data) {
        const {
            academy_id, class_grade_id, subject_id = null, fee_type, amount,
            frequency, description = null, effective_from, effective_to = null
        } = data;

        const [result] = await pool.execute(
            `INSERT INTO fee_structures 
            (academy_id, class_grade_id, subject_id, fee_type, amount, frequency, description, effective_from, effective_to) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [academy_id, class_grade_id, subject_id, fee_type, amount, frequency, description, effective_from, effective_to]
        );
        return result.insertId;
    }

    static async findById(id, academyId = null) {
        let query = 'SELECT * FROM fee_structures WHERE id = ? AND deleted_at IS NULL';
        const params = [id];
        if (academyId) {
            query += ' AND academy_id = ?';
            params.push(academyId);
        }
        const [rows] = await pool.execute(query, params);
        return rows[0];
    }

    static async findAll(academyId, filters = {}) {
        let query = 'SELECT * FROM fee_structures WHERE deleted_at IS NULL AND academy_id = ?';
        const params = [academyId];

        if (filters.class_grade_id) {
            query += ' AND class_grade_id = ?';
            params.push(filters.class_grade_id);
        }
        if (filters.fee_type) {
            query += ' AND fee_type = ?';
            params.push(filters.fee_type);
        }
        if (filters.is_active !== undefined) {
            query += ' AND is_active = ?';
            params.push(filters.is_active);
        }
        query += ' ORDER BY effective_from DESC';
        const [rows] = await pool.execute(query, params);
        return rows;
    }

    static async update(id, data) {
        const fields = Object.keys(data).map(key => `${key} = ?`).join(', ');
        const values = Object.values(data);
        const [result] = await pool.execute(
            `UPDATE fee_structures SET ${fields} WHERE id = ?`,
            [...values, id]
        );
        return result.affectedRows > 0;
    }

    static async softDelete(id) {
        const [result] = await pool.execute(
            'UPDATE fee_structures SET deleted_at = NOW() WHERE id = ?',
            [id]
        );
        return result.affectedRows > 0;
    }

    static async getStudentApplicableFees(studentId, academyId) {
        // Get student's class grade
        const [studentRows] = await pool.execute(
            `SELECT class_grade_id FROM student_profiles WHERE id = ? AND academy_id = ?`,
            [studentId, academyId]
        );
        if (!studentRows.length) return [];
        const classGradeId = studentRows[0].class_grade_id;
        if (!classGradeId) return [];

        // Get active fee structures for that class
        const [feeRows] = await pool.execute(
            `SELECT * FROM fee_structures 
             WHERE academy_id = ? AND class_grade_id = ? AND is_active = TRUE 
             AND (effective_to IS NULL OR effective_to >= CURDATE()) 
             AND deleted_at IS NULL`,
            [academyId, classGradeId]
        );
        return feeRows;
    }
}

module.exports = FeeStructureModel;