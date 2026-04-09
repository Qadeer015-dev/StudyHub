const pool = require('../config/db');

class StudentLessonProgressModel {
    static async createOrUpdate(data) {
        const { academy_id, student_id, lesson_id, status, mastery_level, notes, start_date, completion_date } = data;
        const [result] = await pool.execute(
            `INSERT INTO student_lesson_progress 
            (academy_id, student_id, lesson_id, status, mastery_level, notes, start_date, completion_date) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE 
                status = VALUES(status),
                mastery_level = VALUES(mastery_level),
                notes = VALUES(notes),
                start_date = VALUES(start_date),
                completion_date = VALUES(completion_date)`,
            [academy_id, student_id, lesson_id, status, mastery_level, notes, start_date, completion_date]
        );
        return result.affectedRows > 0;
    }

    static async findByStudent(studentId, classSubjectId = null, academyId = null) {
        let query = `
            SELECT slp.*, l.title, l.lesson_order, l.chapter_number, l.chapter_name,
                   cs.class_grade_id, cs.subject_id
            FROM student_lesson_progress slp
            JOIN lessons l ON slp.lesson_id = l.id
            JOIN class_subjects cs ON l.class_subject_id = cs.id
            WHERE slp.student_id = ?`;
        const params = [studentId];
        if (classSubjectId) {
            query += ' AND l.class_subject_id = ?';
            params.push(classSubjectId);
        }
        if (academyId) {
            query += ' AND slp.academy_id = ?';
            params.push(academyId);
        }
        query += ' ORDER BY l.lesson_order ASC';
        const [rows] = await pool.execute(query, params);
        return rows;
    }

    static async findByLesson(lessonId, academyId = null) {
        let query = `
            SELECT slp.*, sp.roll_number, u.full_name as student_name
            FROM student_lesson_progress slp
            JOIN student_profiles sp ON slp.student_id = sp.id
            JOIN users u ON sp.user_id = u.id
            WHERE slp.lesson_id = ?`;
        const params = [lessonId];
        if (academyId) {
            query += ' AND slp.academy_id = ?';
            params.push(academyId);
        }
        const [rows] = await pool.execute(query, params);
        return rows;
    }
}

module.exports = StudentLessonProgressModel;