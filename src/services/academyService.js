const { v4: uuidv4 } = require('uuid');
const AcademyModel = require('../models/academyModel');
const AppError = require('../utils/AppError');
const generateRegistrationNumber = require("../utils/registrationNumber");



class AcademyService {
    static async createAcademy(data) {
        // Check if email already exists
        const existingAcademy = await AcademyModel.findByEmail(data.academy_email);
        if (existingAcademy) {
            throw new AppError('Academy with this email already exists', 409);
        }

        const academyData = {
            ...data,
            uuid: uuidv4(),
            registration_number: generateRegistrationNumber(12)
        };

        const academyId = await AcademyModel.create(academyData);
        return { id: academyId, uuid: academyData.uuid };
    }

    static async getAllAcademies(filter = {}) {
        return await AcademyModel.findAll(filter);
    }

    static async getAcademyById(id) {
        const academy = await AcademyModel.findById(id);
        if (!academy) {
            throw new AppError('Academy not found', 404);
        }
        return academy;
    }

    static async getAcademyByUuid(uuid) {
        const academy = await AcademyModel.findByUuid(uuid);
        if (!academy) {
            throw new AppError('Academy not found', 404);
        }
        return academy;
    }

    static async updateAcademy(id, data) {
        // Check if academy exists
        const academy = await AcademyModel.findById(id);
        if (!academy) {
            throw new AppError('Academy not found', 404);
        }

        // If email is being updated, check uniqueness
        if (data.email && data.email !== academy.email) {
            const existing = await AcademyModel.findByEmail(data.email);
            if (existing) {
                throw new AppError('Email already in use by another academy', 409);
            }
        }

        const updated = await AcademyModel.update(id, data);
        if (!updated) {
            throw new AppError('Failed to update academy', 500);
        }

        return { message: 'Academy updated successfully' };
    }

    static async deleteAcademy(id) {
        const academy = await AcademyModel.findById(id);
        if (!academy) {
            throw new AppError('Academy not found', 404);
        }

        // Soft delete by default
        const deleted = await AcademyModel.softDelete(id);
        if (!deleted) {
            throw new AppError('Failed to delete academy', 500);
        }

        return { message: 'Academy deleted successfully' };
    }
}

module.exports = AcademyService;