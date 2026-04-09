const FeeStructureModel = require('../models/feeStructureModel');
const FeePaymentModel = require('../models/feePaymentModel');
const StudentProfileModel = require('../models/studentProfileModel');
const ClassGradeModel = require('../models/classGradeModel');
const AppError = require('../utils/AppError');
const pool = require('../config/db');

class FeeService {
    static async createFeeStructure(data, academyId) {
        const { class_grade_id } = data;
        const classGrade = await ClassGradeModel.findById(class_grade_id, academyId);
        if (!classGrade) throw new AppError('Class not found in this academy', 404);

        const id = await FeeStructureModel.create({ ...data, academy_id: academyId });
        return { id, message: 'Fee structure created successfully' };
    }

    static async getAllFeeStructures(academyId, filters) {
        return await FeeStructureModel.findAll(academyId, filters);
    }

    static async updateFeeStructure(id, data, academyId) {
        const structure = await FeeStructureModel.findById(id, academyId);
        if (!structure) throw new AppError('Fee structure not found', 404);
        await FeeStructureModel.update(id, data);
        return { message: 'Fee structure updated successfully' };
    }

    static async deleteFeeStructure(id, academyId) {
        const structure = await FeeStructureModel.findById(id, academyId);
        if (!structure) throw new AppError('Fee structure not found', 404);
        await FeeStructureModel.softDelete(id);
        return { message: 'Fee structure deleted successfully' };
    }

    static async recordPayment(data, recordedBy, academyId) {
        const { student_id, amount, payment_date, payment_method, for_month, for_year } = data;

        const student = await StudentProfileModel.findById(student_id, academyId);
        if (!student) throw new AppError('Student not found in this academy', 404);

        const receiptNumber = await FeePaymentModel.generateReceiptNumber(academyId);

        const paymentData = {
            academy_id: academyId,
            student_id,
            amount,
            payment_date,
            payment_method,
            for_month,
            for_year,
            receipt_number: receiptNumber,
            paid_by: recordedBy,
            status: 'paid'
        };

        const paymentId = await FeePaymentModel.create(paymentData);
        return { id: paymentId, receipt_number: receiptNumber, message: 'Payment recorded successfully' };
    }

    static async getAllPayments(academyId, filters) {
        return await FeePaymentModel.findAll(academyId, filters);
    }

    static async getStudentPayments(studentId, academyId) {
        const student = await StudentProfileModel.findById(studentId, academyId);
        if (!student) throw new AppError('Student not found', 404);
        return await FeePaymentModel.findByStudent(studentId, academyId);
    }

    static async getMyPayments(userId, academyId) {
        const student = await StudentProfileModel.findByUserId(userId, academyId);
        if (!student) throw new AppError('Student profile not found', 404);
        return await FeePaymentModel.findByStudent(student.id, academyId);
    }

    static async getPaymentById(paymentId, academyId) {
        const payment = await FeePaymentModel.findById(paymentId, academyId);
        if (!payment) throw new AppError('Payment not found', 404);
        return payment;
    }

    static async updatePayment(paymentId, data, academyId) {
        const payment = await FeePaymentModel.findById(paymentId, academyId);
        if (!payment) throw new AppError('Payment not found', 404);
        await FeePaymentModel.update(paymentId, data);
        return { message: 'Payment updated successfully' };
    }

    static async deletePayment(paymentId, academyId) {
        const payment = await FeePaymentModel.findById(paymentId, academyId);
        if (!payment) throw new AppError('Payment not found', 404);
        await FeePaymentModel.softDelete(paymentId);
        return { message: 'Payment deleted successfully' };
    }

    static async getStudentFeeStatus(studentId, academyId) {
        const student = await StudentProfileModel.findById(studentId, academyId);
        if (!student) throw new AppError('Student not found', 404);

        const applicableFees = await FeeStructureModel.getStudentApplicableFees(studentId, academyId);
        const payments = await FeePaymentModel.findByStudent(studentId, academyId);
        const balance = await FeePaymentModel.getStudentBalance(studentId, academyId);

        return {
            student_id: studentId,
            applicable_fees: applicableFees,
            payments,
            balance_due: balance
        };
    }
}

module.exports = FeeService;