const pool = require('../config/db');

class AcademyModel {
    static async create(academyData) {
        const {
            uuid,
            name,
            registration_number = null,
            street = null,
            city = null,
            state = null,
            country = null,
            postal_code = null,
            academy_email,
            establishment_date = null,
            website = null,
            logo_url = null,
            description = null
        } = academyData;

        const [result] = await pool.execute(
            `INSERT INTO academies 
    (uuid, name, registration_number, street, city, state, country, postal_code, academy_email, establishment_date, website, logo_url, description)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                uuid, name, registration_number, street, city, state, country, postal_code,
                academy_email, establishment_date,
                website, logo_url, description
            ]
        );

        return result.insertId;
    }

    static async findAll(filter = {}) {
        let query = 'SELECT * FROM academies WHERE deleted_at IS NULL';
        const params = [];

        if (filter.status) {
            query += ' AND status = ?';
            params.push(filter.status);
        }

        const [rows] = await pool.execute(query, params);
        return rows;
    }

    static async findById(id) {
        const [rows] = await pool.execute(
            'SELECT * FROM academies WHERE id = ? AND deleted_at IS NULL',
            [id]
        );
        return rows[0];
    }

    static async findByUuid(uuid) {
        const [rows] = await pool.execute(
            'SELECT * FROM academies WHERE uuid = ? AND deleted_at IS NULL',
            [uuid]
        );
        return rows[0];
    }

    static async findByEmail(academy_email) {
        const [rows] = await pool.execute(
            'SELECT * FROM academies WHERE academy_email = ? AND deleted_at IS NULL',
            [academy_email]
        );
        return rows[0];
    }

    static async update(id, updateData) {
        const fields = Object.keys(updateData).map(key => `${key} = ?`).join(', ');
        const values = Object.values(updateData);

        const [result] = await pool.execute(
            `UPDATE academies SET ${fields} WHERE id = ?`,
            [...values, id]
        );
        return result.affectedRows > 0;
    }

    static async softDelete(id) {
        const [result] = await pool.execute(
            'UPDATE academies SET deleted_at = NOW() WHERE id = ?',
            [id]
        );
        return result.affectedRows > 0;
    }

    static async hardDelete(id) {
        const [result] = await pool.execute(
            'DELETE FROM academies WHERE id = ?',
            [id]
        );
        return result.affectedRows > 0;
    }
}

module.exports = AcademyModel;