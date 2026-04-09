const StudentProfileModel = require('../models/studentProfileModel');
const UserModel = require('../models/userModel');
const UserRoleModel = require('../models/userRoleModel');
const AppError = require('../utils/AppError');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

class StudentProfileService {
    static async create(data, createdBy) {
        const { academy_id, email, phone, full_name, password, class_grade_id, ...profileData } = data;

        // Check if user exists
        let userId;
        const existingUser = await UserModel.findByEmail(email);
        if (existingUser) {
            // User already exists, ensure they have student role
            const hasStudentRole = await UserRoleModel.hasRole(existingUser.id, 'student', academy_id);
            if (!hasStudentRole) {
                await UserRoleModel.assignRole(existingUser.id, 'student', academy_id, createdBy);
            }
            userId = existingUser.id;
        } else {
            // Create new user
            const salt = await bcrypt.genSalt(10);
            const password_hash = await bcrypt.hash(password, salt);
            const userData = {
                uuid: uuidv4(),
                academy_id,
                email,
                phone: phone || null,
                password_hash,
                full_name
            };
            userId = await UserModel.create(userData);
            await UserRoleModel.assignRole(userId, 'student', academy_id, createdBy);
        }

        // Check if student profile already exists
        const existingProfile = await StudentProfileModel.findByUserId(userId, academy_id);
        if (existingProfile) {
            throw new AppError('Student profile already exists for this user', 409);
        }

        // Create student profile
        const profileId = await StudentProfileModel.create({
            academy_id,
            user_id: userId,
            class_grade_id,
            ...profileData
        });

        return { id: profileId, user_id: userId, message: 'Student profile created successfully' };
    }

    static async getAll(academyId, filters = {}) {
        return await StudentProfileModel.findAll(academyId, filters);
    }

    static async getById(id, academyId) {
        const profile = await StudentProfileModel.findById(id, academyId);
        if (!profile) throw new AppError('Student profile not found', 404);

        // Get user details
        const user = await UserModel.findById(profile.user_id);
        return { ...profile, user };
    }

    static async getMyProfile(userId, academyId) {
        const profile = await StudentProfileModel.findByUserId(userId, academyId);
        if (!profile) throw new AppError('Student profile not found', 404);
        return profile;
    }

    static async update(id, data, academyId) {
        const profile = await StudentProfileModel.findById(id, academyId);
        if (!profile) throw new AppError('Student profile not found or access denied', 404);

        await StudentProfileModel.update(id, data);
        return { message: 'Student profile updated successfully' };
    }

    static async delete(id, academyId) {
        const profile = await StudentProfileModel.findById(id, academyId);
        if (!profile) throw new AppError('Student profile not found or access denied', 404);

        await StudentProfileModel.softDelete(id);
        return { message: 'Student profile deleted successfully' };
    }
}

module.exports = StudentProfileService;