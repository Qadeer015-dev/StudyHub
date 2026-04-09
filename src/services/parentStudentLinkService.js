const ParentStudentLinkModel = require('../models/parentStudentLinkModel');
const StudentProfileModel = require('../models/studentProfileModel');
const ParentProfileModel = require('../models/parentProfileModel');
const AppError = require('../utils/AppError');

class ParentStudentLinkService {
    static async link(data) {
        const { academy_id, parent_id, student_id, relation, is_primary } = data;

        // Verify both profiles exist and belong to academy
        const parent = await ParentProfileModel.findById(parent_id, academy_id);
        if (!parent) throw new AppError('Parent profile not found in this academy', 404);
        const student = await StudentProfileModel.findById(student_id, academy_id);
        if (!student) throw new AppError('Student profile not found in this academy', 404);

        // Check if link already exists (unique constraint will catch, but we pre-check)
        const existingLinks = await ParentStudentLinkModel.findByParent(parent_id, academy_id);
        const alreadyLinked = existingLinks.some(link => link.student_id === student_id);
        if (alreadyLinked) throw new AppError('Parent is already linked to this student', 409);

        const id = await ParentStudentLinkModel.create(data);
        return { id, message: 'Parent linked to student successfully' };
    }

    static async getParentsByStudent(studentId, academyId) {
        return await ParentStudentLinkModel.findByStudent(studentId, academyId);
    }

    static async getStudentsByParent(parentId, academyId) {
        return await ParentStudentLinkModel.findByParent(parentId, academyId);
    }

    static async unlink(parentId, studentId) {
        const deleted = await ParentStudentLinkModel.delete(parentId, studentId);
        if (!deleted) throw new AppError('Link not found', 404);
        return { message: 'Parent unlinked from student successfully' };
    }

    static async updateLink(id, data) {
        const updated = await ParentStudentLinkModel.update(id, data);
        if (!updated) throw new AppError('Link not found', 404);
        return { message: 'Link updated successfully' };
    }
}

module.exports = ParentStudentLinkService;