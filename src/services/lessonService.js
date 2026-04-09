const LessonModel = require('../models/lessonModel');
const StudentLessonProgressModel = require('../models/studentLessonProgressModel');
const ClassSubjectModel = require('../models/classSubjectModel');
const StudentProfileModel = require('../models/studentProfileModel');
const AppError = require('../utils/AppError');

class LessonService {
    static async create(data, academyId) {
        const { class_subject_id } = data;

        // Verify class_subject exists and belongs to academy
        const mapping = await ClassSubjectModel.findById(class_subject_id, academyId);
        if (!mapping) throw new AppError('Class-subject mapping not found in this academy', 404);

        const lessonData = {
            ...data,
            academy_id: academyId
        };

        const lessonId = await LessonModel.create(lessonData);
        return { id: lessonId, message: 'Lesson created successfully' };
    }

    static async getLessonsByClassSubject(classSubjectId, academyId) {
        const mapping = await ClassSubjectModel.findById(classSubjectId, academyId);
        if (!mapping) throw new AppError('Class-subject mapping not found', 404);
        return await LessonModel.findByClassSubject(classSubjectId, academyId);
    }

    static async getLessonById(lessonId, academyId) {
        const lesson = await LessonModel.findById(lessonId, academyId);
        if (!lesson) throw new AppError('Lesson not found', 404);
        return lesson;
    }

    static async updateLesson(lessonId, data, academyId) {
        const lesson = await LessonModel.findById(lessonId, academyId);
        if (!lesson) throw new AppError('Lesson not found or access denied', 404);
        await LessonModel.update(lessonId, data);
        return { message: 'Lesson updated successfully' };
    }

    static async deleteLesson(lessonId, academyId) {
        const lesson = await LessonModel.findById(lessonId, academyId);
        if (!lesson) throw new AppError('Lesson not found or access denied', 404);
        await LessonModel.softDelete(lessonId);
        return { message: 'Lesson deleted successfully' };
    }

    static async updateProgress(userId, data, academyId) {
        const { lesson_id, status, mastery_level, notes } = data;

        // Get student profile from user ID
        const student = await StudentProfileModel.findByUserId(userId, academyId);
        if (!student) throw new AppError('Student profile not found', 404);

        // Verify lesson exists and belongs to academy
        const lesson = await LessonModel.findById(lesson_id, academyId);
        if (!lesson) throw new AppError('Lesson not found', 404);

        const progressData = {
            academy_id: academyId,
            student_id: student.id,
            lesson_id,
            status: status || 'in_progress',
            mastery_level: mastery_level || 'beginner',
            notes: notes || null,
            start_date: status === 'in_progress' ? new Date() : null,
            completion_date: status === 'completed' ? new Date() : null
        };

        await StudentLessonProgressModel.createOrUpdate(progressData);
        return { message: 'Progress updated successfully' };
    }

    static async getMyProgress(userId, classSubjectId, academyId) {
        const student = await StudentProfileModel.findByUserId(userId, academyId);
        if (!student) throw new AppError('Student profile not found', 404);
        return await StudentLessonProgressModel.findByStudent(student.id, classSubjectId, academyId);
    }

    static async getStudentProgress(studentId, classSubjectId, academyId) {
        const student = await StudentProfileModel.findById(studentId, academyId);
        if (!student) throw new AppError('Student not found', 404);
        return await StudentLessonProgressModel.findByStudent(studentId, classSubjectId, academyId);
    }

    static async getLessonProgress(lessonId, academyId) {
        const lesson = await LessonModel.findById(lessonId, academyId);
        if (!lesson) throw new AppError('Lesson not found', 404);
        return await StudentLessonProgressModel.findByLesson(lessonId, academyId);
    }
}

module.exports = LessonService;