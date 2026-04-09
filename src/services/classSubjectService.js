const ClassSubjectModel = require('../models/classSubjectModel');
const ClassGradeModel = require('../models/classGradeModel');
const SubjectModel = require('../models/subjectModel');
const AppError = require('../utils/AppError');

class ClassSubjectService {
    static async assign(data) {
        const { academy_id, class_grade_id, subject_id } = data;

        // Verify class exists and belongs to academy
        const classGrade = await ClassGradeModel.findById(class_grade_id, academy_id);
        if (!classGrade) throw new AppError('Class grade not found in this academy', 404);

        // Verify subject exists and belongs to academy
        const subject = await SubjectModel.findById(subject_id, academy_id);
        if (!subject) throw new AppError('Subject not found in this academy', 404);

        const id = await ClassSubjectModel.assignSubjectToClass(data);
        return { id, message: 'Subject assigned to class successfully' };
    }

    static async getByClass(classGradeId, academyId = null) {
        return await ClassSubjectModel.findByClass(classGradeId, academyId);
    }

    static async getBySubject(subjectId, academyId = null) {
        return await ClassSubjectModel.findBySubject(subjectId, academyId);
    }

    static async update(id, data, academyId = null) {
        const mapping = await ClassSubjectModel.findById(id, academyId);
        if (!mapping) throw new AppError('Class-subject mapping not found', 404);

        await ClassSubjectModel.update(id, data);
        return { message: 'Mapping updated successfully' };
    }

    static async remove(id, academyId = null) {
        const mapping = await ClassSubjectModel.findById(id, academyId);
        if (!mapping) throw new AppError('Mapping not found', 404);

        await ClassSubjectModel.softDelete(id);
        return { message: 'Subject removed from class successfully' };
    }
}

module.exports = ClassSubjectService;