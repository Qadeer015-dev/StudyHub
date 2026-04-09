const pool = require('../config/db');

class SalaryPaymentModel {
    static async create(data) {
        const {
            academy_id, teacher_id, amount, payment_date, payment_method,
            transaction_id = null, for_month, for_year, deductions = 0,
            net_amount, status = 'pending', remarks = null
        } = data;

        const [result] = await pool.execute(
            `INSERT INTO salary_payments 
            (academy_id, teacher_id, amount, payment_date, payment_method, transaction_id, 
             for_month, for_year, deductions, net_amount, status, remarks) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [academy_id, teacher_id, amount, payment_date, payment_method, transaction_id,
                for_month, for_year, deductions, net_amount, status, remarks]
        );
        return result.insertId;
    }

    static async findById(id, academyId = null) {
        let query = 'SELECT * FROM salary_payments WHERE id = ?';
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
            SELECT * FROM salary_payments 
            WHERE teacher_id = ?`;
        const params = [teacherId];
        if (academyId) {
            query += ' AND academy_id = ?';
            params.push(academyId);
        }
        query += ' ORDER BY payment_date DESC, created_at DESC';
        const [rows] = await pool.execute(query, params);
        return rows;
    }

    static async findAll(academyId, filters = {}) {
        let query = `
            SELECT sp.*, u.full_name as teacher_name, u.email as teacher_email
            FROM salary_payments sp
            JOIN users u ON sp.teacher_id = u.id
            WHERE sp.academy_id = ?`;
        const params = [academyId];

        if (filters.teacher_id) {
            query += ' AND sp.teacher_id = ?';
            params.push(filters.teacher_id);
        }
        if (filters.status) {
            query += ' AND sp.status = ?';
            params.push(filters.status);
        }
        if (filters.for_month) {
            query += ' AND sp.for_month = ?';
            params.push(filters.for_month);
        }
        if (filters.for_year) {
            query += ' AND sp.for_year = ?';
            params.push(filters.for_year);
        }
        query += ' ORDER BY sp.payment_date DESC';
        const [rows] = await pool.execute(query, params);
        return rows;
    }

    static async update(id, data) {
        const fields = Object.keys(data).map(key => `${key} = ?`).join(', ');
        const values = Object.values(data);
        const [result] = await pool.execute(
            `UPDATE salary_payments SET ${fields} WHERE id = ?`,
            [...values, id]
        );
        return result.affectedRows > 0;
    }

    static async delete(id) {
        const [result] = await pool.execute('DELETE FROM salary_payments WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
}

module.exports = SalaryPaymentModel;