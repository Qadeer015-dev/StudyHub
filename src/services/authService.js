const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const UserModel = require('../models/userModel');
const UserRoleModel = require('../models/userRoleModel');
const AppError = require('../utils/AppError');

class AuthService {
    static async register(userData) {
        const { email, phone, password, full_name, role, academy_id } = userData;

        // Check if email exists
        const existingUser = await UserModel.findByEmail(email);
        if (existingUser) {
            throw new AppError('User with this email already exists', 409);
        }

        // Check if phone exists (if provided)
        if (phone) {
            const existingPhone = await UserModel.findByPhone(phone);
            if (existingPhone) {
                throw new AppError('User with this phone number already exists', 409);
            }
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);
        console.log(password_hash);
        // Create user
        const newUser = {
            uuid: uuidv4(),
            academy_id: academy_id || null,
            email,
            phone: phone || null,
            password_hash,
            full_name
        };

        const userId = await UserModel.create(newUser);

        // Assign role
        await UserRoleModel.assignRole(userId, role, academy_id || null);

        // Generate JWT
        const token = this.generateToken({ id: userId, uuid: newUser.uuid, email });

        return {
            user: {
                id: userId,
                uuid: newUser.uuid,
                email,
                full_name,
                role
            },
            token
        };
    }

    static async login(email, password) {
        // Find user
        const user = await UserModel.findByEmail(email);
        if (!user) {
            throw new AppError('Invalid email or password', 401);
        }

        // Check if user is active
        if (!user.is_active) {
            throw new AppError('Your account has been deactivated. Please contact support.', 403);
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password_hash);
        if (!isPasswordValid) {
            throw new AppError('Invalid email or password', 401);
        }

        // Get user roles
        const roles = await UserRoleModel.getUserRoles(user.id, user.academy_id);
        if (roles.length === 0) {
            throw new AppError('No active role found for this user', 403);
        }

        // Update last login
        await UserModel.updateLastLogin(user.id);

        // Generate token with roles
        const token = this.generateToken({
            id: user.id,
            uuid: user.uuid,
            full_name: user.full_name,
            email: user.email,
            academy_id: user.academy_id,
            roles: roles.map(r => ({ role: r.role, academy_id: r.academy_id }))
        });

        return {
            user: {
                id: user.id,
                uuid: user.uuid,
                email: user.email,
                full_name: user.full_name,
                academy_id: user.academy_id,
                roles
            },
            token
        };
    }

    static generateToken(payload) {
        return jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN || '7d'
        });
    }

    static verifyToken(token) {
        try {
            return jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            throw new AppError('Invalid or expired token', 401);
        }
    }

    static async changePassword(userId, currentPassword, newPassword) {
        const user = await UserModel.findByIdWithPassword(userId);
        if (!user) {
            throw new AppError('User not found', 404);
        }

        const isPasswordValid = await bcrypt.compare(currentPassword, user.password_hash);
        if (!isPasswordValid) {
            throw new AppError('Current password is incorrect', 401);
        }

        const salt = await bcrypt.genSalt(10);
        const newPasswordHash = await bcrypt.hash(newPassword, salt);

        await UserModel.update(userId, { password_hash: newPasswordHash });
        return { message: 'Password changed successfully' };
    }
}

module.exports = AuthService;