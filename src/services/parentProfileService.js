const ParentProfileModel = require('../models/parentProfileModel');
const UserModel = require('../models/userModel');
const UserRoleModel = require('../models/userRoleModel');
const AppError = require('../utils/AppError');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

class ParentProfileService {
    static async create(data, createdBy) {
        const { academy_id, email, phone, full_name, password, ...profileData } = data;

        let userId;
        const existingUser = await UserModel.findByEmail(email);
        if (existingUser) {
            const hasParentRole = await UserRoleModel.hasRole(existingUser.id, 'parent', academy_id);
            if (!hasParentRole) {
                await UserRoleModel.assignRole(existingUser.id, 'parent', academy_id, createdBy);
            }
            userId = existingUser.id;
        } else {
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
            await UserRoleModel.assignRole(userId, 'parent', academy_id, createdBy);
        }

        const existingProfile = await ParentProfileModel.findByUserId(userId, academy_id);
        if (existingProfile) {
            throw new AppError('Parent profile already exists for this user', 409);
        }

        const profileId = await ParentProfileModel.create({
            academy_id,
            user_id: userId,
            ...profileData
        });

        return { id: profileId, user_id: userId, message: 'Parent profile created successfully' };
    }

    static async getAll(academyId) {
        return await ParentProfileModel.findAll(academyId);
    }

    static async getById(id, academyId) {
        const profile = await ParentProfileModel.findById(id, academyId);
        if (!profile) throw new AppError('Parent profile not found', 404);
        const user = await UserModel.findById(profile.user_id);
        return { ...profile, user };
    }

    static async getMyProfile(userId, academyId) {
        const profile = await ParentProfileModel.findByUserId(userId, academyId);
        if (!profile) throw new AppError('Parent profile not found', 404);
        return profile;
    }

    static async update(id, data, academyId) {
        const profile = await ParentProfileModel.findById(id, academyId);
        if (!profile) throw new AppError('Parent profile not found', 404);
        await ParentProfileModel.update(id, data);
        return { message: 'Parent profile updated successfully' };
    }

    static async delete(id, academyId) {
        const profile = await ParentProfileModel.findById(id, academyId);
        if (!profile) throw new AppError('Parent profile not found', 404);
        await ParentProfileModel.softDelete(id);
        return { message: 'Parent profile deleted successfully' };
    }
}

module.exports = ParentProfileService;