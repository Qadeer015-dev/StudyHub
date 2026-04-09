const UserModel = require('../models/userModel');
const UserRoleModel = require('../models/userRoleModel');
const AppError = require('../utils/AppError');
const bcrypt = require('bcryptjs');

class UserService {
    static async getAllUsers(filter = {}) {
        return await UserModel.findAll(filter);
    }

    static async getUserById(id) {
        const user = await UserModel.findById(id);
        if (!user) {
            throw new AppError('User not found', 404);
        }

        // Get user roles
        const roles = await UserRoleModel.getUserRoles(id);
        return { ...user, roles };
    }

    static async updateUser(id, updateData, requestingUser) {
        const user = await UserModel.findById(id);
        if (!user) {
            throw new AppError('User not found', 404);
        }

        // Prevent non-admins from updating other users
        const isAdmin = requestingUser.roles?.some(r => r.role === 'admin');
        if (!isAdmin && requestingUser.id !== id) {
            throw new AppError('You can only update your own profile', 403);
        }

        // If email is being updated, check uniqueness
        if (updateData.email && updateData.email !== user.email) {
            const existing = await UserModel.findByEmail(updateData.email);
            if (existing) {
                throw new AppError('Email already in use', 409);
            }
        }

        // If phone is being updated, check uniqueness
        if (updateData.phone && updateData.phone !== user.phone) {
            const existing = await UserModel.findByPhone(updateData.phone);
            if (existing) {
                throw new AppError('Phone number already in use', 409);
            }
        }

        // Don't allow password update through this method
        delete updateData.password_hash;
        delete updateData.password;

        const updated = await UserModel.update(id, updateData);
        if (!updated) {
            throw new AppError('Failed to update user', 500);
        }

        return { message: 'User updated successfully' };
    }

    static async deleteUser(id, requestingUser) {
        const user = await UserModel.findById(id);
        if (!user) {
            throw new AppError('User not found', 404);
        }

        // Prevent self-deletion
        if (requestingUser.id === id) {
            throw new AppError('You cannot delete your own account', 400);
        }

        const deleted = await UserModel.softDelete(id);
        if (!deleted) {
            throw new AppError('Failed to delete user', 500);
        }

        return { message: 'User deleted successfully' };
    }

    static async assignRole(userId, role, academyId = null, assignedBy) {
        // Check if user exists
        const user = await UserModel.findById(userId);
        if (!user) {
            throw new AppError('User not found', 404);
        }

        // Check if role already assigned
        const hasRole = await UserRoleModel.hasRole(userId, role, academyId);
        if (hasRole) {
            throw new AppError(`User already has the role '${role}'`, 409);
        }

        await UserRoleModel.assignRole(userId, role, academyId, assignedBy);
        return { message: `Role '${role}' assigned successfully` };
    }

    static async revokeRole(userId, role, academyId = null) {
        const user = await UserModel.findById(userId);
        if (!user) {
            throw new AppError('User not found', 404);
        }

        const revoked = await UserRoleModel.deactivateRole(userId, role, academyId);
        if (!revoked) {
            throw new AppError(`User does not have the role '${role}' or it is already inactive`, 400);
        }

        return { message: `Role '${role}' revoked successfully` };
    }

    static async resetUserPassword(userId, newPassword) {
        const user = await UserModel.findById(userId);
        if (!user) {
            throw new AppError('User not found', 404);
        }

        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(newPassword, salt);

        await UserModel.update(userId, { password_hash });
        return { message: 'Password reset successfully' };
    }
}

module.exports = UserService;