const UserService = require('../services/userService');
const AppError = require('../utils/AppError');

class UserController {
    static async getAll(req, res, next) {
        try {
            const filter = {
                academy_id: req.query.academy_id,
                is_active: req.query.is_active === 'true' ? true :
                    req.query.is_active === 'false' ? false : undefined
            };
            const users = await UserService.getAllUsers(filter);
            res.status(200).json({
                success: true,
                count: users.length,
                data: users
            });
        } catch (error) {
            next(error);
        }
    }

    static async getById(req, res, next) {
        try {
            const id = parseInt(req.params.id);
            const user = await UserService.getUserById(id);
            res.status(200).json({
                success: true,
                data: user
            });
        } catch (error) {
            next(error);
        }
    }

    static async update(req, res, next) {
        try {
            const id = parseInt(req.params.id);
            const result = await UserService.updateUser(id, req.body, req.user);
            res.status(200).json({
                success: true,
                message: result.message
            });
        } catch (error) {
            next(error);
        }
    }

    static async delete(req, res, next) {
        try {
            const id = parseInt(req.params.id);
            const result = await UserService.deleteUser(id, req.user);
            res.status(200).json({
                success: true,
                message: result.message
            });
        } catch (error) {
            next(error);
        }
    }

    static async assignRole(req, res, next) {
        try {
            const userId = parseInt(req.params.id);
            const { role, academy_id } = req.body;
            const result = await UserService.assignRole(userId, role, academy_id, req.user.id);
            res.status(200).json({
                success: true,
                message: result.message
            });
        } catch (error) {
            next(error);
        }
    }

    static async revokeRole(req, res, next) {
        try {
            const userId = parseInt(req.params.id);
            const { role, academy_id } = req.body;
            const result = await UserService.revokeRole(userId, role, academy_id);
            res.status(200).json({
                success: true,
                message: result.message
            });
        } catch (error) {
            next(error);
        }
    }

    static async resetPassword(req, res, next) {
        try {
            const userId = parseInt(req.params.id);
            const { new_password } = req.body;
            const result = await UserService.resetUserPassword(userId, new_password);
            res.status(200).json({
                success: true,
                message: result.message
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = UserController;