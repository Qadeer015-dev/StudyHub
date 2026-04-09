const pool = require('../config/db');

class StudentHomeworkModel {
    static async assign(taskId, studentIds, academyId) {
        if (!studentIds.length) return [];
        const values = studentIds.map(studentId => [academyId, studentId, taskId, 'assigned']);
        const placeholders = values.map(() => '(?, ?, ?, ?)').join(', ');
        const flatValues = values.flat();
        const [result] = await pool.execute(
            `INSERT INTO student_homework (academy_id, student_id, homework_id, status) 
             VALUES ${placeholders}`,
            flatValues
        );
        return result.affectedRows;
    }

    static async findByStudent(studentId, academyId, filters = {}) {
        let query = `
            SELECT sh.*, ht.title, ht.description, ht.due_date, ht.max_points, ht.subject_id, ht.class_grade_id
            FROM student_homework sh
            JOIN homework_tasks ht ON sh.homework_id = ht.id
            WHERE sh.student_id = ? AND sh.academy_id = ? AND ht.deleted_at IS NULL`;
        const params = [studentId, academyId];

        if (filters.status) {
            query += ' AND sh.status = ?';
            params.push(filters.status);
        }
        query += ' ORDER BY ht.due_date ASC';
        const [rows] = await pool.execute(query, params);
        return rows;
    }

    static async findByTask(taskId, academyId) {
        const query = `
            SELECT sh.*, sp.roll_number, u.full_name as student_name
            FROM student_homework sh
            JOIN student_profiles sp ON sh.student_id = sp.id
            JOIN users u ON sp.user_id = u.id
            WHERE sh.homework_id = ? AND sh.academy_id = ?`;
        const [rows] = await pool.execute(query, [taskId, academyId]);
        return rows;
    }

    static async updateSubmission(studentId, homeworkId, data) {
        const fields = Object.keys(data).map(key => `${key} = ?`).join(', ');
        const values = Object.values(data);
        const [result] = await pool.execute(
            `UPDATE student_homework SET ${fields} WHERE student_id = ? AND homework_id = ?`,
            [...values, studentId, homeworkId]
        );
        return result.affectedRows > 0;
    }

    static async findOne(studentId, homeworkId, academyId) {
        const [rows] = await pool.execute(
            `SELECT * FROM student_homework WHERE student_id = ? AND homework_id = ? AND academy_id = ?`,
            [studentId, homeworkId, academyId]
        );
        return rows[0];
    }
}

module.exports = StudentHomeworkModel;