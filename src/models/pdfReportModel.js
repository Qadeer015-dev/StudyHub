const pool = require('../config/db');

class PDFReportModel {
    static async create(data) {
        const {
            academy_id, report_type, student_id = null, class_grade_id = null,
            academic_period = null, report_data, file_path = null, file_name = null,
            generated_by, expires_at = null
        } = data;

        const [result] = await pool.execute(
            `INSERT INTO pdf_reports 
            (academy_id, report_type, student_id, class_grade_id, academic_period, 
             report_data, file_path, file_name, generated_by, expires_at) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [academy_id, report_type, student_id, class_grade_id, academic_period,
                JSON.stringify(report_data), file_path, file_name, generated_by, expires_at]
        );
        return result.insertId;
    }

    static async findAll(academyId, filters = {}) {
        let query = `
        SELECT pr.*, u.full_name as generated_by_name,
               sp.roll_number, sp.admission_number,
               stu.full_name as student_name,
               cg.name as class_name
        FROM pdf_reports pr
        JOIN users u ON pr.generated_by = u.id
        LEFT JOIN student_profiles sp ON pr.student_id = sp.id
        LEFT JOIN users stu ON sp.user_id = stu.id
        LEFT JOIN class_grades cg ON pr.class_grade_id = cg.id
        WHERE pr.academy_id = ?`;
        const params = [academyId];

        if (filters.report_type) {
            query += ' AND pr.report_type = ?';
            params.push(filters.report_type);
        }
        if (filters.student_id) {
            query += ' AND pr.student_id = ?';
            params.push(filters.student_id);
        }
        if (filters.class_grade_id) {
            query += ' AND pr.class_grade_id = ?';
            params.push(filters.class_grade_id);
        }
        query += ' ORDER BY pr.generated_at DESC';
        const [rows] = await pool.execute(query, params);
        return rows.map(r => ({
            ...r,
            report_data: typeof r.report_data === 'string' ? JSON.parse(r.report_data) : r.report_data
        }));
    }

    static async findById(id, academyId = null) {
        let query = 'SELECT * FROM pdf_reports WHERE id = ?';
        const params = [id];
        if (academyId) {
            query += ' AND academy_id = ?';
            params.push(academyId);
        }
        const [rows] = await pool.execute(query, params);
        if (!rows[0]) return null;
        const report = rows[0];
        report.report_data = typeof report.report_data === 'string' ? JSON.parse(report.report_data) : report.report_data;
        return report;
    }

    static async delete(id) {
        const [result] = await pool.execute('DELETE FROM pdf_reports WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
}

module.exports = PDFReportModel;