const HomeworkTaskModel = require('../models/homeworkTaskModel');
const StudentHomeworkModel = require('../models/studentHomeworkModel');
const StudentProfileModel = require('../models/studentProfileModel');
const ClassGradeModel = require('../models/classGradeModel');
const SubjectModel = require('../models/subjectModel');
const AppError = require('../utils/AppError');
const pool = require('../config/db');

class HomeworkService {
    static async createTask(data, teacherId, academyId) {
        const { class_grade_id, subject_id } = data;

        // Validate class and subject belong to academy if provided
        if (class_grade_id) {
            const cls = await ClassGradeModel.findById(class_grade_id, academyId);
            if (!cls) throw new AppError('Class not found in this academy', 404);
        }
        if (subject_id) {
            const subj = await SubjectModel.findById(subject_id, academyId);
            if (!subj) throw new AppError('Subject not found in this academy', 404);
        }

        const taskData = {
            ...data,
            academy_id: academyId,
            teacher_id: teacherId
        };

        const taskId = await HomeworkTaskModel.create(taskData);

        // If class_grade_id provided, auto-assign to all students in that class
        if (class_grade_id) {
            const students = await StudentProfileModel.findAll(academyId, { class_grade_id, is_active: true });
            const studentIds = students.map(s => s.id);
            if (studentIds.length) {
                await StudentHomeworkModel.assign(taskId, studentIds, academyId);
            }
        }

        return { id: taskId, message: 'Homework task created successfully' };
    }

    static async assignToStudents(taskId, studentIds, academyId) {
        const task = await HomeworkTaskModel.findById(taskId, academyId);
        if (!task) throw new AppError('Homework task not found', 404);

        // Verify all students exist and are active in the academy
        const students = await StudentProfileModel.findAll(academyId, { is_active: true });
        const validStudentIds = students.map(s => s.id);
        const invalidIds = studentIds.filter(id => !validStudentIds.includes(id));
        if (invalidIds.length) {
            throw new AppError(`Invalid student IDs: ${invalidIds.join(', ')}`, 400);
        }

        const count = await StudentHomeworkModel.assign(taskId, studentIds, academyId);
        return { count, message: `Homework assigned to ${count} students` };
    }

    static async getAllTasks(academyId, filters) {
        return await HomeworkTaskModel.findAll(academyId, filters);
    }

    static async getTaskById(taskId, academyId) {
        const task = await HomeworkTaskModel.findById(taskId, academyId);
        if (!task) throw new AppError('Homework task not found', 404);
        return task;
    }

    static async updateTask(taskId, data, academyId) {
        const task = await HomeworkTaskModel.findById(taskId, academyId);
        if (!task) throw new AppError('Homework task not found', 404);
        await HomeworkTaskModel.update(taskId, data);
        return { message: 'Task updated successfully' };
    }

    static async deleteTask(taskId, academyId) {
        const task = await HomeworkTaskModel.findById(taskId, academyId);
        if (!task) throw new AppError('Homework task not found', 404);
        await HomeworkTaskModel.softDelete(taskId);
        return { message: 'Task deleted successfully' };
    }

    static async getMyHomework(userId, academyId, filters) {
        const student = await StudentProfileModel.findByUserId(userId, academyId);
        if (!student) throw new AppError('Student profile not found', 404);
        return await StudentHomeworkModel.findByStudent(student.id, academyId, filters);
    }

    static async getStudentHomework(studentId, academyId, filters) {
        const student = await StudentProfileModel.findById(studentId, academyId);
        if (!student) throw new AppError('Student not found', 404);
        return await StudentHomeworkModel.findByStudent(studentId, academyId, filters);
    }

    static async getSubmissions(taskId, academyId) {
        const task = await HomeworkTaskModel.findById(taskId, academyId);
        if (!task) throw new AppError('Homework task not found', 404);
        return await StudentHomeworkModel.findByTask(taskId, academyId);
    }

    static async submitHomework(userId, homeworkId, submissionData, academyId) {
        const student = await StudentProfileModel.findByUserId(userId, academyId);
        if (!student) throw new AppError('Student profile not found', 404);

        const task = await HomeworkTaskModel.findById(homeworkId, academyId);
        if (!task) throw new AppError('Homework task not found', 404);

        const submission = {
            status: 'completed',
            submission_date: new Date(),
            ...submissionData
        };

        const updated = await StudentHomeworkModel.updateSubmission(student.id, homeworkId, submission);
        if (!updated) throw new AppError('Homework assignment not found for this student', 404);

        return { message: 'Homework submitted successfully' };
    }

    static async gradeSubmission(submissionId, data, academyId) {
        const { marks_obtained, teacher_comments } = data;

        // Build SET clause dynamically
        const updates = [];
        const values = [];

        if (marks_obtained !== undefined) {
            updates.push('marks_obtained = ?');
            values.push(marks_obtained);
            updates.push('status = ?');
            values.push('completed');
        }
        if (teacher_comments !== undefined) {
            updates.push('teacher_comments = ?');
            values.push(teacher_comments);
        }

        if (updates.length === 0) {
            throw new AppError('No fields to update', 400);
        }

        // Add submissionId and academyId to values
        values.push(submissionId, academyId);

        const query = `UPDATE student_homework SET ${updates.join(', ')} WHERE id = ? AND academy_id = ?`;

        const [result] = await pool.execute(query, values);
        if (result.affectedRows === 0) throw new AppError('Submission not found', 404);

        return { message: 'Submission graded successfully' };
    }
}

module.exports = HomeworkService;