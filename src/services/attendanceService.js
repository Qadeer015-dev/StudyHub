const AttendanceModel = require('../models/attendanceModel');
const StudentProfileModel = require('../models/studentProfileModel');
const ClassGradeModel = require('../models/classGradeModel');
const AppError = require('../utils/AppError');

class AttendanceService {
    static async markSingle(data, markedBy, academyId) {
        const { student_id, date, status, remarks } = data;

        // Verify student belongs to academy
        const student = await StudentProfileModel.findById(student_id, academyId);
        if (!student) throw new AppError('Student not found in this academy', 404);

        const record = {
            academy_id: academyId,
            student_id,
            date,
            status,
            remarks,
            marked_by: markedBy
        };

        const id = await AttendanceModel.create(record);
        return { id, message: 'Attendance marked successfully' };
    }

    static async markBulk(data, markedBy, academyId) {
        const { class_grade_id, date, attendance } = data;

        // Verify class belongs to academy
        const classGrade = await ClassGradeModel.findById(class_grade_id, academyId);
        if (!classGrade) throw new AppError('Class not found in this academy', 404);

        // Get students in the class
        const students = await StudentProfileModel.findAll(academyId, { class_grade_id, is_active: true });
        if (!students.length) throw new AppError('No active students found in this class', 404);

        // Build records
        const records = [];
        const studentMap = new Map(students.map(s => [s.id, s]));

        for (const entry of attendance) {
            const student = studentMap.get(entry.student_id);
            if (!student) continue; // skip invalid student IDs

            records.push({
                academy_id: academyId,
                student_id: entry.student_id,
                date,
                status: entry.status,
                remarks: entry.remarks || null,
                marked_by: markedBy
            });
        }

        if (records.length === 0) throw new AppError('No valid attendance records to mark', 400);

        const count = await AttendanceModel.bulkCreate(records);
        return { count, message: `Marked attendance for ${count} students` };
    }

    static async getStudentAttendance(studentId, startDate, endDate, academyId) {
        const student = await StudentProfileModel.findById(studentId, academyId);
        if (!student) throw new AppError('Student not found in this academy', 404);

        const records = await AttendanceModel.findByStudent(studentId, startDate, endDate, academyId);
        const stats = await AttendanceModel.getStudentStats(studentId, startDate, endDate, academyId);

        return { records, stats };
    }

    static async getClassAttendance(classGradeId, date, academyId) {
        const classGrade = await ClassGradeModel.findById(classGradeId, academyId);
        if (!classGrade) throw new AppError('Class not found in this academy', 404);

        const records = await AttendanceModel.findByClass(classGradeId, date, academyId);
        return records;
    }

    static async getMyAttendance(userId, startDate, endDate, academyId) {
        // Get student profile from user ID
        const student = await StudentProfileModel.findByUserId(userId, academyId);
        if (!student) throw new AppError('Student profile not found', 404);

        return await this.getStudentAttendance(student.id, startDate, endDate, academyId);
    }

    static async updateAttendance(id, data, academyId) {
        const record = await AttendanceModel.findById(id, academyId);
        if (!record) throw new AppError('Attendance record not found', 404);

        const allowedFields = ['status', 'remarks'];
        const updateData = {};
        allowedFields.forEach(field => {
            if (data[field] !== undefined) updateData[field] = data[field];
        });

        if (Object.keys(updateData).length === 0) {
            throw new AppError('No valid fields to update', 400);
        }

        await AttendanceModel.update(id, updateData);
        return { message: 'Attendance updated successfully' };
    }

    static async deleteAttendance(id, academyId) {
        const record = await AttendanceModel.findById(id, academyId);
        if (!record) throw new AppError('Attendance record not found', 404);

        await AttendanceModel.delete(id);
        return { message: 'Attendance record deleted successfully' };
    }
}

module.exports = AttendanceService;