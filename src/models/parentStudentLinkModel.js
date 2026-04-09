const pool = require('../config/db');

class ParentStudentLinkModel {
    static async create(data) {
        const { academy_id, parent_id, student_id, relation, is_primary = false } = data;
        const [result] = await pool.execute(
            `INSERT INTO parent_student_links (academy_id, parent_id, student_id, relation, is_primary) 
             VALUES (?, ?, ?, ?, ?)`,
            [academy_id, parent_id, student_id, relation, is_primary]
        );
        return result.insertId;
    }

    static async findByParent(parentId, academyId = null) {
        let query = `
            SELECT psl.*, sp.roll_number, sp.admission_number, u.full_name as student_name
            FROM parent_student_links psl
            JOIN student_profiles sp ON psl.student_id = sp.id
            JOIN users u ON sp.user_id = u.id
            WHERE psl.parent_id = ?`;
        const params = [parentId];
        if (academyId) {
            query += ' AND psl.academy_id = ?';
            params.push(academyId);
        }
        const [rows] = await pool.execute(query, params);
        return rows;
    }

    static async findByStudent(studentId, academyId = null) {
        let query = `
            SELECT psl.*, pp.id as parent_profile_id, u.full_name as parent_name, u.email, u.phone
            FROM parent_student_links psl
            JOIN parent_profiles pp ON psl.parent_id = pp.id
            JOIN users u ON pp.user_id = u.id
            WHERE psl.student_id = ?`;
        const params = [studentId];
        if (academyId) {
            query += ' AND psl.academy_id = ?';
            params.push(academyId);
        }
        const [rows] = await pool.execute(query, params);
        return rows;
    }

    static async delete(parentId, studentId) {
        const [result] = await pool.execute(
            'DELETE FROM parent_student_links WHERE parent_id = ? AND student_id = ?',
            [parentId, studentId]
        );
        return result.affectedRows > 0;
    }

    static async update(id, data) {
        const fields = Object.keys(data).map(key => `${key} = ?`).join(', ');
        const values = Object.values(data);
        const [result] = await pool.execute(
            `UPDATE parent_student_links SET ${fields} WHERE id = ?`,
            [...values, id]
        );
        return result.affectedRows > 0;
    }
}

module.exports = ParentStudentLinkModel;