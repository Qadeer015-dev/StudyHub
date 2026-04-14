const ClassGradeModel = require('../models/classGradeModel');
const AppError = require('../utils/AppError');

class ClassGradeService {
    static async create(data) {
        const { academy_id, name, display_name, grade_level, description } = data;
        
        // Basic validation
        if (!academy_id) throw new AppError('Academy ID is required', 400);

        const id = await ClassGradeModel.create(data);
        return { id, message: 'Class grade created successfully' };
    }

    static async getAll(academyId = null) {
        return await ClassGradeModel.findAll(academyId);
    }

    static async getById(id, academyId = null) {
        const grade = await ClassGradeModel.findById(id, academyId);
        if (!grade) throw new AppError('Class grade not found', 404);
        return grade;
    }

    static async update(id, data, academyId = null) {
        const grade = await ClassGradeModel.findById(id, academyId);
        if (!grade) throw new AppError('Class grade not found or access denied', 404);

        const updated = await ClassGradeModel.update(id, data);
        if (!updated) throw new AppError('Update failed', 500);
        return { message: 'Class grade updated successfully' };
    }

    static async delete(id, academyId = null) {
        const grade = await ClassGradeModel.findById(id, academyId);
        if (!grade) throw new AppError('Class grade not found or access denied', 404);

        await ClassGradeModel.softDelete(id);
        return { message: 'Class grade deleted successfully' };
    }
}

module.exports = ClassGradeService;