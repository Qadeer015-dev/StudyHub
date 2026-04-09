const SubjectModel = require('../models/subjectModel');
const AppError = require('../utils/AppError');

class SubjectService {
    static async create(data) {
        if (!data.academy_id) throw new AppError('Academy ID is required', 400);
        const id = await SubjectModel.create(data);
        return { id, message: 'Subject created successfully' };
    }

    static async getAll(academyId = null) {
        return await SubjectModel.findAll(academyId);
    }

    static async getById(id, academyId = null) {
        const subject = await SubjectModel.findById(id, academyId);
        if (!subject) throw new AppError('Subject not found', 404);
        return subject;
    }

    static async update(id, data, academyId = null) {
        const subject = await SubjectModel.findById(id, academyId);
        if (!subject) throw new AppError('Subject not found or access denied', 404);

        await SubjectModel.update(id, data);
        return { message: 'Subject updated successfully' };
    }

    static async delete(id, academyId = null) {
        const subject = await SubjectModel.findById(id, academyId);
        if (!subject) throw new AppError('Subject not found or access denied', 404);

        await SubjectModel.softDelete(id);
        return { message: 'Subject deleted successfully' };
    }
}

module.exports = SubjectService;