const ExamModel = require('../models/examModel');
const TestResultModel = require('../models/testResultModel');
const ClassSubjectModel = require('../models/classSubjectModel');
const StudentProfileModel = require('../models/studentProfileModel');
const AppError = require('../utils/AppError');

class ExamService {
    static async createExam(data, academyId) {
        const { class_subject_id } = data;

        const mapping = await ClassSubjectModel.findById(class_subject_id, academyId);
        if (!mapping) throw new AppError('Class-subject mapping not found', 404);

        const examData = { ...data, academy_id: academyId };
        const examId = await ExamModel.create(examData);
        return { id: examId, message: 'Exam created successfully' };
    }

    static async getAllExams(academyId, filters) {
        return await ExamModel.findAll(academyId, filters);
    }

    static async getExamById(examId, academyId) {
        const exam = await ExamModel.findById(examId, academyId);
        if (!exam) throw new AppError('Exam not found', 404);
        return exam;
    }

    static async updateExam(examId, data, academyId) {
        const exam = await ExamModel.findById(examId, academyId);
        if (!exam) throw new AppError('Exam not found', 404);
        await ExamModel.update(examId, data);
        return { message: 'Exam updated successfully' };
    }

    static async deleteExam(examId, academyId) {
        const exam = await ExamModel.findById(examId, academyId);
        if (!exam) throw new AppError('Exam not found', 404);
        await ExamModel.softDelete(examId);
        return { message: 'Exam deleted successfully' };
    }

    static async addTestResult(data, academyId) {
        const { test_id, student_id, obtained_marks, grade, remarks } = data;

        const exam = await ExamModel.findById(test_id, academyId);
        if (!exam) throw new AppError('Exam not found', 404);

        const student = await StudentProfileModel.findById(student_id, academyId);
        if (!student) throw new AppError('Student not found', 404);

        const resultId = await TestResultModel.create({
            academy_id: academyId,
            test_id,
            student_id,
            obtained_marks,
            grade,
            remarks
        });
        return { id: resultId, message: 'Test result added successfully' };
    }

    static async addBulkResults(testId, results, academyId) {
        const exam = await ExamModel.findById(testId, academyId);
        if (!exam) throw new AppError('Exam not found', 404);

        const students = await StudentProfileModel.findAll(academyId, { is_active: true });
        const validStudentIds = new Set(students.map(s => s.id));

        const records = [];
        for (const r of results) {
            if (!validStudentIds.has(r.student_id)) continue;
            records.push({
                academy_id: academyId,
                test_id: testId,
                student_id: r.student_id,
                obtained_marks: r.obtained_marks,
                grade: r.grade || null,
                remarks: r.remarks || null
            });
        }

        if (records.length === 0) throw new AppError('No valid student results provided', 400);

        const count = await TestResultModel.bulkCreate(records);
        return { count, message: `${count} test results recorded` };
    }

    static async getTestResults(testId, academyId) {
        const exam = await ExamModel.findById(testId, academyId);
        if (!exam) throw new AppError('Exam not found', 404);
        return await TestResultModel.findByTest(testId, academyId);
    }

    static async getStudentResults(studentId, academyId) {
        const student = await StudentProfileModel.findById(studentId, academyId);
        if (!student) throw new AppError('Student not found', 404);
        return await TestResultModel.findByStudent(studentId, academyId);
    }

    static async getMyResults(userId, academyId) {
        const student = await StudentProfileModel.findByUserId(userId, academyId);
        if (!student) throw new AppError('Student profile not found', 404);
        return await TestResultModel.findByStudent(student.id, academyId);
    }

    static async updateResult(resultId, data, academyId) {
        // Simple update, assuming result exists and belongs to academy
        const updated = await TestResultModel.update(resultId, data);
        if (!updated) throw new AppError('Result not found', 404);
        return { message: 'Result updated successfully' };
    }
}

module.exports = ExamService;