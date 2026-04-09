const PDFReportModel = require('../models/pdfReportModel');
const PDFGenerator = require('../utils/pdfGenerator');
const StudentProfileModel = require('../models/studentProfileModel');
const AttendanceModel = require('../models/attendanceModel');
const TestResultModel = require('../models/testResultModel');
const FeePaymentModel = require('../models/feePaymentModel');
const ExamModel = require('../models/examModel');
const UserModel = require('../models/userModel');
const ClassGradeModel = require('../models/classGradeModel');
const AppError = require('../utils/AppError');
const fs = require('fs');
const path = require('path');

class PDFReportService {
    static async generateAttendanceReport(studentId, period, userId, academyId) {
        const student = await StudentProfileModel.findById(studentId, academyId);
        if (!student) throw new AppError('Student not found', 404);

        const [startDate, endDate] = period.split(',');
        const records = await AttendanceModel.findByStudent(studentId, startDate, endDate, academyId);
        const stats = await AttendanceModel.getStudentStats(studentId, startDate, endDate, academyId);

        const user = await UserModel.findById(student.user_id);
        const classGrade = await ClassGradeModel.findById(student.class_grade_id);

        const reportData = {
            student_name: user.full_name,
            class_name: classGrade?.name || 'N/A',
            period: `${startDate} to ${endDate}`,
            records: records.map(r => ({ date: r.date, status: r.status, remarks: r.remarks })),
            summary: stats
        };

        // Generate PDF
        const generator = new PDFGenerator();
        generator.generateAttendanceReport(reportData);
        const fileName = `attendance_${studentId}_${Date.now()}.pdf`;
        const filePath = path.join(__dirname, '../../uploads/reports', fileName);

        // Ensure directory exists
        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

        const stream = fs.createWriteStream(filePath);
        generator.getDocument().pipe(stream);
        generator.getDocument().end();

        await new Promise((resolve, reject) => {
            stream.on('finish', resolve);
            stream.on('error', reject);
        });

        // Save to database
        const reportId = await PDFReportModel.create({
            academy_id: academyId,
            report_type: 'attendance',
            student_id: studentId,
            class_grade_id: student.class_grade_id,
            academic_period: period,
            report_data: reportData,
            file_path: filePath,
            file_name: fileName,
            generated_by: userId
        });

        return { id: reportId, file_name: fileName, file_path: filePath };
    }

    static async generatePerformanceReport(studentId, period, userId, academyId) {
        const student = await StudentProfileModel.findById(studentId, academyId);
        if (!student) throw new AppError('Student not found', 404);

        const results = await TestResultModel.findByStudent(studentId, academyId);
        const user = await UserModel.findById(student.user_id);
        const classGrade = await ClassGradeModel.findById(student.class_grade_id);

        // Group by subject and calculate grades (simplified)
        const subjectMap = new Map();
        results.forEach(r => {
            const key = r.subject_id;
            if (!subjectMap.has(key)) {
                subjectMap.set(key, { obtained: 0, total: 0, name: r.title });
            }
            const entry = subjectMap.get(key);
            entry.obtained += parseFloat(r.obtained_marks);
            entry.total += parseFloat(r.total_marks);
        });

        const subjects = Array.from(subjectMap.values()).map(s => ({
            subject_name: s.name,
            obtained_marks: s.obtained,
            total_marks: s.total,
            grade: calculateGrade(s.obtained / s.total * 100)
        }));

        const overallAvg = subjects.reduce((sum, s) => sum + (s.obtained / s.total), 0) / subjects.length * 100;
        const overall_grade = calculateGrade(overallAvg);

        const reportData = {
            student_name: user.full_name,
            class_name: classGrade?.name || 'N/A',
            period,
            subjects,
            overall_grade
        };

        const generator = new PDFGenerator();
        generator.generatePerformanceReport(reportData);
        const fileName = `performance_${studentId}_${Date.now()}.pdf`;
        const filePath = path.join(__dirname, '../../uploads/reports', fileName);

        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

        const stream = fs.createWriteStream(filePath);
        generator.getDocument().pipe(stream);
        generator.getDocument().end();
        await new Promise((resolve, reject) => {
            stream.on('finish', resolve);
            stream.on('error', reject);
        });

        const reportId = await PDFReportModel.create({
            academy_id: academyId,
            report_type: 'performance',
            student_id: studentId,
            class_grade_id: student.class_grade_id,
            academic_period: period,
            report_data: reportData,
            file_path: filePath,
            file_name: fileName,
            generated_by: userId
        });

        return { id: reportId, file_name: fileName };
    }

    static async generateFeeReport(studentId, period, userId, academyId) {
        const student = await StudentProfileModel.findById(studentId, academyId);
        if (!student) throw new AppError('Student not found', 404);

        const payments = await FeePaymentModel.findByStudent(studentId, academyId);
        const user = await UserModel.findById(student.user_id);
        const classGrade = await ClassGradeModel.findById(student.class_grade_id);
        const balance = await FeePaymentModel.getStudentBalance(studentId, academyId);
        const totalPaid = payments.reduce((sum, p) => sum + parseFloat(p.amount), 0);

        const reportData = {
            student_name: user.full_name,
            class_name: classGrade?.name || 'N/A',
            period,
            payments,
            total_paid: totalPaid,
            balance_due: balance
        };

        const generator = new PDFGenerator();
        generator.generateFeeReport(reportData);
        const fileName = `fee_${studentId}_${Date.now()}.pdf`;
        const filePath = path.join(__dirname, '../../uploads/reports', fileName);

        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

        const stream = fs.createWriteStream(filePath);
        generator.getDocument().pipe(stream);
        generator.getDocument().end();
        await new Promise((resolve, reject) => {
            stream.on('finish', resolve);
            stream.on('error', reject);
        });

        const reportId = await PDFReportModel.create({
            academy_id: academyId,
            report_type: 'fee',
            student_id: studentId,
            class_grade_id: student.class_grade_id,
            academic_period: period,
            report_data: reportData,
            file_path: filePath,
            file_name: fileName,
            generated_by: userId
        });

        return { id: reportId, file_name: fileName };
    }

    static async generateExamReport(examId, userId, academyId) {
        const exam = await ExamModel.findById(examId, academyId);
        if (!exam) throw new AppError('Exam not found', 404);

        const results = await TestResultModel.findByTest(examId, academyId);
        const classGrade = await ClassGradeModel.findById(exam.class_subject_id); // Note: exam.class_subject_id

        const reportData = {
            exam_title: exam.title,
            class_name: classGrade?.name || 'N/A',
            date: exam.scheduled_date,
            results: results.map(r => ({
                roll_number: r.roll_number,
                student_name: r.student_name,
                obtained_marks: r.obtained_marks,
                total_marks: exam.total_marks,
                grade: r.grade
            }))
        };

        const generator = new PDFGenerator();
        generator.generateExamReport(reportData);
        const fileName = `exam_${examId}_${Date.now()}.pdf`;
        const filePath = path.join(__dirname, '../../uploads/reports', fileName);

        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

        const stream = fs.createWriteStream(filePath);
        generator.getDocument().pipe(stream);
        generator.getDocument().end();
        await new Promise((resolve, reject) => {
            stream.on('finish', resolve);
            stream.on('error', reject);
        });

        const reportId = await PDFReportModel.create({
            academy_id: academyId,
            report_type: 'exam',
            class_grade_id: exam.class_subject_id, // This should be class_grade_id from mapping
            report_data: reportData,
            file_path: filePath,
            file_name: fileName,
            generated_by: userId
        });

        return { id: reportId, file_name: fileName };
    }

    static async getAllReports(academyId, filters) {
        return await PDFReportModel.findAll(academyId, filters);
    }

    static async getReportById(reportId, academyId) {
        const report = await PDFReportModel.findById(reportId, academyId);
        if (!report) throw new AppError('Report not found', 404);
        return { ...report, report_data: JSON.parse(report.report_data) };
    }

    static async deleteReport(reportId, academyId) {
        const report = await PDFReportModel.findById(reportId, academyId);
        if (!report) throw new AppError('Report not found', 404);

        // Delete file if exists
        if (report.file_path && fs.existsSync(report.file_path)) {
            fs.unlinkSync(report.file_path);
        }

        await PDFReportModel.delete(reportId);
        return { message: 'Report deleted successfully' };
    }

    static async downloadReport(reportId, academyId) {
        const report = await PDFReportModel.findById(reportId, academyId);
        if (!report) throw new AppError('Report not found', 404);
        if (!report.file_path || !fs.existsSync(report.file_path)) {
            throw new AppError('Report file not found on server', 404);
        }
        return report.file_path;
    }
}

function calculateGrade(percentage) {
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B';
    if (percentage >= 60) return 'C';
    if (percentage >= 50) return 'D';
    return 'F';
}

module.exports = PDFReportService;