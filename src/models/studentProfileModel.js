const pool = require('../config/db');

class StudentProfileModel {
    static async create(data) {
        const {
            academy_id, user_id, class_grade_id = null, roll_number = null,
            admission_number = null, date_of_admission = null, date_of_birth = null,
            gender = null, blood_group = null, height = null, weight = null,
            address = null, city = null, state = null, country = null, postal_code = null,
            emergency_contact_name = null, emergency_contact_phone = null,
            emergency_contact_relation = null, medical_conditions = null,
            allergies = null, medications = null, special_needs = null,
            previous_school = null, transfer_certificate_url = null, birth_certificate_url = null
        } = data;

        const [result] = await pool.execute(
            `INSERT INTO student_profiles 
            (academy_id, user_id, class_grade_id, roll_number, admission_number, date_of_admission, 
             date_of_birth, gender, blood_group, height, weight, address, city, state, country, postal_code,
             emergency_contact_name, emergency_contact_phone, emergency_contact_relation, 
             medical_conditions, allergies, medications, special_needs, previous_school, 
             transfer_certificate_url, birth_certificate_url) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [academy_id, user_id, class_grade_id, roll_number, admission_number, date_of_admission,
                date_of_birth, gender, blood_group, height, weight, address, city, state, country, postal_code,
                emergency_contact_name, emergency_contact_phone, emergency_contact_relation,
                medical_conditions, allergies, medications, special_needs, previous_school,
                transfer_certificate_url, birth_certificate_url]
        );
        return result.insertId;
    }

    static async findById(id, academyId = null) {
        let query = 'SELECT * FROM student_profiles WHERE id = ? AND deleted_at IS NULL';
        const params = [id];
        if (academyId) {
            query += ' AND academy_id = ?';
            params.push(academyId);
        }
        const [rows] = await pool.execute(query, params);
        return rows[0];
    }

    static async findByUserId(userId, academyId = null) {
        let query = 'SELECT * FROM student_profiles WHERE user_id = ? AND deleted_at IS NULL';
        const params = [userId];
        if (academyId) {
            query += ' AND academy_id = ?';
            params.push(academyId);
        }
        const [rows] = await pool.execute(query, params);
        return rows[0];
    }

    static async findAll(academyId = null, filters = {}) {
        let query = 'SELECT * FROM student_profiles WHERE deleted_at IS NULL';
        const params = [];
        if (academyId) {
            query += ' AND academy_id = ?';
            params.push(academyId);
        }
        if (filters.class_grade_id) {
            query += ' AND class_grade_id = ?';
            params.push(filters.class_grade_id);
        }
        if (filters.is_active !== undefined) {
            query += ' AND is_active = ?';
            params.push(filters.is_active);
        }
        const [rows] = await pool.execute(query, params);
        return rows;
    }

    static async update(id, data) {
        const fields = Object.keys(data).map(key => `${key} = ?`).join(', ');
        const values = Object.values(data);
        const [result] = await pool.execute(
            `UPDATE student_profiles SET ${fields} WHERE id = ?`,
            [...values, id]
        );
        return result.affectedRows > 0;
    }

    static async softDelete(id) {
        const [result] = await pool.execute(
            'UPDATE student_profiles SET deleted_at = NOW() WHERE id = ?',
            [id]
        );
        return result.affectedRows > 0;
    }
}

module.exports = StudentProfileModel;