const pool = require('../config/db');
const FeeStructureModel = require('./feeStructureModel'); // <-- Add this line

class FeePaymentModel {
    static async create(data) {
        const {
            academy_id, student_id, amount, payment_date, payment_method,
            transaction_id = null, status = 'pending', for_month, for_year,
            late_fee = 0, discount = 0, remarks = null, receipt_number, paid_by = null
        } = data;

        const [result] = await pool.execute(
            `INSERT INTO fee_payments 
            (academy_id, student_id, amount, payment_date, payment_method, transaction_id, 
             status, for_month, for_year, late_fee, discount, remarks, receipt_number, paid_by) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [academy_id, student_id, amount, payment_date, payment_method, transaction_id,
                status, for_month, for_year, late_fee, discount, remarks, receipt_number, paid_by]
        );
        return result.insertId;
    }

    static async findById(id, academyId = null) {
        let query = 'SELECT * FROM fee_payments WHERE id = ? AND deleted_at IS NULL';
        const params = [id];
        if (academyId) {
            query += ' AND academy_id = ?';
            params.push(academyId);
        }
        const [rows] = await pool.execute(query, params);
        return rows[0];
    }

    static async findByStudent(studentId, academyId = null) {
        let query = `
            SELECT fp.*, u.full_name as paid_by_name
            FROM fee_payments fp
            LEFT JOIN users u ON fp.paid_by = u.id
            WHERE fp.student_id = ? AND fp.deleted_at IS NULL`;
        const params = [studentId];
        if (academyId) {
            query += ' AND fp.academy_id = ?';
            params.push(academyId);
        }
        query += ' ORDER BY fp.payment_date DESC, fp.created_at DESC';
        const [rows] = await pool.execute(query, params);
        return rows;
    }

    static async findAll(academyId, filters = {}) {
        let query = `
            SELECT fp.*, sp.roll_number, sp.admission_number, u.full_name as student_name
            FROM fee_payments fp
            JOIN student_profiles sp ON fp.student_id = sp.id
            JOIN users u ON sp.user_id = u.id
            WHERE fp.deleted_at IS NULL AND fp.academy_id = ?`;
        const params = [academyId];

        if (filters.student_id) {
            query += ' AND fp.student_id = ?';
            params.push(filters.student_id);
        }
        if (filters.status) {
            query += ' AND fp.status = ?';
            params.push(filters.status);
        }
        if (filters.for_month) {
            query += ' AND fp.for_month = ?';
            params.push(filters.for_month);
        }
        if (filters.for_year) {
            query += ' AND fp.for_year = ?';
            params.push(filters.for_year);
        }
        query += ' ORDER BY fp.payment_date DESC';
        const [rows] = await pool.execute(query, params);
        return rows;
    }

    static async update(id, data) {
        const fields = Object.keys(data).map(key => `${key} = ?`).join(', ');
        const values = Object.values(data);
        const [result] = await pool.execute(
            `UPDATE fee_payments SET ${fields} WHERE id = ?`,
            [...values, id]
        );
        return result.affectedRows > 0;
    }

    static async softDelete(id) {
        const [result] = await pool.execute(
            'UPDATE fee_payments SET deleted_at = NOW() WHERE id = ?',
            [id]
        );
        return result.affectedRows > 0;
    }

    static async generateReceiptNumber(academyId) {
        const year = new Date().getFullYear();
        const [rows] = await pool.execute(
            `SELECT COUNT(*) as count FROM fee_payments WHERE academy_id = ? AND YEAR(created_at) = ?`,
            [academyId, year]
        );
        const count = rows[0].count + 1;
        return `RCP-${academyId}-${year}-${count.toString().padStart(5, '0')}`;
    }

    static async getStudentBalance(studentId, academyId) {
        // This would need a proper ledger implementation; simplified version
        const applicableFees = await FeeStructureModel.getStudentApplicableFees(studentId, academyId);
        const totalExpected = applicableFees.reduce((sum, f) => sum + parseFloat(f.amount), 0);

        const [paymentRows] = await pool.execute(
            `SELECT SUM(amount) as total_paid FROM fee_payments 
             WHERE student_id = ? AND academy_id = ? AND status = 'paid' AND deleted_at IS NULL`,
            [studentId, academyId]
        );
        const totalPaid = parseFloat(paymentRows[0].total_paid) || 0;
        return totalExpected - totalPaid;
    }
}

module.exports = FeePaymentModel;