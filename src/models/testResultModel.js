const pool = require('../config/db');

class TestResultModel {
    static async create(data) {
        const { academy_id, test_id, student_id, obtained_marks, grade = null, remarks = null } = data;
        const [result] = await pool.execute(
            `INSERT INTO test_results (academy_id, test_id, student_id, obtained_marks, grade, remarks) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [academy_id, test_id, student_id, obtained_marks, grade, remarks]
        );
        return result.insertId;
    }

    static async bulkCreate(records) {
        if (!records.length) return 0;
        const values = records.map(r => [
            r.academy_id, r.test_id, r.student_id, r.obtained_marks, r.grade || null, r.remarks || null
        ]);
        const placeholders = records.map(() => '(?, ?, ?, ?, ?, ?)').join(', ');
        const flatValues = values.flat();
        const [result] = await pool.execute(
            `INSERT INTO test_results (academy_id, test_id, student_id, obtained_marks, grade, remarks) 
             VALUES ${placeholders}
             ON DUPLICATE KEY UPDATE obtained_marks = VALUES(obtained_marks), grade = VALUES(grade), remarks = VALUES(remarks)`,
            flatValues
        );
        return result.affectedRows;
    }

    static async findByTest(testId, academyId = null) {
        let query = `
            SELECT tr.*, sp.roll_number, u.full_name as student_name
            FROM test_results tr
            JOIN student_profiles sp ON tr.student_id = sp.id
            JOIN users u ON sp.user_id = u.id
            WHERE tr.test_id = ?`;
        const params = [testId];
        if (academyId) {
            query += ' AND tr.academy_id = ?';
            params.push(academyId);
        }
        const [rows] = await pool.execute(query, params);
        return rows;
    }

    static async findByStudent(studentId, academyId = null) {
        let query = `
            SELECT tr.*, e.title, e.exam_type, e.total_marks, e.passing_marks, e.scheduled_date,
                   cs.class_grade_id, cs.subject_id
            FROM test_results tr
            JOIN exams e ON tr.test_id = e.id
            JOIN class_subjects cs ON e.class_subject_id = cs.id
            WHERE tr.student_id = ?`;
        const params = [studentId];
        if (academyId) {
            query += ' AND tr.academy_id = ?';
            params.push(academyId);
        }
        query += ' ORDER BY e.scheduled_date DESC';
        const [rows] = await pool.execute(query, params);
        return rows;
    }

    static async update(id, data) {
        const fields = Object.keys(data).map(key => `${key} = ?`).join(', ');
        const values = Object.values(data);
        const [result] = await pool.execute(
            `UPDATE test_results SET ${fields} WHERE id = ?`,
            [...values, id]
        );
        return result.affectedRows > 0;
    }
}

module.exports = TestResultModel;