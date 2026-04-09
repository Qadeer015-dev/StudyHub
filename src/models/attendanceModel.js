const pool = require('../config/db');

class AttendanceModel {
    static async create(data) {
        const { academy_id, student_id, date, status, remarks = null, marked_by } = data;
        const [result] = await pool.execute(
            `INSERT INTO attendance (academy_id, student_id, date, status, remarks, marked_by) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [academy_id, student_id, date, status, remarks, marked_by]
        );
        return result.insertId;
    }

    static async bulkCreate(records) {
        if (!records.length) return [];
        const values = records.map(r => [
            r.academy_id, r.student_id, r.date, r.status, r.remarks || null, r.marked_by
        ]);
        const placeholders = records.map(() => '(?, ?, ?, ?, ?, ?)').join(', ');
        const flatValues = values.flat();
        const [result] = await pool.execute(
            `INSERT INTO attendance (academy_id, student_id, date, status, remarks, marked_by) 
             VALUES ${placeholders}
             ON DUPLICATE KEY UPDATE status = VALUES(status), remarks = VALUES(remarks), marked_by = VALUES(marked_by)`,
            flatValues
        );
        return result.affectedRows;
    }

    static async findById(id, academyId = null) {
        let query = 'SELECT * FROM attendance WHERE id = ?';
        const params = [id];
        if (academyId) {
            query += ' AND academy_id = ?';
            params.push(academyId);
        }
        const [rows] = await pool.execute(query, params);
        return rows[0];
    }

    static async findByStudent(studentId, startDate, endDate, academyId = null) {
        let query = `SELECT * FROM attendance WHERE student_id = ? AND date BETWEEN ? AND ?`;
        const params = [studentId, startDate, endDate];
        if (academyId) {
            query += ' AND academy_id = ?';
            params.push(academyId);
        }
        query += ' ORDER BY date DESC';
        const [rows] = await pool.execute(query, params);
        return rows;
    }

    static async findByClass(classGradeId, date, academyId = null) {
        let query = `
            SELECT a.*, sp.roll_number, sp.admission_number, u.full_name as student_name
            FROM attendance a
            JOIN student_profiles sp ON a.student_id = sp.id
            JOIN users u ON sp.user_id = u.id
            WHERE sp.class_grade_id = ? AND a.date = ?`;
        const params = [classGradeId, date];
        if (academyId) {
            query += ' AND a.academy_id = ?';
            params.push(academyId);
        }
        const [rows] = await pool.execute(query, params);
        return rows;
    }

    static async getStudentStats(studentId, startDate, endDate, academyId = null) {
        let query = `
            SELECT 
                COUNT(*) as total_days,
                SUM(CASE WHEN status = 'present' THEN 1 ELSE 0 END) as present_days,
                SUM(CASE WHEN status = 'absent' THEN 1 ELSE 0 END) as absent_days,
                SUM(CASE WHEN status = 'late' THEN 1 ELSE 0 END) as late_days,
                SUM(CASE WHEN status = 'excused' THEN 1 ELSE 0 END) as excused_days,
                SUM(CASE WHEN status = 'half_day' THEN 1 ELSE 0 END) as half_days
            FROM attendance 
            WHERE student_id = ? AND date BETWEEN ? AND ?`;
        const params = [studentId, startDate, endDate];
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
            `UPDATE attendance SET ${fields} WHERE id = ?`,
            [...values, id]
        );
        return result.affectedRows > 0;
    }

    static async delete(id) {
        const [result] = await pool.execute('DELETE FROM attendance WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
}

module.exports = AttendanceModel;