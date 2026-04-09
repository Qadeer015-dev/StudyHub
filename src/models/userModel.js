const pool = require('../config/db');

class UserModel {
    static async create(userData) {
        const {
            uuid,
            academy_id = null,
            email,
            phone = null,
            password_hash,
            full_name,
            date_of_birth = null,
            gender = null,
            address = null,
            city = null,
            state = null,
            country = null,
            postal_code = null,
            profile_image = null
        } = userData;

        const [result] = await pool.execute(
            `INSERT INTO users 
            (uuid, academy_id, email, phone, password_hash, full_name, date_of_birth, gender, address, city, state, country, postal_code, profile_image) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                uuid, academy_id, email, phone, password_hash, full_name, date_of_birth, gender,
                address, city, state, country, postal_code, profile_image
            ]
        );
        return result.insertId;
    }

    static async findById(id) {
        const [rows] = await pool.execute(
            `SELECT id, uuid, academy_id, email, phone, full_name, date_of_birth, gender, 
            address, city, state, country, postal_code, profile_image, is_verified, is_active, 
            last_login, created_at, updated_at 
            FROM users WHERE id = ? AND deleted_at IS NULL`,
            [id]
        );
        return rows[0];
    }

    static async findByEmail(email) {
        const [rows] = await pool.execute(
            `SELECT id, uuid, academy_id, email, phone, password_hash, full_name, date_of_birth, 
            gender, address, city, state, country, postal_code, profile_image, is_verified, 
            is_active, last_login, created_at, updated_at 
            FROM users WHERE email = ? AND deleted_at IS NULL`,
            [email]
        );
        return rows[0];
    }

    static async findByPhone(phone) {
        if (!phone) return null;
        const [rows] = await pool.execute(
            `SELECT id, uuid, academy_id, email, phone, password_hash, full_name 
            FROM users WHERE phone = ? AND deleted_at IS NULL`,
            [phone]
        );
        return rows[0];
    }

    static async findByUuid(uuid) {
        const [rows] = await pool.execute(
            `SELECT id, uuid, academy_id, email, phone, full_name, date_of_birth, gender, 
            address, city, state, country, postal_code, profile_image, is_verified, is_active, 
            last_login, created_at, updated_at 
            FROM users WHERE uuid = ? AND deleted_at IS NULL`,
            [uuid]
        );
        return rows[0];
    }

    static async update(id, updateData) {
        const fields = Object.keys(updateData).map(key => `${key} = ?`).join(', ');
        const values = Object.values(updateData);

        const [result] = await pool.execute(
            `UPDATE users SET ${fields} WHERE id = ?`,
            [...values, id]
        );
        return result.affectedRows > 0;
    }

    static async updateLastLogin(id) {
        await pool.execute(
            'UPDATE users SET last_login = NOW() WHERE id = ?',
            [id]
        );
    }

    static async softDelete(id) {
        const [result] = await pool.execute(
            'UPDATE users SET deleted_at = NOW() WHERE id = ?',
            [id]
        );
        return result.affectedRows > 0;
    }

    static async findAll(filter = {}) {
        let query = `SELECT id, uuid, academy_id, email, phone, full_name, is_active, created_at 
                    FROM users WHERE deleted_at IS NULL`;
        const params = [];

        if (filter.academy_id) {
            query += ' AND academy_id = ?';
            params.push(filter.academy_id);
        }
        if (filter.is_active !== undefined) {
            query += ' AND is_active = ?';
            params.push(filter.is_active);
        }

        const [rows] = await pool.execute(query, params);
        return rows;
    }

    static async findByIdWithPassword(id) {
        const [rows] = await pool.execute(
            'SELECT * FROM users WHERE id = ? AND deleted_at IS NULL',
            [id]
        );
        return rows[0];
    }
}

module.exports = UserModel;